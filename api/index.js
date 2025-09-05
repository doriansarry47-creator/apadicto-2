var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_express = __toESM(require("express"), 1);
var import_express_session = __toESM(require("express-session"), 1);
var import_memorystore = __toESM(require("memorystore"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var import_serverless = require("@neondatabase/serverless");
var import_neon_serverless = require("drizzle-orm/neon-serverless");
var import_drizzle_orm = require("drizzle-orm");
var import_ws = __toESM(require("ws"), 1);

// shared/schema.js
var import_pg_core = require("drizzle-orm/pg-core");
var import_drizzle_zod = require("drizzle-zod");
var users = (0, import_pg_core.pgTable)("users", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  email: (0, import_pg_core.text)("email").unique().notNull(),
  password: (0, import_pg_core.text)("password").notNull(),
  firstName: (0, import_pg_core.varchar)("first_name", { length: 256 }),
  lastName: (0, import_pg_core.varchar)("last_name", { length: 256 }),
  role: (0, import_pg_core.varchar)("role", { length: 50 }).default("patient").notNull(),
  // 'patient', 'therapist', 'admin'
  isActive: (0, import_pg_core.boolean)("is_active").default(true).notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var exercises = (0, import_pg_core.pgTable)("exercises", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  title: (0, import_pg_core.varchar)("title", { length: 256 }).notNull(),
  description: (0, import_pg_core.text)("description").notNull(),
  duration: (0, import_pg_core.integer)("duration"),
  // in minutes
  difficulty: (0, import_pg_core.varchar)("difficulty", { length: 50 }),
  // 'easy', 'medium', 'hard'
  category: (0, import_pg_core.varchar)("category", { length: 100 }),
  // 'mindfulness', 'physical', 'breathing'
  instructions: (0, import_pg_core.text)("instructions"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var psychoEducationContent = (0, import_pg_core.pgTable)("psycho_education_content", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  title: (0, import_pg_core.varchar)("title", { length: 256 }).notNull(),
  content: (0, import_pg_core.text)("content").notNull(),
  category: (0, import_pg_core.varchar)("category", { length: 100 }),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var cravingEntries = (0, import_pg_core.pgTable)("craving_entries", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  userId: (0, import_pg_core.integer)("user_id").references(() => users.id).notNull(),
  intensity: (0, import_pg_core.integer)("intensity").notNull(),
  // 1-10 scale
  triggers: (0, import_pg_core.text)("triggers"),
  notes: (0, import_pg_core.text)("notes"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var exerciseSessions = (0, import_pg_core.pgTable)("exercise_sessions", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  userId: (0, import_pg_core.integer)("user_id").references(() => users.id).notNull(),
  exerciseId: (0, import_pg_core.integer)("exercise_id").references(() => exercises.id),
  duration: (0, import_pg_core.integer)("duration"),
  // in minutes
  completed: (0, import_pg_core.boolean)("completed").default(false).notNull(),
  notes: (0, import_pg_core.text)("notes"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var insertExerciseSchema = (0, import_drizzle_zod.createInsertSchema)(exercises);
var selectExerciseSchema = (0, import_drizzle_zod.createSelectSchema)(exercises);
var insertPsychoEducationContentSchema = (0, import_drizzle_zod.createInsertSchema)(psychoEducationContent);
var selectPsychoEducationContentSchema = (0, import_drizzle_zod.createSelectSchema)(psychoEducationContent);
var insertCravingEntrySchema = (0, import_drizzle_zod.createInsertSchema)(cravingEntries);
var selectCravingEntrySchema = (0, import_drizzle_zod.createSelectSchema)(cravingEntries);
var insertExerciseSessionSchema = (0, import_drizzle_zod.createInsertSchema)(exerciseSessions);
var selectExerciseSessionSchema = (0, import_drizzle_zod.createSelectSchema)(exerciseSessions);
var insertUserSchema = (0, import_drizzle_zod.createInsertSchema)(users);
var selectUserSchema = (0, import_drizzle_zod.createSelectSchema)(users);

// server/index.ts
var app = (0, import_express.default)();
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: false }));
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}
var MemoryStore = (0, import_memorystore.default)(import_express_session.default);
app.use(
  (0, import_express_session.default)({
    store: new MemoryStore({
      checkPeriod: 864e5
      // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      // Force HTTPS only in production
      httpOnly: true,
      maxAge: 1e3 * 60 * 60 * 24 * 7,
      // 1 week
      sameSite: "lax"
      // CSRF protection
    }
  })
);
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    console.log("\u{1F4DD} Registration attempt for:", email);
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caract\xE8res" });
    }
    const existingUser = await AuthService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe d\xE9j\xE0" });
    }
    const hashedPassword = await AuthService.hashPassword(password);
    const newUser = await AuthService.createUser({
      email,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      role: role || "patient",
      isActive: true,
      createdAt: /* @__PURE__ */ new Date()
    });
    req.session.user = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role
    };
    console.log("\u2705 User registered successfully:", email);
    res.json({
      user: req.session.user,
      message: "Inscription r\xE9ussie"
    });
  } catch (error) {
    console.error("\u274C Registration error:", error);
    res.status(500).json({
      message: error.message || "Erreur lors de l'inscription"
    });
  }
});
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("\u{1F510} Login attempt for:", email);
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }
    const user = await AuthService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    const isValidPassword = await AuthService.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    if (!user.isActive) {
      return res.status(401).json({ message: "Compte d\xE9sactiv\xE9" });
    }
    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
    console.log("\u2705 User logged in successfully:", email);
    res.json({
      user: req.session.user,
      message: "Connexion r\xE9ussie"
    });
  } catch (error) {
    console.error("\u274C Login error:", error);
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
      return res.status(500).json({ message: "Erreur lors de la d\xE9connexion" });
    }
    console.log("\u{1F44B} User logged out:", userEmail);
    res.json({ message: "D\xE9connexion r\xE9ussie" });
  });
});
app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});
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
    res.status(500).json({ message: "Erreur lors de la r\xE9cup\xE9ration des utilisateurs" });
  }
});
app.get("/api/exercises", requireAuth, async (req, res) => {
  try {
    const allExercises = await db.select().from(exercises);
    res.json(allExercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ message: "Erreur lors de la r\xE9cup\xE9ration des exercices" });
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
      createdAt: /* @__PURE__ */ new Date()
    }).returning();
    res.json(newExercise[0]);
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({ message: "Erreur lors de la cr\xE9ation de l'exercice" });
  }
});
app.post("/api/cravings", requireAuth, async (req, res) => {
  try {
    const { intensity, triggers, notes } = req.body;
    const newCraving = await db.insert(cravingEntries).values({
      userId: req.session.user.id,
      intensity: intensity || 1,
      triggers: triggers || null,
      notes: notes || null,
      createdAt: /* @__PURE__ */ new Date()
    }).returning();
    res.json(newCraving[0]);
  } catch (error) {
    console.error("Error creating craving entry:", error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement" });
  }
});
app.get("/api/cravings", requireAuth, async (req, res) => {
  try {
    const userCravings = await db.select().from(cravingEntries).where((0, import_drizzle_orm.eq)(cravingEntries.userId, req.session.user.id));
    res.json(userCravings);
  } catch (error) {
    console.error("Error fetching cravings:", error);
    res.status(500).json({ message: "Erreur lors de la r\xE9cup\xE9ration" });
  }
});
app.post("/api/exercise-sessions", requireAuth, async (req, res) => {
  try {
    const { exerciseId, duration, completed, notes } = req.body;
    const newSession = await db.insert(exerciseSessions).values({
      userId: req.session.user.id,
      exerciseId: exerciseId || null,
      duration: duration || 0,
      completed: completed || false,
      notes: notes || null,
      createdAt: /* @__PURE__ */ new Date()
    }).returning();
    res.json(newSession[0]);
  } catch (error) {
    console.error("Error creating exercise session:", error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement" });
  }
});
app.get("/api/exercise-sessions", requireAuth, async (req, res) => {
  try {
    const userSessions = await db.select().from(exerciseSessions).where((0, import_drizzle_orm.eq)(exerciseSessions.userId, req.session.user.id));
    res.json(userSessions);
  } catch (error) {
    console.error("Error fetching exercise sessions:", error);
    res.status(500).json({ message: "Erreur lors de la r\xE9cup\xE9ration" });
  }
});
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "apaddicto-server",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    database: "connected"
  });
});
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await db.execute(import_drizzle_orm.sql`SELECT 1 as test, NOW() as current_time`);
    res.json({
      ok: true,
      message: "Database connection successful",
      result: result.rows,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Database test failed:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
});
app.use(import_express.default.static("dist/public"));
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "/home/user/webapp/dist/public" });
});
app.use((err, req, res, next) => {
  console.error("\u274C Server error:", err);
  res.status(500).json({ message: "Erreur interne du serveur" });
});
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down gracefully");
  process.exit(0);
});
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(err);
  res.status(status).json({ message });
});
var index_default = app;
import_serverless.neonConfig.webSocketConstructor = import_ws.default;
var DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_vRJU7LlnYG1y@ep-soft-bush-ab0hbww0-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
console.log("\u{1F680} Starting Apaddicto server...");
console.log("\u{1F4CA} Database URL:", DATABASE_URL.replace(/:[^:@]*@/, ":****@"));
var db;
try {
  const pool = new import_serverless.Pool({ connectionString: DATABASE_URL });
  db = (0, import_neon_serverless.drizzle)({ client: pool, schema: { users, exercises, psychoEducationContent, cravingEntries, exerciseSessions } });
  console.log("\u2705 Database initialized successfully");
} catch (error) {
  console.error("\u274C Database initialization failed:", error);
  process.exit(1);
}
var AuthService = class {
  static async hashPassword(password) {
    const saltRounds = 10;
    return import_bcryptjs.default.hash(password, saltRounds);
  }
  static async verifyPassword(password, hashedPassword) {
    return import_bcryptjs.default.compare(password, hashedPassword);
  }
  static async getUserByEmail(email) {
    const result = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.email, email)).limit(1);
    return result[0] || null;
  }
  static async createUser(userData) {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }
  static async getUserById(id) {
    const result = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.id, id)).limit(1);
    return result[0] || null;
  }
};
function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Authentification requise" });
  }
  next();
}
function requireAdmin(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Authentification requise" });
  }
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Acc\xE8s administrateur requis" });
  }
  next();
}
