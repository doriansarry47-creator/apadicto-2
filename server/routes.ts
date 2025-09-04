import type { Express } from "express";
import { storage } from "./storage.js";
import { AuthService, requireAuth, requireAdmin } from "./auth.js";
import { insertCravingEntrySchema, insertExerciseSessionSchema, insertBeckAnalysisSchema, insertUserSchema, insertExerciseSchema, insertPsychoEducationContentSchema } from "../shared/schema.js";
import { z } from "zod";
import { db } from './db.js';
import { sql } from 'drizzle-orm';

export function registerRoutes(app: Express) {

  app.get("/api/test-db", async (_req, res) => {
    try {
      const result = await db.execute(sql`SELECT 1 as one`);
      res.json({ ok: true, result: result.rows });
    } catch (e) {
      console.error("Database connection test failed:", e);
      res.status(500).json({ ok: false, error: e instanceof Error ? e.message : String(e) });
    }
  });
  
  // Routes d'authentification
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, role } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
      }

      const user = await AuthService.register({
        email,
        password,
        firstName,
        lastName,
        role,
      });

      req.session.user = user;
      res.json({ user, message: "Inscription réussie" });
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Erreur lors de l'inscription" 
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
      }

      const user = await AuthService.login(email, password);
      req.session.user = user;
      res.json({ user, message: "Connexion réussie" });
    } catch (error) {
      res.status(401).json({ 
        message: error instanceof Error ? error.message : "Erreur de connexion" 
      });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors de la déconnexion" });
      }
      res.json({ message: "Déconnexion réussie" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Session non valide" });
      }
      const user = await AuthService.getUserById(req.session.user.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération du profil" });
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email requis" });
      }

      // Get client IP address
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';

      const result = await AuthService.requestPasswordReset(email, ipAddress);
      
      if (result.success) {
        res.json({ message: result.message });
      } else {
        res.status(429).json({ message: result.message });
      }
    } catch (error) {
      console.error('❌ Password reset request error:', error);
      res.status(500).json({ 
        message: "Erreur lors de la demande de réinitialisation" 
      });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token et nouveau mot de passe requis" });
      }

      const result = await AuthService.resetPasswordWithToken(token, newPassword);
      
      if (result.success) {
        res.json({ message: result.message });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (error) {
      console.error('❌ Password reset error:', error);
      res.status(500).json({ 
        message: "Erreur lors de la réinitialisation du mot de passe" 
      });
    }
  });

  app.get("/api/auth/validate-reset-token", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Token requis" });
      }

      const result = await AuthService.validateResetToken(token);
      
      if (result.valid) {
        res.json({ valid: true });
      } else {
        res.status(400).json({ valid: false, message: result.message });
      }
    } catch (error) {
      console.error('❌ Token validation error:', error);
      res.status(500).json({ 
        valid: false, 
        message: "Erreur lors de la validation du token" 
      });
    }
  });

  // Routes pour les exercices (admin seulement pour création/modification)
  app.get("/api/exercises", async (req, res) => {
    try {
      const exercises = await storage.getExercises();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des exercices" });
    }
  });

  app.post("/api/exercises", requireAdmin, async (req, res) => {
    try {
      const data = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(data);
      res.json(exercise);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Validation échouée" });
    }
  });

  // Routes pour le contenu psychoéducatif
  app.get("/api/psycho-education", async (req, res) => {
    try {
      const content = await storage.getPsychoEducationContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération du contenu" });
    }
  });

  app.post("/api/psycho-education", requireAdmin, async (req, res) => {
    try {
      const data = insertPsychoEducationContentSchema.parse(req.body);
      const content = await storage.createPsychoEducationContent(data);
      res.json(content);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Validation échouée" });
    }
  });

  // Admin routes
  app.get("/api/admin/exercises", requireAdmin, async (req, res) => {
    try {
      const exercises = await storage.getAllExercises();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all exercises" });
    }
  });

  app.get("/api/admin/psycho-education", requireAdmin, async (req, res) => {
    try {
      const content = await storage.getAllPsychoEducationContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all psycho-education content" });
    }
  });
  
  // Craving entries routes
  app.post("/api/cravings", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const data = insertCravingEntrySchema.parse({
        ...req.body,
        userId: req.session.user.id
      });
      const entry = await storage.createCravingEntry(data);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Validation failed" });
    }
  });

  app.get("/api/cravings", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const entries = await storage.getCravingEntries(userId, limit);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch craving entries" });
    }
  });

  app.get("/api/cravings/stats", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const days = req.query.days ? parseInt(req.query.days as string) : undefined;
      const stats = await storage.getCravingStats(userId, days);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch craving stats" });
    }
  });

  // Exercise sessions routes
  app.post("/api/exercise-sessions", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const data = insertExerciseSessionSchema.parse({
        ...req.body,
        userId: req.session.user.id
      });
      const session = await storage.createExerciseSession(data);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Validation failed" });
    }
  });

  app.get("/api/exercise-sessions", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const sessions = await storage.getExerciseSessions(userId, limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercise sessions" });
    }
  });

  // Beck analysis routes
  app.post("/api/beck-analyses", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const data = insertBeckAnalysisSchema.parse({
        ...req.body,
        userId: req.session.user.id
      });
      const analysis = await storage.createBeckAnalysis(data);
      res.json(analysis);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Validation failed" });
    }
  });

  app.get("/api/beck-analyses", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const analyses = await storage.getBeckAnalyses(userId, limit);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Beck analyses" });
    }
  });

  // User stats and badges routes
  app.get("/api/users/stats", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  app.get("/api/users/badges", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const badges = await storage.getUserBadges(userId);
      res.json(badges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user badges" });
    }
  });

  app.get("/api/users/profile", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/users/profile", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const { firstName, lastName, email } = req.body;
      const updatedUser = await AuthService.updateUser(userId, { firstName, lastName, email });
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Erreur lors de la mise à jour du profil" });
    }
  });

  app.put("/api/users/password", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const { oldPassword, newPassword } = req.body;
      await AuthService.updatePassword(userId, oldPassword, newPassword);
      res.json({ message: "Mot de passe mis à jour avec succès" });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Erreur lors de la mise à jour du mot de passe" });
    }
  });

  app.delete("/api/users/profile", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      await storage.deleteUser(userId);
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Erreur lors de la déconnexion après la suppression du compte" });
        }
        res.json({ message: "Compte supprimé avec succès" });
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du compte" });
    }
  });

  // Create demo user for development
  app.post("/api/demo-user", async (req, res) => {
    try {
      const user = await storage.createUser({
        email: "demo@example.com",
        password: "demo123",
        firstName: "Utilisateur",
        lastName: "Demo",
        role: "patient",
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to create demo user" });
    }
  });

  // Route pour initialiser les données d'exemple
  app.post("/api/seed-data", requireAdmin, async (req, res) => {
    try {
      const { seedData } = await import("./seed-data.js");
      await seedData();
      res.json({ message: "Données d'exemple créées avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création des données d'exemple" });
    }
  });

}
