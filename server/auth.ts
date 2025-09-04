import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { storage } from './storage.js';
import { getEmailService } from './services/email.js';
import { rateLimitService } from './services/rate-limit.js';
import type { InsertUser, User } from '../shared/schema.js';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async register(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }): Promise<AuthUser> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await storage.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Hacher le mot de passe
    const hashedPassword = await this.hashPassword(userData.password);

    // Créer l'utilisateur
    const newUser: InsertUser = {
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      role: userData.role || 'patient',
    };

    const user = await storage.createUser(newUser);
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  static async login(email: string, password: string): Promise<AuthUser> {
    // Trouver l'utilisateur par email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isValidPassword = await this.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      throw new Error('Compte désactivé');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  static async getUserById(id: string): Promise<AuthUser | null> {
    const user = await storage.getUser(id);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  static async updateUser(userId: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<AuthUser> {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (data.email && data.email !== user.email) {
      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        throw new Error("Cet email est déjà utilisé par un autre compte.");
      }
    }

    const updatedUser = await storage.updateUser(userId, {
      firstName: data.firstName ?? user.firstName,
      lastName: data.lastName ?? user.lastName,
      email: data.email ?? user.email,
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
    };
  }

  static async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    if (!oldPassword || !newPassword) {
      throw new Error("L'ancien et le nouveau mot de passe sont requis.");
    }
    if (newPassword.length < 6) {
      throw new Error("Le nouveau mot de passe doit contenir au moins 6 caractères.");
    }

    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé.");
    }

    const isMatch = await this.verifyPassword(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("L'ancien mot de passe est incorrect.");
    }

    const hashedNewPassword = await this.hashPassword(newPassword);
    await storage.updatePassword(userId, hashedNewPassword);
  }

  static async requestPasswordReset(email: string, ipAddress: string): Promise<{ success: boolean; message: string }> {
    // Check rate limiting
    const rateLimitResult = await rateLimitService.checkRateLimit(email, ipAddress);
    if (!rateLimitResult.allowed) {
      if (rateLimitResult.blockedUntil) {
        return {
          success: false,
          message: rateLimitService.formatBlockedMessage(rateLimitResult.blockedUntil)
        };
      }
    }

    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      // For security reasons, don't reveal if the email exists
      // But still apply rate limiting
      return {
        success: true,
        message: 'Si un compte avec cet email existe, vous recevrez un lien de réinitialisation.'
      };
    }

    // Generate secure token
    const resetToken = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save token to database
    await storage.createPasswordResetToken({
      userId: user.id,
      token: resetToken,
      expiresAt,
    });

    // Send email if email service is configured
    const emailService = getEmailService();
    if (emailService) {
      try {
        await emailService.sendPasswordResetEmail(email, resetToken, user.firstName || undefined);
        console.log(`📧 Password reset email sent to: ${email}`);
      } catch (error) {
        console.error('❌ Failed to send password reset email:', error);
        // Continue anyway - token is still valid for manual entry
      }
    } else {
      console.warn('⚠️ Email service not configured - password reset token generated but no email sent');
    }

    return {
      success: true,
      message: 'Si un compte avec cet email existe, vous recevrez un lien de réinitialisation.'
    };
  }

  static async resetPasswordWithToken(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    if (!token || !newPassword) {
      return {
        success: false,
        message: 'Token et nouveau mot de passe requis.'
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères.'
      };
    }

    // Find and validate token
    const resetToken = await storage.getPasswordResetToken(token);
    if (!resetToken) {
      return {
        success: false,
        message: 'Token de réinitialisation invalide ou expiré.'
      };
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      return {
        success: false,
        message: 'Token de réinitialisation expiré.'
      };
    }

    // Check if token is already used
    if (resetToken.used) {
      return {
        success: false,
        message: 'Token de réinitialisation déjà utilisé.'
      };
    }

    // Get user
    const user = await storage.getUser(resetToken.userId);
    if (!user) {
      return {
        success: false,
        message: 'Utilisateur non trouvé.'
      };
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update password and mark token as used
    await storage.updatePassword(user.id, hashedPassword);
    await storage.markPasswordResetTokenAsUsed(resetToken.id);

    console.log(`🔑 Password reset completed for user: ${user.email}`);

    return {
      success: true,
      message: 'Mot de passe réinitialisé avec succès.'
    };
  }

  static async validateResetToken(token: string): Promise<{ valid: boolean; message?: string }> {
    if (!token) {
      return { valid: false, message: 'Token requis.' };
    }

    const resetToken = await storage.getPasswordResetToken(token);
    if (!resetToken) {
      return { valid: false, message: 'Token invalide.' };
    }

    if (resetToken.expiresAt < new Date()) {
      return { valid: false, message: 'Token expiré.' };
    }

    if (resetToken.used) {
      return { valid: false, message: 'Token déjà utilisé.' };
    }

    return { valid: true };
  }

  private static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

// Middleware pour vérifier l'authentification
export function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }
  next();
}

// Middleware pour vérifier le rôle admin
export function requireAdmin(req: any, res: any, next: any) {
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }
  
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès administrateur requis' });
  }
  
  next();
}

