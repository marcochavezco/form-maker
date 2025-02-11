'use server';

import { formSchema, formSchemaType } from '@/schemas/form';

export async function GetFormStats() {
  const visits = Math.floor(Math.random() * 1000);
  const submissions = Math.floor(Math.random() * visits);
  const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0;
  const bounceRate = Math.floor(Math.random() * 100);

  return { visits, submissions, submissionRate, bounceRate };
}

export async function CreateForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error('Form not valid');
  }
  console.log(data);
}
