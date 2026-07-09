import { db } from '@/db';
import { channels, brands, calendarTemplates, posts, postVariants } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateVariants } from './engine';
import { nextWeekStart, scheduledDate } from './plan';
import { skjulHashtags } from './hashtags';

export async function generateWeekForChannel(channelId: string, week: number) {
  const [ch] = await db.select().from(channels).where(eq(channels.id, channelId));
  if (!ch) throw new Error('Ukjent kanal');
  const [brand] = await db.select().from(brands).where(eq(brands.id, ch.brandId));
  const templates = await db.select().from(calendarTemplates).where(
    and(eq(calendarTemplates.calendarId, ch.calendarId), eq(calendarTemplates.week, week), eq(calendarTemplates.platform, ch.platform)),
  );
  const weekStart = nextWeekStart(new Date());
  const facts = brand.productFacts!;

  for (const t of templates) {
    const { variants, model } = await generateVariants({
      brandName: brand.name, toneNotes: ch.toneOverride ?? brand.toneOverride ?? '',
      facts, template: { ...t, notes: t.notes ?? undefined }, hashtagBank: skjulHashtags,
    });
    const [post] = await db.insert(posts).values({
      channelId: ch.id, templateId: t.id, scheduledFor: scheduledDate(weekStart, t.day), status: 'draft',
    }).returning();
    await db.insert(postVariants).values(variants.map((v) => ({
      postId: post.id, caption: v.caption, hashtags: v.hashtags, model, guardrailFlags: v.guardrailFlags,
    })));
  }
}
