"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
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

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  beckAnalyses: () => beckAnalyses,
  cravingEntries: () => cravingEntries,
  exerciseSessions: () => exerciseSessions,
  exercises: () => exercises,
  insertBeckAnalysisSchema: () => insertBeckAnalysisSchema,
  insertCravingEntrySchema: () => insertCravingEntrySchema,
  insertExerciseSchema: () => insertExerciseSchema,
  insertExerciseSessionSchema: () => insertExerciseSessionSchema,
  insertPsychoEducationContentSchema: () => insertPsychoEducationContentSchema,
  insertUserBadgeSchema: () => insertUserBadgeSchema,
  insertUserSchema: () => insertUserSchema,
  psychoEducationContent: () => psychoEducationContent,
  userBadges: () => userBadges,
  userStats: () => userStats,
  users: () => users
});
var import_drizzle_orm, import_pg_core, import_drizzle_zod, users, exercises, psychoEducationContent, cravingEntries, exerciseSessions, beckAnalyses, userBadges, userStats, insertUserSchema, insertExerciseSchema, insertPsychoEducationContentSchema, insertCravingEntrySchema, insertExerciseSessionSchema, insertBeckAnalysisSchema, insertUserBadgeSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    import_drizzle_orm = require("drizzle-orm");
    import_pg_core = require("drizzle-orm/pg-core");
    import_drizzle_zod = require("drizzle-zod");
    users = (0, import_pg_core.pgTable)("users", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      email: (0, import_pg_core.varchar)("email").unique().notNull(),
      password: (0, import_pg_core.varchar)("password").notNull(),
      firstName: (0, import_pg_core.varchar)("first_name"),
      lastName: (0, import_pg_core.varchar)("last_name"),
      profileImageUrl: (0, import_pg_core.varchar)("profile_image_url"),
      role: (0, import_pg_core.varchar)("role").default("patient"),
      // 'patient' or 'admin'
      level: (0, import_pg_core.integer)("level").default(1),
      points: (0, import_pg_core.integer)("points").default(0),
      isActive: (0, import_pg_core.boolean)("is_active").default(true),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow()
    });
    exercises = (0, import_pg_core.pgTable)("exercises", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      title: (0, import_pg_core.varchar)("title").notNull(),
      description: (0, import_pg_core.text)("description"),
      category: (0, import_pg_core.varchar)("category").notNull(),
      // 'cardio', 'strength', 'flexibility', 'mindfulness'
      difficulty: (0, import_pg_core.varchar)("difficulty").default("beginner"),
      // 'beginner', 'intermediate', 'advanced'
      duration: (0, import_pg_core.integer)("duration"),
      // in minutes
      instructions: (0, import_pg_core.text)("instructions"),
      benefits: (0, import_pg_core.text)("benefits"),
      imageUrl: (0, import_pg_core.varchar)("image_url"),
      videoUrl: (0, import_pg_core.varchar)("video_url"),
      isActive: (0, import_pg_core.boolean)("is_active").default(true),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow()
    });
    psychoEducationContent = (0, import_pg_core.pgTable)("psycho_education_content", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      title: (0, import_pg_core.varchar)("title").notNull(),
      content: (0, import_pg_core.text)("content").notNull(),
      category: (0, import_pg_core.varchar)("category").notNull(),
      // 'addiction', 'motivation', 'coping', 'relapse_prevention'
      type: (0, import_pg_core.varchar)("type").default("article"),
      // 'article', 'video', 'audio', 'interactive'
      difficulty: (0, import_pg_core.varchar)("difficulty").default("beginner"),
      estimatedReadTime: (0, import_pg_core.integer)("estimated_read_time"),
      // in minutes
      imageUrl: (0, import_pg_core.varchar)("image_url"),
      videoUrl: (0, import_pg_core.varchar)("video_url"),
      audioUrl: (0, import_pg_core.varchar)("audio_url"),
      isActive: (0, import_pg_core.boolean)("is_active").default(true),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow()
    });
    cravingEntries = (0, import_pg_core.pgTable)("craving_entries", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      userId: (0, import_pg_core.varchar)("user_id").notNull(),
      intensity: (0, import_pg_core.integer)("intensity").notNull(),
      // 0-10 scale
      triggers: (0, import_pg_core.jsonb)("triggers").$type().default([]),
      emotions: (0, import_pg_core.jsonb)("emotions").$type().default([]),
      notes: (0, import_pg_core.text)("notes"),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
    });
    exerciseSessions = (0, import_pg_core.pgTable)("exercise_sessions", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      userId: (0, import_pg_core.varchar)("user_id").notNull(),
      exerciseId: (0, import_pg_core.varchar)("exercise_id").notNull(),
      duration: (0, import_pg_core.integer)("duration"),
      // in seconds
      completed: (0, import_pg_core.boolean)("completed").default(false),
      cratingBefore: (0, import_pg_core.integer)("craving_before"),
      // 0-10 scale
      cravingAfter: (0, import_pg_core.integer)("craving_after"),
      // 0-10 scale
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
    });
    beckAnalyses = (0, import_pg_core.pgTable)("beck_analyses", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      userId: (0, import_pg_core.varchar)("user_id").notNull(),
      situation: (0, import_pg_core.text)("situation"),
      automaticThoughts: (0, import_pg_core.text)("automatic_thoughts"),
      emotions: (0, import_pg_core.text)("emotions"),
      emotionIntensity: (0, import_pg_core.integer)("emotion_intensity"),
      rationalResponse: (0, import_pg_core.text)("rational_response"),
      newFeeling: (0, import_pg_core.text)("new_feeling"),
      newIntensity: (0, import_pg_core.integer)("new_intensity"),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
    });
    userBadges = (0, import_pg_core.pgTable)("user_badges", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      userId: (0, import_pg_core.varchar)("user_id").notNull(),
      badgeType: (0, import_pg_core.varchar)("badge_type").notNull(),
      // '7_days', '50_exercises', 'craving_reduction'
      earnedAt: (0, import_pg_core.timestamp)("earned_at").defaultNow()
    });
    userStats = (0, import_pg_core.pgTable)("user_stats", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      userId: (0, import_pg_core.varchar)("user_id").notNull().unique(),
      exercisesCompleted: (0, import_pg_core.integer)("exercises_completed").default(0),
      totalDuration: (0, import_pg_core.integer)("total_duration").default(0),
      // in seconds
      currentStreak: (0, import_pg_core.integer)("current_streak").default(0),
      longestStreak: (0, import_pg_core.integer)("longest_streak").default(0),
      averageCraving: (0, import_pg_core.integer)("average_craving"),
      // calculated average
      updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow()
    });
    insertUserSchema = (0, import_drizzle_zod.createInsertSchema)(users).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertExerciseSchema = (0, import_drizzle_zod.createInsertSchema)(exercises).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPsychoEducationContentSchema = (0, import_drizzle_zod.createInsertSchema)(psychoEducationContent).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertCravingEntrySchema = (0, import_drizzle_zod.createInsertSchema)(cravingEntries).omit({
      id: true,
      createdAt: true
    });
    insertExerciseSessionSchema = (0, import_drizzle_zod.createInsertSchema)(exerciseSessions).omit({
      id: true,
      createdAt: true
    });
    insertBeckAnalysisSchema = (0, import_drizzle_zod.createInsertSchema)(beckAnalyses).omit({
      id: true,
      createdAt: true
    });
    insertUserBadgeSchema = (0, import_drizzle_zod.createInsertSchema)(userBadges).omit({
      id: true,
      earnedAt: true
    });
  }
});

// server/db.ts
function getDb() {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    _pool = new import_serverless.Pool({ connectionString: process.env.DATABASE_URL });
    _db = (0, import_neon_serverless.drizzle)({ client: _pool, schema: schema_exports });
  }
  return _db;
}
function getPool() {
  if (!_pool) {
    getDb();
  }
  return _pool;
}
var import_serverless, import_neon_serverless, import_ws, _pool, _db, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    import_serverless = require("@neondatabase/serverless");
    import_neon_serverless = require("drizzle-orm/neon-serverless");
    import_ws = __toESM(require("ws"), 1);
    init_schema();
    import_serverless.neonConfig.webSocketConstructor = import_ws.default;
    _pool = null;
    _db = null;
    pool = new Proxy({}, {
      get(target, prop) {
        return getPool()[prop];
      }
    });
    db = new Proxy({}, {
      get(target, prop) {
        return getDb()[prop];
      }
    });
  }
});

// server/storage.ts
var import_drizzle_orm2, DbStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_db();
    init_schema();
    import_drizzle_orm2 = require("drizzle-orm");
    DbStorage = class {
      async getUser(id) {
        return db.select().from(users).where((0, import_drizzle_orm2.eq)(users.id, id)).then((rows) => rows[0]);
      }
      async getUserByEmail(email) {
        return db.select().from(users).where((0, import_drizzle_orm2.eq)(users.email, email)).then((rows) => rows[0]);
      }
      async createUser(insertUser) {
        const newUser = await db.insert(users).values(insertUser).returning().then((rows) => rows[0]);
        await db.insert(userStats).values({ userId: newUser.id });
        return newUser;
      }
      async updateUser(userId, data) {
        const updatedUser = await db.update(users).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm2.eq)(users.id, userId)).returning();
        return updatedUser[0];
      }
      async updatePassword(userId, newHashedPassword) {
        return db.update(users).set({ password: newHashedPassword, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm2.eq)(users.id, userId)).returning().then((rows) => rows[0]);
      }
      async deleteUser(userId) {
        await db.transaction(async (tx) => {
          await tx.delete(userBadges).where((0, import_drizzle_orm2.eq)(userBadges.userId, userId));
          await tx.delete(userStats).where((0, import_drizzle_orm2.eq)(userStats.userId, userId));
          await tx.delete(beckAnalyses).where((0, import_drizzle_orm2.eq)(beckAnalyses.userId, userId));
          await tx.delete(exerciseSessions).where((0, import_drizzle_orm2.eq)(exerciseSessions.userId, userId));
          await tx.delete(cravingEntries).where((0, import_drizzle_orm2.eq)(cravingEntries.userId, userId));
          await tx.delete(users).where((0, import_drizzle_orm2.eq)(users.id, userId));
        });
      }
      async updateUserStats(userId, statsUpdate) {
        const updated = await db.update(userStats).set({ ...statsUpdate, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm2.eq)(userStats.userId, userId)).returning();
        return updated[0];
      }
      async getExercises() {
        return db.select().from(exercises).where((0, import_drizzle_orm2.eq)(exercises.isActive, true)).orderBy(exercises.title);
      }
      async getAllExercises() {
        return db.select().from(exercises).orderBy(exercises.title);
      }
      async createExercise(insertExercise) {
        return db.insert(exercises).values(insertExercise).returning().then((rows) => rows[0]);
      }
      async getPsychoEducationContent() {
        return db.select().from(psychoEducationContent).where((0, import_drizzle_orm2.eq)(psychoEducationContent.isActive, true)).orderBy(psychoEducationContent.title);
      }
      async getAllPsychoEducationContent() {
        return db.select().from(psychoEducationContent).orderBy(psychoEducationContent.title);
      }
      async createPsychoEducationContent(insertContent) {
        return db.insert(psychoEducationContent).values(insertContent).returning().then((rows) => rows[0]);
      }
      async createCravingEntry(insertEntry) {
        const valuesToInsert = {
          userId: insertEntry.userId,
          intensity: insertEntry.intensity
        };
        if (insertEntry.triggers) valuesToInsert.triggers = Array.from(insertEntry.triggers);
        if (insertEntry.emotions) valuesToInsert.emotions = Array.from(insertEntry.emotions);
        if (insertEntry.notes) valuesToInsert.notes = insertEntry.notes;
        const newEntry = await db.insert(cravingEntries).values(valuesToInsert).returning().then((rows) => rows[0]);
        await this.updateAverageCraving(insertEntry.userId);
        return newEntry;
      }
      async getCravingEntries(userId, limit = 50) {
        return db.select().from(cravingEntries).where((0, import_drizzle_orm2.eq)(cravingEntries.userId, userId)).orderBy((0, import_drizzle_orm2.desc)(cravingEntries.createdAt)).limit(limit);
      }
      async getCravingStats(userId, days = 30) {
        const cutoffDate = /* @__PURE__ */ new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const entries = await db.select().from(cravingEntries).where((0, import_drizzle_orm2.and)((0, import_drizzle_orm2.eq)(cravingEntries.userId, userId), (0, import_drizzle_orm2.gte)(cravingEntries.createdAt, cutoffDate))).orderBy(cravingEntries.createdAt);
        if (entries.length === 0) return { average: 0, trend: 0 };
        const average = entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length;
        const midPoint = Math.floor(entries.length / 2);
        if (midPoint < 1) return { average: Math.round(average * 10) / 10, trend: 0 };
        const firstHalf = entries.slice(0, midPoint);
        const secondHalf = entries.slice(midPoint);
        const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.intensity, 0) / firstHalf.length || 0;
        const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.intensity, 0) / secondHalf.length || 0;
        const trend = firstAvg > 0 ? (secondAvg - firstAvg) / firstAvg * 100 : 0;
        return { average: Math.round(average * 10) / 10, trend: Math.round(trend) };
      }
      async updateAverageCraving(userId) {
        const stats = await this.getCravingStats(userId);
        await this.updateUserStats(userId, { averageCraving: Math.round(stats.average) });
      }
      async createExerciseSession(insertSession) {
        const session2 = await db.insert(exerciseSessions).values(insertSession).returning().then((rows) => rows[0]);
        if (session2.completed) {
          const currentStats = await this.getUserStats(session2.userId);
          if (currentStats) {
            await this.updateUserStats(session2.userId, {
              exercisesCompleted: (currentStats.exercisesCompleted || 0) + 1,
              totalDuration: (currentStats.totalDuration || 0) + (session2.duration || 0)
            });
          }
          const user = await this.getUser(session2.userId);
          if (user) {
            const newPoints = (user.points || 0) + 10;
            const newLevel = Math.floor(newPoints / 100) + 1;
            await db.update(users).set({ points: newPoints, level: newLevel, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm2.eq)(users.id, session2.userId));
          }
          await this.checkAndAwardBadges(session2.userId);
        }
        return session2;
      }
      async getExerciseSessions(userId, limit = 50) {
        return db.select().from(exerciseSessions).where((0, import_drizzle_orm2.eq)(exerciseSessions.userId, userId)).orderBy((0, import_drizzle_orm2.desc)(exerciseSessions.createdAt)).limit(limit);
      }
      async getUserStats(userId) {
        return db.select().from(userStats).where((0, import_drizzle_orm2.eq)(userStats.userId, userId)).then((rows) => rows[0]);
      }
      async createBeckAnalysis(insertAnalysis) {
        return db.insert(beckAnalyses).values(insertAnalysis).returning().then((rows) => rows[0]);
      }
      async getBeckAnalyses(userId, limit = 20) {
        return db.select().from(beckAnalyses).where((0, import_drizzle_orm2.eq)(beckAnalyses.userId, userId)).orderBy((0, import_drizzle_orm2.desc)(beckAnalyses.createdAt)).limit(limit);
      }
      async getUserBadges(userId) {
        return db.select().from(userBadges).where((0, import_drizzle_orm2.eq)(userBadges.userId, userId)).orderBy((0, import_drizzle_orm2.desc)(userBadges.earnedAt));
      }
      async awardBadge(insertBadge) {
        const existingBadge = await db.select().from(userBadges).where((0, import_drizzle_orm2.and)((0, import_drizzle_orm2.eq)(userBadges.userId, insertBadge.userId), (0, import_drizzle_orm2.eq)(userBadges.badgeType, insertBadge.badgeType))).then((rows) => rows[0]);
        if (existingBadge) return existingBadge;
        return db.insert(userBadges).values(insertBadge).returning().then((rows) => rows[0]);
      }
      async checkAndAwardBadges(userId) {
        const newBadges = [];
        const stats = await this.getUserStats(userId);
        if (!stats) return newBadges;
        if ((stats.exercisesCompleted || 0) >= 50) {
          const badge = await this.awardBadge({ userId, badgeType: "50_exercises" });
          if (badge) newBadges.push(badge);
        }
        return newBadges;
      }
    };
    storage = new DbStorage();
  }
});

// server/seed-data.ts
var seed_data_exports = {};
__export(seed_data_exports, {
  seedData: () => seedData
});
async function seedData() {
  const exercises2 = [
    {
      title: "Marche rapide",
      description: "Une marche \xE9nergique pour am\xE9liorer l'humeur et r\xE9duire le stress",
      category: "cardio",
      difficulty: "beginner",
      duration: 20,
      instructions: "Marchez d'un pas soutenu pendant 20 minutes. Concentrez-vous sur votre respiration et l'environnement qui vous entoure. Maintenez un rythme qui vous permet de parler mais qui vous fait l\xE9g\xE8rement transpirer.",
      benefits: "Am\xE9liore l'humeur, r\xE9duit l'anxi\xE9t\xE9, augmente l'\xE9nergie, favorise la production d'endorphines naturelles",
      imageUrl: "/images/walking.jpg"
    },
    {
      title: "Exercices de respiration profonde",
      description: "Techniques de respiration pour calmer l'esprit et r\xE9duire l'anxi\xE9t\xE9",
      category: "mindfulness",
      difficulty: "beginner",
      duration: 10,
      instructions: "Asseyez-vous confortablement. Inspirez lentement par le nez pendant 4 secondes, retenez votre souffle pendant 4 secondes, puis expirez par la bouche pendant 6 secondes. R\xE9p\xE9tez 10 fois.",
      benefits: "R\xE9duit le stress, calme le syst\xE8me nerveux, am\xE9liore la concentration, aide \xE0 g\xE9rer les \xE9motions",
      imageUrl: "/images/breathing.jpg"
    },
    {
      title: "\xC9tirements matinaux",
      description: "S\xE9quence d'\xE9tirements doux pour commencer la journ\xE9e",
      category: "flexibility",
      difficulty: "beginner",
      duration: 15,
      instructions: "Effectuez chaque \xE9tirement lentement et maintenez la position pendant 30 secondes. Incluez les bras, le cou, le dos, les jambes. Respirez profond\xE9ment pendant chaque \xE9tirement.",
      benefits: "Am\xE9liore la flexibilit\xE9, r\xE9duit les tensions musculaires, augmente la circulation sanguine, pr\xE9pare le corps pour la journ\xE9e",
      imageUrl: "/images/stretching.jpg"
    },
    {
      title: "Course l\xE9g\xE8re",
      description: "Jogging \xE0 rythme mod\xE9r\xE9 pour lib\xE9rer les endorphines",
      category: "cardio",
      difficulty: "intermediate",
      duration: 30,
      instructions: "Commencez par un \xE9chauffement de 5 minutes de marche. Courez \xE0 un rythme confortable pendant 20 minutes, puis terminez par 5 minutes de marche de r\xE9cup\xE9ration.",
      benefits: "Lib\xE8re des endorphines, am\xE9liore l'humeur, renforce le syst\xE8me cardiovasculaire, aide \xE0 g\xE9rer le stress",
      imageUrl: "/images/jogging.jpg"
    },
    {
      title: "M\xE9ditation guid\xE9e",
      description: "S\xE9ance de m\xE9ditation pour la paix int\xE9rieure",
      category: "mindfulness",
      difficulty: "beginner",
      duration: 15,
      instructions: "Asseyez-vous dans un endroit calme. Fermez les yeux et concentrez-vous sur votre respiration. Quand votre esprit divague, ramenez doucement votre attention sur votre souffle.",
      benefits: "R\xE9duit l'anxi\xE9t\xE9, am\xE9liore la concentration, favorise la relaxation, d\xE9veloppe la conscience de soi",
      imageUrl: "/images/meditation.jpg"
    },
    {
      title: "Pompes modifi\xE9es",
      description: "Exercice de renforcement adapt\xE9 \xE0 tous les niveaux",
      category: "strength",
      difficulty: "beginner",
      duration: 10,
      instructions: "Commencez par des pompes contre un mur ou sur les genoux. Effectuez 3 s\xE9ries de 8-12 r\xE9p\xE9titions avec 1 minute de repos entre les s\xE9ries.",
      benefits: "Renforce le haut du corps, am\xE9liore la confiance en soi, augmente la force fonctionnelle",
      imageUrl: "/images/pushups.jpg"
    },
    {
      title: "Yoga doux",
      description: "S\xE9quence de yoga relaxante pour corps et esprit",
      category: "flexibility",
      difficulty: "beginner",
      duration: 25,
      instructions: "Encha\xEEnez des postures simples comme la posture de l'enfant, le chat-vache, et la torsion assise. Maintenez chaque posture 30-60 secondes en respirant profond\xE9ment.",
      benefits: "Am\xE9liore la flexibilit\xE9, r\xE9duit le stress, favorise la relaxation, renforce la connexion corps-esprit",
      imageUrl: "/images/yoga.jpg"
    },
    {
      title: "Squats au poids du corps",
      description: "Exercice de renforcement des jambes et fessiers",
      category: "strength",
      difficulty: "intermediate",
      duration: 12,
      instructions: "Effectuez 3 s\xE9ries de 10-15 squats. Descendez comme si vous vous asseyiez sur une chaise, gardez le dos droit et les genoux align\xE9s avec les orteils.",
      benefits: "Renforce les jambes et fessiers, am\xE9liore l'\xE9quilibre, augmente la densit\xE9 osseuse",
      imageUrl: "/images/squats.jpg"
    }
  ];
  const psychoEducationContent2 = [
    {
      title: "Comprendre l'addiction",
      content: `L'addiction est une maladie chronique du cerveau qui affecte les circuits de r\xE9compense, de motivation et de m\xE9moire. Elle se caract\xE9rise par l'incapacit\xE9 de s'abstenir de mani\xE8re constante d'un comportement ou d'une substance, malgr\xE9 les cons\xE9quences n\xE9gatives.

## Les m\xE9canismes de l'addiction

L'addiction modifie la chimie du cerveau, particuli\xE8rement dans les zones responsables de :
- La prise de d\xE9cision
- Le contr\xF4le des impulsions
- La gestion du stress
- La r\xE9gulation \xE9motionnelle

## Facteurs de risque

Plusieurs facteurs peuvent contribuer au d\xE9veloppement d'une addiction :
- Pr\xE9disposition g\xE9n\xE9tique
- Traumatismes pass\xE9s
- Stress chronique
- Environnement social
- Troubles mentaux concomitants

## L'importance de la compr\xE9hension

Comprendre que l'addiction est une maladie et non un manque de volont\xE9 est crucial pour :
- R\xE9duire la culpabilit\xE9 et la honte
- D\xE9velopper de la compassion envers soi-m\xEAme
- Accepter l'aide professionnelle
- Maintenir la motivation pour le r\xE9tablissement`,
      category: "addiction",
      type: "article",
      difficulty: "beginner",
      estimatedReadTime: 8,
      imageUrl: "/images/brain-addiction.jpg"
    },
    {
      title: "Techniques de gestion du stress",
      content: `Le stress est souvent un d\xE9clencheur majeur dans les processus addictifs. Apprendre \xE0 g\xE9rer le stress de mani\xE8re saine est essentiel pour maintenir la sobri\xE9t\xE9.

## Techniques de relaxation imm\xE9diate

### Respiration 4-7-8
1. Inspirez par le nez pendant 4 secondes
2. Retenez votre souffle pendant 7 secondes
3. Expirez par la bouche pendant 8 secondes
4. R\xE9p\xE9tez 4 fois

### Relaxation musculaire progressive
- Contractez puis rel\xE2chez chaque groupe musculaire
- Commencez par les orteils, remontez jusqu'\xE0 la t\xEAte
- Maintenez la contraction 5 secondes, puis rel\xE2chez

## Strat\xE9gies \xE0 long terme

### Exercice physique r\xE9gulier
- Lib\xE8re des endorphines naturelles
- Am\xE9liore l'humeur et l'estime de soi
- R\xE9duit les hormones de stress

### M\xE9ditation et pleine conscience
- D\xE9veloppe la conscience de soi
- Am\xE9liore la r\xE9gulation \xE9motionnelle
- R\xE9duit l'anxi\xE9t\xE9 et la d\xE9pression

### Sommeil de qualit\xE9
- 7-9 heures par nuit
- Routine de coucher r\xE9guli\xE8re
- Environnement propice au repos`,
      category: "coping",
      type: "article",
      difficulty: "beginner",
      estimatedReadTime: 10,
      imageUrl: "/images/stress-management.jpg"
    },
    {
      title: "Maintenir la motivation",
      content: `La motivation fluctue naturellement au cours du processus de r\xE9tablissement. Voici des strat\xE9gies pour maintenir votre engagement envers vos objectifs.

## D\xE9finir des objectifs SMART

### Sp\xE9cifiques
- D\xE9finissez clairement ce que vous voulez accomplir
- \xC9vitez les objectifs vagues

### Mesurables
- \xC9tablissez des crit\xE8res pour mesurer vos progr\xE8s
- Utilisez des chiffres quand c'est possible

### Atteignables
- Fixez des objectifs r\xE9alistes
- Commencez petit et progressez graduellement

### Pertinents
- Assurez-vous que vos objectifs correspondent \xE0 vos valeurs
- Connectez-les \xE0 votre vision \xE0 long terme

### Temporels
- Fixez des \xE9ch\xE9ances claires
- Divisez les grands objectifs en \xE9tapes plus petites

## Techniques de motivation

### Visualisation positive
- Imaginez-vous atteignant vos objectifs
- Ressentez les \xE9motions positives associ\xE9es
- Pratiquez r\xE9guli\xE8rement cette visualisation

### Journal de gratitude
- Notez 3 choses pour lesquelles vous \xEAtes reconnaissant chaque jour
- Concentrez-vous sur les progr\xE8s, m\xEAme petits
- C\xE9l\xE9brez vos victoires

### Syst\xE8me de r\xE9compenses
- \xC9tablissez des r\xE9compenses saines pour vos accomplissements
- Variez les types de r\xE9compenses
- Assurez-vous qu'elles soutiennent vos objectifs`,
      category: "motivation",
      type: "article",
      difficulty: "intermediate",
      estimatedReadTime: 12,
      imageUrl: "/images/motivation.jpg"
    },
    {
      title: "Pr\xE9vention de la rechute",
      content: `La rechute fait souvent partie du processus de r\xE9tablissement. Comprendre les signaux d'alarme et avoir un plan peut vous aider \xE0 maintenir vos progr\xE8s.

## Signaux d'alarme pr\xE9coces

### \xC9motionnels
- Irritabilit\xE9 accrue
- Sentiment d'isolement
- Anxi\xE9t\xE9 ou d\xE9pression
- Perte d'int\xE9r\xEAt pour les activit\xE9s

### Comportementaux
- N\xE9gligence de l'hygi\xE8ne personnelle
- \xC9vitement des responsabilit\xE9s
- Isolement social
- Arr\xEAt des activit\xE9s de r\xE9tablissement

### Cognitifs
- Pens\xE9es obsessionnelles
- Rationalisation des comportements \xE0 risque
- Minimisation des cons\xE9quences
- Pens\xE9e "tout ou rien"

## Plan de pr\xE9vention de la rechute

### Identification des d\xE9clencheurs
- Situations \xE0 haut risque
- \xC9motions difficiles
- Personnes ou lieux probl\xE9matiques
- \xC9tats physiques (fatigue, faim)

### Strat\xE9gies d'adaptation
- Techniques de relaxation
- Exercice physique
- Contact avec le r\xE9seau de soutien
- Activit\xE9s alternatives saines

### Plan d'urgence
- Liste de contacts d'urgence
- Strat\xE9gies de distraction imm\xE9diate
- Lieux s\xFBrs o\xF9 se rendre
- Rappels de vos motivations

## Apr\xE8s une rechute

Si une rechute survient :
- Ne vous jugez pas s\xE9v\xE8rement
- Analysez ce qui s'est pass\xE9
- Ajustez votre plan de pr\xE9vention
- Reprenez vos strat\xE9gies de r\xE9tablissement rapidement`,
      category: "relapse_prevention",
      type: "article",
      difficulty: "advanced",
      estimatedReadTime: 15,
      imageUrl: "/images/relapse-prevention.jpg"
    }
  ];
  for (const exercise of exercises2) {
    try {
      await storage.createExercise(exercise);
      console.log(`Exercice cr\xE9\xE9: ${exercise.title}`);
    } catch (error) {
      console.error(`Erreur lors de la cr\xE9ation de l'exercice ${exercise.title}:`, error);
    }
  }
  for (const content of psychoEducationContent2) {
    try {
      await storage.createPsychoEducationContent(content);
      console.log(`Contenu psycho\xE9ducatif cr\xE9\xE9: ${content.title}`);
    } catch (error) {
      console.error(`Erreur lors de la cr\xE9ation du contenu ${content.title}:`, error);
    }
  }
  console.log("Donn\xE9es d'exemple cr\xE9\xE9es avec succ\xE8s!");
}
var init_seed_data = __esm({
  "server/seed-data.ts"() {
    "use strict";
    init_storage();
  }
});

// api/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => handler
});
module.exports = __toCommonJS(index_exports);
var import_express = __toESM(require("express"), 1);
var import_express_session = __toESM(require("express-session"), 1);
var import_memorystore = __toESM(require("memorystore"), 1);

// server/routes.ts
init_storage();

// server/auth.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
init_storage();
var AuthService = class {
  static async hashPassword(password) {
    const saltRounds = 10;
    return import_bcryptjs.default.hash(password, saltRounds);
  }
  static async verifyPassword(password, hashedPassword) {
    return import_bcryptjs.default.compare(password, hashedPassword);
  }
  static async register(userData) {
    const existingUser = await storage.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe d\xE9j\xE0");
    }
    const hashedPassword = await this.hashPassword(userData.password);
    const newUser = {
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      role: userData.role || "patient"
    };
    const user = await storage.createUser(newUser);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
  }
  static async login(email, password) {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }
    const isValidPassword = await this.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error("Email ou mot de passe incorrect");
    }
    if (!user.isActive) {
      throw new Error("Compte d\xE9sactiv\xE9");
    }
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
  }
  static async getUserById(id) {
    const user = await storage.getUser(id);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
  }
  static async updateUser(userId, data) {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("Utilisateur non trouv\xE9");
    }
    if (data.email && data.email !== user.email) {
      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        throw new Error("Cet email est d\xE9j\xE0 utilis\xE9 par un autre compte.");
      }
    }
    const updatedUser = await storage.updateUser(userId, {
      firstName: data.firstName ?? user.firstName,
      lastName: data.lastName ?? user.lastName,
      email: data.email ?? user.email
    });
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role
    };
  }
  static async updatePassword(userId, oldPassword, newPassword) {
    if (!oldPassword || !newPassword) {
      throw new Error("L'ancien et le nouveau mot de passe sont requis.");
    }
    if (newPassword.length < 6) {
      throw new Error("Le nouveau mot de passe doit contenir au moins 6 caract\xE8res.");
    }
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("Utilisateur non trouv\xE9.");
    }
    const isMatch = await this.verifyPassword(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("L'ancien mot de passe est incorrect.");
    }
    const hashedNewPassword = await this.hashPassword(newPassword);
    await storage.updatePassword(userId, hashedNewPassword);
  }
  static async resetPassword(email) {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw new Error("Aucun utilisateur trouv\xE9 avec cet email");
    }
    const temporaryPassword = this.generateRandomPassword();
    const hashedPassword = await this.hashPassword(temporaryPassword);
    await storage.updatePassword(user.id, hashedPassword);
    return temporaryPassword;
  }
  static generateRandomPassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
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

// server/routes.ts
init_schema();
init_db();
var import_drizzle_orm3 = require("drizzle-orm");
function registerRoutes(app2) {
  app2.get("/api/test-db", async (_req, res) => {
    try {
      const result = await db.execute(import_drizzle_orm3.sql`SELECT 1 as one`);
      res.json({ ok: true, result: result.rows });
    } catch (e) {
      console.error("Database connection test failed:", e);
      res.status(500).json({ ok: false, error: e instanceof Error ? e.message : String(e) });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
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
        role
      });
      req.session.user = user;
      res.json({ user, message: "Inscription r\xE9ussie" });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erreur lors de l'inscription"
      });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
      }
      const user = await AuthService.login(email, password);
      req.session.user = user;
      res.json({ user, message: "Connexion r\xE9ussie" });
    } catch (error) {
      res.status(401).json({
        message: error instanceof Error ? error.message : "Erreur de connexion"
      });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors de la d\xE9connexion" });
      }
      res.json({ message: "D\xE9connexion r\xE9ussie" });
    });
  });
  app2.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Session non valide" });
      }
      const user = await AuthService.getUserById(req.session.user.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouv\xE9" });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la r\xE9cup\xE9ration du profil" });
    }
  });
  app2.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email requis" });
      }
      const temporaryPassword = await AuthService.resetPassword(email);
      res.json({
        message: "Mot de passe r\xE9initialis\xE9 avec succ\xE8s",
        temporaryPassword,
        info: "Votre nouveau mot de passe temporaire est affich\xE9 ci-dessus. Veuillez le changer apr\xE8s connexion."
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erreur lors de la r\xE9initialisation"
      });
    }
  });
  app2.get("/api/exercises", async (req, res) => {
    try {
      const exercises2 = await storage.getExercises();
      res.json(exercises2);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la r\xE9cup\xE9ration des exercices" });
    }
  });
  app2.post("/api/exercises", requireAdmin, async (req, res) => {
    try {
      const data = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(data);
      res.json(exercise);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Validation \xE9chou\xE9e" });
    }
  });
  app2.get("/api/psycho-education", async (req, res) => {
    try {
      const content = await storage.getPsychoEducationContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la r\xE9cup\xE9ration du contenu" });
    }
  });
  app2.post("/api/psycho-education", requireAdmin, async (req, res) => {
    try {
      const data = insertPsychoEducationContentSchema.parse(req.body);
      const content = await storage.createPsychoEducationContent(data);
      res.json(content);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Validation \xE9chou\xE9e" });
    }
  });
  app2.get("/api/admin/exercises", requireAdmin, async (req, res) => {
    try {
      const exercises2 = await storage.getAllExercises();
      res.json(exercises2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all exercises" });
    }
  });
  app2.get("/api/admin/psycho-education", requireAdmin, async (req, res) => {
    try {
      const content = await storage.getAllPsychoEducationContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all psycho-education content" });
    }
  });
  app2.post("/api/cravings", requireAuth, async (req, res) => {
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
  app2.get("/api/cravings", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const entries = await storage.getCravingEntries(userId, limit);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch craving entries" });
    }
  });
  app2.get("/api/cravings/stats", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const days = req.query.days ? parseInt(req.query.days) : void 0;
      const stats = await storage.getCravingStats(userId, days);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch craving stats" });
    }
  });
  app2.post("/api/exercise-sessions", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const data = insertExerciseSessionSchema.parse({
        ...req.body,
        userId: req.session.user.id
      });
      const session2 = await storage.createExerciseSession(data);
      res.json(session2);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Validation failed" });
    }
  });
  app2.get("/api/exercise-sessions", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const sessions = await storage.getExerciseSessions(userId, limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercise sessions" });
    }
  });
  app2.post("/api/beck-analyses", requireAuth, async (req, res) => {
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
  app2.get("/api/beck-analyses", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const analyses = await storage.getBeckAnalyses(userId, limit);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Beck analyses" });
    }
  });
  app2.get("/api/users/stats", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });
  app2.get("/api/users/badges", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const badges = await storage.getUserBadges(userId);
      res.json(badges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user badges" });
    }
  });
  app2.get("/api/users/profile", requireAuth, async (req, res) => {
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
  app2.put("/api/users/profile", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const { firstName, lastName, email } = req.body;
      const updatedUser = await AuthService.updateUser(userId, { firstName, lastName, email });
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Erreur lors de la mise \xE0 jour du profil" });
    }
  });
  app2.put("/api/users/password", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      const { oldPassword, newPassword } = req.body;
      await AuthService.updatePassword(userId, oldPassword, newPassword);
      res.json({ message: "Mot de passe mis \xE0 jour avec succ\xE8s" });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Erreur lors de la mise \xE0 jour du mot de passe" });
    }
  });
  app2.delete("/api/users/profile", requireAuth, async (req, res) => {
    try {
      if (!req.session || !req.session.user) return res.status(401).json({ message: "Session non valide" });
      const userId = req.session.user.id;
      await storage.deleteUser(userId);
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Erreur lors de la d\xE9connexion apr\xE8s la suppression du compte" });
        }
        res.json({ message: "Compte supprim\xE9 avec succ\xE8s" });
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du compte" });
    }
  });
  app2.post("/api/demo-user", async (req, res) => {
    try {
      const user = await storage.createUser({
        email: "demo@example.com",
        password: "demo123",
        firstName: "Utilisateur",
        lastName: "Demo",
        role: "patient"
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to create demo user" });
    }
  });
  app2.post("/api/seed-data", requireAdmin, async (req, res) => {
    try {
      const { seedData: seedData2 } = await Promise.resolve().then(() => (init_seed_data(), seed_data_exports));
      await seedData2();
      res.json({ message: "Donn\xE9es d'exemple cr\xE9\xE9es avec succ\xE8s" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la cr\xE9ation des donn\xE9es d'exemple" });
    }
  });
}

// api/index.ts
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
registerRoutes(app);
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(err);
  res.status(status).json({ message });
});
function handler(req, res) {
  return app(req, res);
}
