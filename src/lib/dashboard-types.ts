export type WeekVariant = {
  id: string;
  caption: string;
  hashtags: string[];
  suggestedAssetTag: string | null;
  guardrailFlags: string[];
};

export type WeekPost = {
  id: string;
  day: string;
  scheduledFor: string;
  format: string;
  pillar: string;
  cta: string;
  status: 'draft' | 'ready' | 'published' | 'rejected';
  chosenVariantId: string | null;
  variants: WeekVariant[];
};

export type BrandWeek = {
  brandSlug: string;
  brandName: string;
  color: string | null;
  weekLabel: string;
  posts: WeekPost[];
};

export type TodayItem = {
  postId: string;
  variantId: string;
  brandName: string;
  brandSlug: string;
  brandColorStored: string | null;
  platform: string;
  format: string;
  pillar: string;
  cta: string;
  scheduledFor: string;
  status: 'draft' | 'ready' | 'published' | 'rejected';
  caption: string;
  hashtags: string[];
  suggestedAssetTag: string | null;
  guardrailFlags: string[];
};

const BRAND_COLOR_FALLBACKS: Record<string, string> = {
  skjul: '#3B6D11',
  ved: '#854F0B',
  orden: '#185FA5',
  roverk: '#C7924E',
};

export function brandColor(slug: string, stored: string | null): string {
  return stored ?? BRAND_COLOR_FALLBACKS[slug] ?? '#C7924E';
}
