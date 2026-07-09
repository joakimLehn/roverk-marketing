import { describe, it, expect } from 'vitest';
import { nextWeekStart, templatesForWeek } from './plan';

describe('plan', () => {
  it('finner mandag i neste uke', () => {
    const d = nextWeekStart(new Date('2026-07-09T00:00:00Z')); // torsdag
    expect(d.getUTCDay()).toBe(1); // mandag
    expect(d > new Date('2026-07-09T00:00:00Z')).toBe(true);
  });
  it('filtrerer maler på ukenummer', () => {
    const all = [{ week: 1, day: 'Man' }, { week: 2, day: 'Man' }] as any;
    expect(templatesForWeek(all, 2)).toHaveLength(1);
  });
});
