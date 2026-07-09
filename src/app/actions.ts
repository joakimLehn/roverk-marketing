'use server';
import { db } from '@/db';
import { posts, postVariants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { generateWeekForChannel } from '@/content/generate-week';

export async function approvePost(postId: string, variantId: string) {
  await db.update(posts).set({ status: 'ready', chosenVariantId: variantId }).where(eq(posts.id, postId));
  revalidatePath('/');
}
export async function rejectPost(postId: string) {
  await db.update(posts).set({ status: 'rejected' }).where(eq(posts.id, postId));
  revalidatePath('/');
}
export async function editCaption(variantId: string, caption: string) {
  await db.update(postVariants).set({ caption }).where(eq(postVariants.id, variantId));
  revalidatePath('/');
}
export async function generateWeek(channelId: string, week: number) {
  await generateWeekForChannel(channelId, week);
  revalidatePath('/');
}
