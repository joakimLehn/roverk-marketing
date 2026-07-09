import { db } from '@/db';
import { posts, channels, brands, calendarTemplates, postVariants } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { BrandSwitcher } from '@/app/uke/brand-switcher';
import { brandColor, type BrandWeek, type WeekPost, type WeekVariant } from '@/lib/dashboard-types';

export const dynamic = 'force-dynamic';

function formatWeekLabel(dates: Date[]): string {
  if (dates.length === 0) return '';
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const start = sorted[0];
  const end = sorted[sorted.length - 1];
  const months = ['jan.', 'feb.', 'mars', 'apr.', 'mai', 'juni', 'juli', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'];
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()}.–${end.getDate()}. ${months[start.getMonth()]}`;
  }
  return `${start.getDate()}. ${months[start.getMonth()]} – ${end.getDate()}. ${months[end.getMonth()]}`;
}

export default async function UkePage() {
  const activeChannels = await db
    .select({
      id: channels.id,
      brandSlug: brands.slug,
      brandName: brands.name,
      brandColor: brands.color,
    })
    .from(channels)
    .innerJoin(brands, eq(channels.brandId, brands.id))
    .where(eq(channels.active, true));

  if (activeChannels.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-2 p-6 text-center">
        <h1 className="text-xl font-heading font-semibold">Ingen aktiv kanal</h1>
        <p className="text-sm text-muted-foreground">Aktiver en kanal for å se ukens innlegg.</p>
      </main>
    );
  }

  const channelIds = activeChannels.map((c) => c.id);

  const rows = await db
    .select({
      id: posts.id,
      channelId: posts.channelId,
      scheduledFor: posts.scheduledFor,
      status: posts.status,
      chosenVariantId: posts.chosenVariantId,
      day: calendarTemplates.day,
      format: calendarTemplates.format,
      pillar: calendarTemplates.pillar,
      cta: calendarTemplates.cta,
    })
    .from(posts)
    .innerJoin(calendarTemplates, eq(posts.templateId, calendarTemplates.id))
    .where(inArray(posts.channelId, channelIds));

  const activeRows = rows.filter((r) => r.status !== 'rejected');
  const postIds = activeRows.map((r) => r.id);

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

  const rowsByChannel = new Map<string, typeof activeRows>();
  for (const r of activeRows) {
    const list = rowsByChannel.get(r.channelId) ?? [];
    list.push(r);
    rowsByChannel.set(r.channelId, list);
  }

  const brandWeeks: BrandWeek[] = activeChannels
    .map((channel) => {
      const channelRows = rowsByChannel.get(channel.id) ?? [];
      const weekPosts: WeekPost[] = channelRows
        .map((r) => ({
          id: r.id,
          day: r.day,
          scheduledFor: new Date(r.scheduledFor).toISOString(),
          format: r.format,
          pillar: r.pillar,
          cta: r.cta,
          status: r.status,
          chosenVariantId: r.chosenVariantId,
          variants: variantsByPost.get(r.id) ?? [],
        }))
        .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());

      return {
        brandSlug: channel.brandSlug,
        brandName: channel.brandName,
        color: brandColor(channel.brandSlug, channel.brandColor),
        weekLabel: formatWeekLabel(weekPosts.map((p) => new Date(p.scheduledFor))),
        posts: weekPosts,
      };
    })
    .sort((a, b) => a.brandName.localeCompare(b.brandName));

  return <BrandSwitcher brands={brandWeeks} />;
}
