import { pgTable, serial, text, varchar, boolean, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  firstName: varchar('first_name', { length: 256 }),
  lastName: varchar('last_name', { length: 256 }),
  role: varchar('role', { length: 50 }).default("patient").notNull(), // 'patient', 'therapist', 'admin'
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description').notNull(),
  duration: integer('duration'), // in minutes
  difficulty: varchar('difficulty', { length: 50 }), // 'easy', 'medium', 'hard'
  category: varchar('category', { length: 100 }), // 'mindfulness', 'physical', 'breathing'
  instructions: text('instructions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const psychoEducationContent = pgTable('psycho_education_content', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cravingEntries = pgTable('craving_entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  intensity: integer('intensity').notNull(), // 1-10 scale
  triggers: text('triggers'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const exerciseSessions = pgTable('exercise_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  exerciseId: integer('exercise_id').references(() => exercises.id),
  duration: integer('duration'), // in minutes
  completed: boolean('completed').default(false).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});


