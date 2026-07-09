import { db } from '@/db';
import { posts, channels, brands, calendarTemplates, postVariants } from '@/db/schema';
import { and, eq, gte, inArray, lt, ne } from 'drizzle-orm';
import { TodayQueue } from '@/app/today-queue';
import type { TodayItem, WeekVariant } from '@/lib/dashboard-types';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const rows = await db
    .select({
      id: posts.id,
      scheduledFor: posts.scheduledFor,
      status: posts.status,
      chosenVariantId: posts.chosenVariantId,
      platform: channels.platform,
      brandName: brands.name,
      brandSlug: brands.slug,
      brandColor: brands.color,
      format: calendarTemplates.format,
      pillar: calendarTemplates.pillar,
      cta: calendarTemplates.cta,
    })
    .from(posts)
    .innerJoin(channels, eq(posts.channelId, channels.id))
    .innerJoin(brands, eq(channels.brandId, brands.id))
    .innerJoin(calendarTemplates, eq(posts.templateId, calendarTemplates.id))
    .where(
      and(
        eq(channels.active, true),
        ne(posts.status, 'rejected'),
        gte(posts.scheduledFor, start),
        lt(posts.scheduledFor, end),
      ),
    )
    .orderBy(posts.scheduledFor);

  const postIds = rows.map((r) => r.id);

  const variantRows = postIds.length
    ? await db.select().from(postVariants).where(inArray(postVariants.postId, postIds))
    : [];

  const variantsByPost = new Map<string, WeekVariant[]>();
  for (const v of variantRows) {
    const list = variantsByPost.get(v.postId) ?? [];
    list.push({
      id: v.id,
      caption: v.caption,
      hashtags: v.hashtags,
      suggestedAssetTag: v.suggestedAssetTag,
      guardrailFlags: v.guardrailFlags ?? [],
    });
    variantsByPost.set(v.postId, list);
  }

  const items: TodayItem[] = rows
    .map((r): TodayItem | null => {
      const variants = variantsByPost.get(r.id) ?? [];
      const chosen = variants.find((v) => v.id === r.chosenVariantId) ?? variants[0] ?? null;
      if (!chosen) return null;
      return {
        postId: r.id,
        variantId: chosen.id,
        brandName: r.brandName,
        brandSlug: r.brandSlug,
        brandColorStored: r.brandColor,
        platform: r.platform,
        format: r.format,
        pillar: r.pillar,
        cta: r.cta,
        scheduledFor: new Date(r.scheduledFor).toISOString(),
        status: r.status,
        caption: chosen.caption,
        hashtags: chosen.hashtags,
        suggestedAssetTag: chosen.suggestedAssetTag,
        guardrailFlags: chosen.guardrailFlags,
      };
    })
    .filter((item): item is TodayItem => item !== null)
    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());

  return <TodayQueue items={items} />;
}
