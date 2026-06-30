"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogs = exports.contentGenerations = exports.outputVersions = exports.inputVersions = exports.contentStates = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.contentStates = (0, pg_core_1.pgTable)('content_states', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(), // Draft, Pending Review, Approved
});
exports.inputVersions = (0, pg_core_1.pgTable)('input_versions', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    data: (0, pg_core_1.jsonb)('data').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.outputVersions = (0, pg_core_1.pgTable)('output_versions', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    content: (0, pg_core_1.text)('content').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.contentGenerations = (0, pg_core_1.pgTable)('content_generations', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    inputVersionId: (0, pg_core_1.uuid)('input_version_id').references(() => exports.inputVersions.id).notNull(),
    outputVersionId: (0, pg_core_1.uuid)('output_version_id').references(() => exports.outputVersions.id).notNull(),
    currentStateId: (0, pg_core_1.integer)('current_state_id').references(() => exports.contentStates.id).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    contentGenerationId: (0, pg_core_1.uuid)('content_generation_id').references(() => exports.contentGenerations.id).notNull(),
    fromStateId: (0, pg_core_1.integer)('from_state_id').references(() => exports.contentStates.id),
    toStateId: (0, pg_core_1.integer)('to_state_id').references(() => exports.contentStates.id).notNull(),
    changedAt: (0, pg_core_1.timestamp)('changed_at').defaultNow().notNull(),
});
