import { z } from 'zod';

export const variantSchema = z.object({
  caption: z.string().min(20),
  hashtags: z.array(z.string()).min(5).max(15),
  suggestedAssetTag: z.string().describe('tag som matcher en asset, f.eks. reklame_kort_11s'),
});

export const generationResultSchema = z.object({
  variants: z.array(variantSchema).min(2).max(3),
});

export type Variant = z.infer<typeof variantSchema>;
export type GenerationResult = z.infer<typeof generationResultSchema>;

export type GenerationInput = {
  brandName: string;
  toneNotes: string;
  facts: { priceFrom: number; currency: string; usps: string[]; geo: string[]; honestyRules: string[] };
  template: { format: string; pillar: string; hook: string; cta: string; notes?: string };
  hashtagBank: string[];
};
