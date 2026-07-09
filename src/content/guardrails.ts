// Ren funksjon: returnerer liste av flagg-koder. Tom liste = OK.
// Fanger markedsføringslov-brudd (oppdiktede tall/omtaler).
const RULES: { code: string; re: RegExp }[] = [
  { code: 'claim:antall-solgt', re: /\b(over\s+)?\d[\d\s.]*\s*(solgte?|leverte?|fornøyde kunder)\b/i },
  { code: 'claim:stjerner', re: /\b\d(\s*[.,]\s*\d)?\s*stjern|★|⭐/i },
  { code: 'claim:kjent-fra', re: /\bkjent fra\b/i },
  { code: 'claim:kundesitat', re: /[«"'][^»"']{8,}[»"'].{0,20}[–-]\s*[A-ZÆØÅ]/ },
  { code: 'claim:best-i', re: /\b(norges|trøndelags|byens)\s+(beste|billigste|største)\b/i },
];

export function checkGuardrails(text: string): string[] {
  return RULES.filter(r => r.re.test(text)).map(r => r.code);
}
