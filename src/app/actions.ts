'use server';
import { db } from '@/db';
import { posts, postVariants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { generateWeekForChannel } from '@/content/generate-week';
import { checkGuardrails } from '@/content/guardrails';

export async function approvePost(postId: string, variantId: string) {
  await db.update(posts).set({ status: 'ready', chosenVariantId: variantId }).where(eq(posts.id, postId));
  revalidatePath('/');
}
export async function rejectPost(postId: string) {
  await db.update(posts).set({ status: 'rejected' }).where(eq(posts.id, postId));
  revalidatePath('/');
}
export async function chooseVariant(postId: string, variantId: string) {
  await db.update(posts).set({ status: 'ready', chosenVariantId: variantId }).where(eq(posts.id, postId));
  revalidatePath('/');
}
export async function markPosted(postId: string) {
  await db.update(posts).set({ status: 'published' }).where(eq(posts.id, postId));
  revalidatePath('/');
}
export async function discardPost(postId: string) {
  await db.update(posts).set({ status: 'rejected' }).where(eq(posts.id, postId));
  revalidatePath('/');
}
export async function editCaption(variantId: string, caption: string) {
  const [variant] = await db.select().from(postVariants).where(eq(postVariants.id, variantId));
  if (!variant) return;
  // Re-kjør guardrails på redigert tekst så en innredigert påstand ikke slipper gjennom godkjenning.
  const guardrailFlags = checkGuardrails(`${caption} ${variant.hashtags.join(' ')}`);
  await db.update(postVariants).set({ caption, guardrailFlags }).where(eq(postVariants.id, variantId));
  revalidatePath('/');
}
export async function generateWeek(channelId: string, week: number) {
  await generateWeekForChannel(channelId, week);
  revalidatePath('/');
}
