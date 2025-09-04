import { storage } from '../storage.js';
import type { PasswordResetAttempt, InsertPasswordResetAttempt } from '../../shared/schema.js';

export interface RateLimitConfig {
  maxAttempts: number;
  windowMinutes: number;
  blockDurationMinutes: number;
}

export class RateLimitService {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = {
    maxAttempts: 5,
    windowMinutes: 15,
    blockDurationMinutes: 30
  }) {
    this.config = config;
  }

  async checkRateLimit(email: string, ipAddress: string): Promise<{ allowed: boolean; remainingAttempts?: number; blockedUntil?: Date }> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - (this.config.windowMinutes * 60 * 1000));

    // Get existing attempts for this email/IP combination
    const existingAttempt = await storage.getPasswordResetAttempt(email, ipAddress);

    if (!existingAttempt) {
      // No previous attempts, allow and create new record
      await storage.createPasswordResetAttempt({
        email,
        ipAddress,
        attemptCount: 1,
      });
      return { 
        allowed: true, 
        remainingAttempts: this.config.maxAttempts - 1 
      };
    }

    // Check if currently blocked
    if (existingAttempt.blockedUntil && existingAttempt.blockedUntil > now) {
      return { 
        allowed: false, 
        blockedUntil: existingAttempt.blockedUntil 
      };
    }

    // Check if we're within the time window
    const timeSinceLastAttempt = now.getTime() - existingAttempt.lastAttemptAt.getTime();
    const isWithinWindow = timeSinceLastAttempt < (this.config.windowMinutes * 60 * 1000);

    if (!isWithinWindow) {
      // Reset counter if outside window
      await storage.updatePasswordResetAttempt(existingAttempt.id, {
        attemptCount: 1,
        blockedUntil: null,
      });
      return { 
        allowed: true, 
        remainingAttempts: this.config.maxAttempts - 1 
      };
    }

    // Within window, increment counter
    const newAttemptCount = (existingAttempt.attemptCount || 0) + 1;

    if (newAttemptCount >= this.config.maxAttempts) {
      // Block the user
      const blockedUntil = new Date(now.getTime() + (this.config.blockDurationMinutes * 60 * 1000));
      await storage.updatePasswordResetAttempt(existingAttempt.id, {
        attemptCount: newAttemptCount,
        blockedUntil,
      });
      return { 
        allowed: false, 
        blockedUntil 
      };
    }

    // Still within limits
    await storage.updatePasswordResetAttempt(existingAttempt.id, {
      attemptCount: newAttemptCount,
    });

    return { 
      allowed: true, 
      remainingAttempts: this.config.maxAttempts - newAttemptCount 
    };
  }

  async clearAttempts(email: string, ipAddress: string): Promise<void> {
    const existingAttempt = await storage.getPasswordResetAttempt(email, ipAddress);
    if (existingAttempt) {
      await storage.updatePasswordResetAttempt(existingAttempt.id, {
        attemptCount: 0,
        blockedUntil: null,
      });
    }
  }

  async cleanupExpiredBlocks(): Promise<number> {
    const now = new Date();
    return await storage.cleanupExpiredPasswordResetAttempts(now);
  }

  formatBlockedMessage(blockedUntil: Date): string {
    const now = new Date();
    const minutesRemaining = Math.ceil((blockedUntil.getTime() - now.getTime()) / (1000 * 60));
    return `Trop de tentatives de réinitialisation. Réessayez dans ${minutesRemaining} minute(s).`;
  }

  formatRemainingAttemptsMessage(remainingAttempts: number): string {
    return `${remainingAttempts} tentative(s) restante(s) avant blocage temporaire.`;
  }
}

export const rateLimitService = new RateLimitService();