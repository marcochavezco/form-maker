import { relations, sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { forms } from './forms';

export const formSubmissions = sqliteTable('form_submissions', {
  id: int('id').primaryKey({ autoIncrement: true }),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  formId: int('form_id')
    .notNull()
    .references(() => forms.id),
  content: text('content').notNull(),
});

export const formSubmissionsRelations = relations(
  formSubmissions,
  ({ one }) => ({
    form: one(forms),
  })
);
