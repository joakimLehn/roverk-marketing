import { db } from '@/db';
import { channels, brands, calendarTemplates, posts, postVariants } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateVariants } from './engine';
import { nextWeekStart, scheduledDate } from './plan';

export async function generateWeekForChannel(channelId: string, week: number) {
  const [ch] = await db.select().from(channels).where(eq(channels.id, channelId));
  if (!ch) throw new Error('Ukjent kanal');
  const [brand] = await db.select().from(brands).where(eq(brands.id, ch.brandId));
  const templates = await db.select().from(calendarTemplates).where(
    and(eq(calendarTemplates.calendarId, ch.calendarId), eq(calendarTemplates.week, week), eq(calendarTemplates.platform, ch.platform)),
  );
  if (!brand) throw new Error('Ukjent merkevare');
  const facts = brand.productFacts;
  if (!facts) throw new Error(`Merkevare ${brand.slug} mangler product_facts`);
  // Kalenderuke N legges på N-te kommende uke (uke 1 = neste mandag, uke 2 = +7 dager, osv.)
  const weekStart = nextWeekStart(new Date());
  weekStart.setUTCDate(weekStart.getUTCDate() + (week - 1) * 7);

  for (const t of templates) {
    const { variants, model } = await generateVariants({
      brandName: brand.name, toneNotes: ch.toneOverride ?? brand.toneOverride ?? '',
      facts, template: { ...t, notes: t.notes ?? undefined }, hashtagBank: brand.hashtags ?? [],
    });
    const [post] = await db.insert(posts).values({
      channelId: ch.id, templateId: t.id, scheduledFor: scheduledDate(weekStart, t.day), status: 'draft',
    }).returning();
    await db.insert(postVariants).values(variants.map((v) => ({
      postId: post.id, caption: v.caption, hashtags: v.hashtags, model, guardrailFlags: v.guardrailFlags, suggestedAssetTag: v.suggestedAssetTag,
    })));
  }
}
