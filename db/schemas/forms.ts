import { relations, sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { randomUUID } from 'node:crypto';
import { formSubmissions } from './formSubmissions';

export const forms = sqliteTable('forms', {
  id: int('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  published: int('published', { mode: 'boolean' }).notNull().default(false),
  name: text('name').notNull().unique(),
  description: text('description').default(''),
  content: text('content').notNull().default('[]'),

  visits: int('visits').notNull().default(0),
  submissions: int('submissions').notNull().default(0),

  shareURL: text('share_url')
    .notNull()
    .$default(() => randomUUID()),
});

export const formsRelations = relations(forms, ({ many }) => ({
  formSubmissions: many(formSubmissions),
}));

export type formSchemaType = typeof forms.$inferSelect;
