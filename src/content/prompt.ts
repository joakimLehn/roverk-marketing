import type { GenerationInput } from './schema';

export function buildPrompt(input: GenerationInput): string {
  const { brandName, toneNotes, facts, template, hashtagBank } = input;
  const priceClause = facts.priceFrom != null ? `pris fra ${facts.priceFrom} ${facts.currency}; ` : '';
  const priceRule = facts.priceFrom != null
    ? `IKKE bruk noen annen pris enn ${facts.priceFrom} ${facts.currency} — kopier aldri priser eller tall fra andre kilder.`
    : `Dette er merkevare-/paraplykontoen — ikke oppgi én enkelt pris. Henvis heller til produktene (Roverk Skjul, Ved, Orden) for pris. Kopier aldri priser eller tall fra andre kilder.`;
  return `Du skriver organisk innhold for ${brandName} (norsk oppbevaring i tre).

TONE: rolig, trygg, kompetent, premium uten å være luksus. Selg TRANSFORMASJONEN (rot → orden), ikke materialer. Maks 1–2 emoji, aldri i overskrift. Første setning må funke alene. Én tydelig CTA. ${toneNotes}

ABSOLUTTE REGLER (markedsføringsloven): ${facts.honestyRules.join('; ')}. Bruk KUN disse faktaene: ${priceClause}${facts.usps.join('; ')}; leverer i ${facts.geo.join(', ')}. Ikke finn på tall, omtaler, stjerner eller «kjent fra». ${priceRule}

OPPGAVE: Lag innhold for et ${template.format}-innlegg. Søyle: ${template.pillar}. Krok/idé: "${template.hook}". CTA: "${template.cta}". ${template.notes ?? ''}

Lag 2–3 varianter (for A/B-testing) med ulik vinkling. Velg 8–12 hashtags per variant fra denne banken: ${hashtagBank.join(' ')}. Foreslå en asset-tag som passer.`;
}
