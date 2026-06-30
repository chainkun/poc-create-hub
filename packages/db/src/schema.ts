import { pgTable, serial, text, timestamp, uuid, jsonb, integer } from 'drizzle-orm/pg-core';

export const contentStates = pgTable('content_states', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // Draft, Pending Review, Approved
});

export const inputVersions = pgTable('input_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const outputVersions = pgTable('output_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contentGenerations = pgTable('content_generations', {
  id: uuid('id').defaultRandom().primaryKey(),
  inputVersionId: uuid('input_version_id').references(() => inputVersions.id).notNull(),
  outputVersionId: uuid('output_version_id').references(() => outputVersions.id).notNull(),
  currentStateId: integer('current_state_id').references(() => contentStates.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  contentGenerationId: uuid('content_generation_id').references(() => contentGenerations.id).notNull(),
  fromStateId: integer('from_state_id').references(() => contentStates.id),
  toStateId: integer('to_state_id').references(() => contentStates.id).notNull(),
  changedAt: timestamp('changed_at').defaultNow().notNull(),
});
