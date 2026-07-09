import { describe, it, expect } from 'vitest';
import { checkGuardrails } from './guardrails';

describe('checkGuardrails', () => {
  it('flagger oppdiktet antall solgt', () => {
    expect(checkGuardrails('Over 500 solgte skjul i Trondheim!')).toContain('claim:antall-solgt');
  });
  it('flagger stjernerangering', () => {
    expect(checkGuardrails('Vurdert til 5 stjerner av kundene')).toContain('claim:stjerner');
  });
  it('flagger «kjent fra»', () => {
    expect(checkGuardrails('Kjent fra TV2 og Adressa')).toContain('claim:kjent-fra');
  });
  it('flagger oppdiktet kundesitat', () => {
    expect(checkGuardrails('«Beste kjøpet vi har gjort» – Kari, Melhus')).toContain('claim:kundesitat');
  });
  it('godtar ærlig, faktabasert tekst', () => {
    expect(checkGuardrails('Roverk Skjul – fra 5 490 kr. Ikke søknadspliktig. Betal etter montering.')).toEqual([]);
  });
});
