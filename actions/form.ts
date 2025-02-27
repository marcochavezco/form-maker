'use server';

import { db } from '@/db/schemas';
import { forms } from '@/db/schemas/forms';
import { formSchema, formSchemaType } from '@/schemas/form';
import { currentUser } from '@clerk/nextjs/server';
import { and, desc, eq, sql, sum } from 'drizzle-orm';

class UserNotFoundError extends Error {}

export async function GetFormStats() {
  const user = await currentUser();

  if (!user) {
    throw new UserNotFoundError();
  }

  const stats = await db
    .select({ visits: sum(forms.visits), submissions: sum(forms.submissions) })
    .from(forms)
    .where(eq(forms.userId, user.id));

  const visits = Number(stats[0].visits) || 0;
  const submissions = Number(stats[0].submissions) || 0;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  let bounceRate = 0;

  if (submissionRate > 0) {
    bounceRate = 100 - submissionRate;
  }

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function CreateForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error('Form not valid');
  }

  const user = await currentUser();

  if (!user) {
    throw new UserNotFoundError();
  }

  const { name, description } = data;

  const form = await db
    .insert(forms)
    .values({ name, description, userId: user.id })
    .returning();

  if (!form) {
    throw new Error('Form not created');
  }

  const formId = form[0].id;

  return formId;
}

export async function GetForms() {
  const user = await currentUser();

  if (!user) {
    throw new UserNotFoundError();
  }

  const result = await db
    .select()
    .from(forms)
    .where(eq(forms.userId, user.id))
    .orderBy(desc(forms.createdAt));

  return result;
}

export async function GetFormById(id: number) {
  const user = await currentUser();

  if (!user) {
    throw new UserNotFoundError();
  }

  const [form] = await db
    .select()
    .from(forms)
    .where(and(eq(forms.userId, user.id), eq(forms.id, id)));

  return form;
}

export async function UpdateFormContent(id: number, JSONElements: string) {
  const user = await currentUser();

  if (!user) {
    throw new UserNotFoundError();
  }

  await db
    .update(forms)
    .set({ content: JSONElements })
    .where(and(eq(forms.userId, user.id), eq(forms.id, id)));
}

export async function PublishForm(id: number) {
  const user = await currentUser();

  if (!user) {
    throw new UserNotFoundError();
  }

  await db
    .update(forms)
    .set({ published: true })
    .where(and(eq(forms.userId, user.id), eq(forms.id, id)));
}

export async function GetFormContentByUrl(formUrl: string) {
  const [form] = await db
    .update(forms)
    .set({ visits: sql`${forms.visits} + 1` })
    .where(eq(forms.shareURL, formUrl))
    .returning({ content: forms.content });

  return form;
}
