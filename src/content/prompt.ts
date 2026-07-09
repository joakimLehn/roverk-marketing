import type { GenerationInput } from './schema';

export function buildPrompt(input: GenerationInput): string {
  const { brandName, toneNotes, facts, template, hashtagBank } = input;
  return `Du skriver organisk innhold for ${brandName} (norsk oppbevaring i tre).

TONE: rolig, trygg, kompetent, premium uten å være luksus. Selg TRANSFORMASJONEN (rot → orden), ikke materialer. Maks 1–2 emoji, aldri i overskrift. Første setning må funke alene. Én tydelig CTA. ${toneNotes}

ABSOLUTTE REGLER (markedsføringsloven): ${facts.honestyRules.join('; ')}. Bruk KUN disse faktaene: pris fra ${facts.priceFrom} ${facts.currency}; ${facts.usps.join('; ')}; leverer i ${facts.geo.join(', ')}. Ikke finn på tall, omtaler, stjerner eller «kjent fra». IKKE bruk noen annen pris enn ${facts.priceFrom} ${facts.currency} — kopier aldri priser eller tall fra andre kilder.

OPPGAVE: Lag innhold for et ${template.format}-innlegg. Søyle: ${template.pillar}. Krok/idé: "${template.hook}". CTA: "${template.cta}". ${template.notes ?? ''}

Lag 2–3 varianter (for A/B-testing) med ulik vinkling. Velg 8–12 hashtags per variant fra denne banken: ${hashtagBank.join(' ')}. Foreslå en asset-tag som passer.`;
}
