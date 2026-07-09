import { describe, it, expect, vi } from 'vitest';

// AI SDK v7: modulen eksporterer generateText + Output.
vi.mock('ai', () => ({
  Output: { object: (v: unknown) => v },
  generateText: vi.fn(async () => ({
    output: { variants: [
      { caption: 'Søppeldunkene er ofte det første gjestene ser. Roverk Skjul gjør det pent. Fra 5 990 kr.', hashtags: ['#roverk','#trondheim','#oppbevaring','#byggetfororden','#inngangsparti'], suggestedAssetTag: 'reklame_kort_11s' },
      { caption: 'Ikke søknadspliktig. Vi bygger, kjører hjem og monterer ferdig. Betal etter montering.', hashtags: ['#roverk','#trondheim','#søppelskur','#trehåndverk','#norskehjem'], suggestedAssetTag: 'teaser_6s' },
    ] },
  })),
}));

import { generateVariants } from './engine';

describe('generateVariants', () => {
  it('returnerer validerte varianter med guardrail-flagg', async () => {
    const res = await generateVariants({
      brandName: 'Roverk Skjul', toneNotes: '',
      facts: { priceFrom: 5990, currency: 'NOK', usps: ['Ikke søknadspliktig'], geo: ['Trondheim'], honestyRules: ['ingen oppdiktede tall'] },
      template: { format: 'Reels', pillar: 'Produkt', hook: 'Skjul dunkene', cta: 'Få pris' },
      hashtagBank: ['#roverk', '#trondheim'],
    });
    expect(res.variants).toHaveLength(2);
    expect(res.variants[0].guardrailFlags).toEqual([]);
    expect(res.variants[0].caption).toContain('Roverk');
  });
});
