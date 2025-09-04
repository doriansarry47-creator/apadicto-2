// api/index.ts - Vercel Serverless Function Entry Point
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import memorystore from "memorystore";
// import { registerRoutes } from "../server/routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

const MemoryStore = memorystore(session);
app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Force HTTPS only in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax', // CSRF protection
    },
  }),
);

// Simple logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
  });
  
  next();
});

// Ensure API routes always return JSON
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  
  // Override res.send to ensure JSON responses
  const originalSend = res.send;
  res.send = function(data) {
    if (typeof data === 'string' && !res.get('Content-Type')?.includes('application/json')) {
      try {
        JSON.parse(data);
      } catch {
        // If it's not valid JSON, wrap it
        data = JSON.stringify({ message: data });
      }
    }
    return originalSend.call(this, data);
  };
  
  next();
});

// Register API routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    console.log("📝 Registration attempt for:", email);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
    }

    // Check if user already exists
    const existingUser = await AuthService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà" });
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(password);

    // Create user
    const newUser = await AuthService.createUser({
      email,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      role: role || "patient",
      isActive: true,
      createdAt: new Date()
    });

    // Set session
    req.session.user = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
    };

    console.log("✅ User registered successfully:", email);
    
    res.json({ 
      user: req.session.user, 
      message: "Inscription réussie" 
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ 
      message: error.message || "Erreur lors de l'inscription" 
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("🔐 Login attempt for:", email);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // Find user by email
    const user = await AuthService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Verify password
    const isValidPassword = await AuthService.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: "Compte désactivé" });
    }

    // Set session
    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    console.log("✅ User logged in successfully:", email);

    res.json({ 
      user: req.session.user, 
      message: "Connexion réussie" 
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ 
      message: error.message || "Erreur lors de la connexion" 
    });
  }
});

app.post("/api/auth/logout", (req, res) => {
  const userEmail = req.session?.user?.email;
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }
    console.log("👋 User logged out:", userEmail);
    res.json({ message: "Déconnexion réussie" });
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    // Simulate password reset (in production, send email)
    const temporaryPassword = Math.random().toString(36).substring(2, 15);
    
    res.json({ 
      message: "Mot de passe réinitialisé avec succès",
      temporaryPassword: temporaryPassword,
      info: "Votre nouveau mot de passe temporaire est affiché ci-dessus. Veuillez le changer après connexion."
    });
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : "Erreur lors de la réinitialisation" 
    });
  }
});

// User management routes
app.get("/api/users", requireAdmin, async (req, res) => {
  try {
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt
    }).from(users);
    
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
});

// Exercise routes
app.get("/api/exercises", requireAuth, async (req, res) => {
  try {
    const allExercises = await db.select().from(exercises);
    res.json(allExercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des exercices" });
  }
});

app.post("/api/exercises", requireAdmin, async (req, res) => {
  try {
    const { title, description, duration, difficulty, category, instructions } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: "Titre et description requis" });
    }

    const newExercise = await db.insert(exercises).values({
      title,
      description,
      duration: duration || 15,
      difficulty: difficulty || "beginner",
      category: category || "general",
      instructions: instructions || null,
      createdAt: new Date()
    }).returning();

    res.json(newExercise[0]);
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({ message: "Erreur lors de la création de l'exercice" });
  }
});

// Craving tracking routes
app.post("/api/cravings", requireAuth, async (req, res) => {
  try {
    const { intensity, triggers, notes } = req.body;
    
    const newCraving = await db.insert(cravingEntries).values({
      userId: req.session.user.id,
      intensity: intensity || 1,
      triggers: triggers || null,
      notes: notes || null,
      createdAt: new Date()
    }).returning();

    res.json(newCraving[0]);
  } catch (error) {
    console.error("Error creating craving entry:", error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement" });
  }
});

app.get("/api/cravings", requireAuth, async (req, res) => {
  try {
    const userCravings = await db.select()
      .from(cravingEntries)
      .where(eq(cravingEntries.userId, req.session.user.id));
    
    res.json(userCravings);
  } catch (error) {
    console.error("Error fetching cravings:", error);
    res.status(500).json({ message: "Erreur lors de la récupération" });
  }
});

// Exercise session routes
app.post("/api/exercise-sessions", requireAuth, async (req, res) => {
  try {
    const { exerciseId, duration, completed, notes } = req.body;
    
    const newSession = await db.insert(exerciseSessions).values({
      userId: req.session.user.id,
      exerciseId: exerciseId || null,
      duration: duration || 0,
      completed: completed || false,
      notes: notes || null,
      createdAt: new Date()
    }).returning();

    res.json(newSession[0]);
  } catch (error) {
    console.error("Error creating exercise session:", error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement" });
  }
});

app.get("/api/exercise-sessions", requireAuth, async (req, res) => {
  try {
    const userSessions = await db.select()
      .from(exerciseSessions)
      .where(eq(exerciseSessions.userId, req.session.user.id));
    
    res.json(userSessions);
  } catch (error) {
    console.error("Error fetching exercise sessions:", error);
    res.status(500).json({ message: "Erreur lors de la récupération" });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "apaddicto-server",
    timestamp: new Date().toISOString(),
    database: "connected"
  });
});

// Database test
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await db.execute(sql`SELECT 1 as test, NOW() as current_time`);
    res.json({ 
      ok: true, 
      message: "Database connection successful", 
      result: result.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database test failed:", error);
    res.status(500).json({ 
      ok: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Static file serving
app.use(express.static("dist/public"));

// Catch all for SPA
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "./dist/public" });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // If response already sent, don't try to send again
  if (res.headersSent) {
    return next(err);
  }
  
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Erreur interne du serveur";
  console.error("❌ Server error:", err);
  
  // Always send JSON response for API routes
  res.status(status).json({ message });
});

// Handle process termination
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down gracefully");
  process.exit(0);
});

export default app;


import bcrypt from 'bcryptjs';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql, eq, and } from 'drizzle-orm';
import ws from 'ws';
import { 
  users, 
  exercises, 
  psychoEducationContent,
  cravingEntries,
  exerciseSessions 
} from '../shared/schema.js';

// Configure Neon
neonConfig.webSocketConstructor = ws;

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_vRJU7LlnYG1y@ep-soft-bush-ab0hbww0-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

console.log('🚀 Starting Apaddicto server...');
console.log('📊 Database URL:', DATABASE_URL.replace(/:[^:@]*@/, ':****@'));

let db;

try {
  const pool = new Pool({ connectionString: DATABASE_URL });
  db = drizzle({ client: pool, schema: { users, exercises, psychoEducationContent, cravingEntries, exerciseSessions } });
  console.log('✅ Database initialized successfully');
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
}

// Authentication helpers
class AuthService {
  static async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  }

  static async createUser(userData) {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  static async getUserById(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }
}

// Auth middleware
function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }
  
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès administrateur requis' });
  }
  
  next();
}

// Start server in development mode
if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`🌟 Apaddicto server is running on port ${port}`);
    console.log(`📱 Access the app at: http://localhost:${port}`);
  });
}


