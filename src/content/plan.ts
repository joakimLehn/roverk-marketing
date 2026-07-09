const DAY_INDEX: Record<string, number> = { Man: 1, Tir: 2, Ons: 3, Tor: 4, Fre: 5, Lør: 6, Søn: 0 };

export function nextWeekStart(from: Date): Date {
  const d = new Date(from);
  const day = d.getUTCDay();
  const daysUntilMon = ((8 - day) % 7) || 7;
  d.setUTCDate(d.getUTCDate() + daysUntilMon);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export function templatesForWeek<T extends { week: number }>(all: T[], week: number): T[] {
  return all.filter((t) => t.week === week);
}

export function scheduledDate(weekStart: Date, day: string): Date {
  const d = new Date(weekStart);
  const offset = (DAY_INDEX[day] === 0 ? 7 : DAY_INDEX[day]) - 1;
  d.setUTCDate(d.getUTCDate() + offset);
  d.setUTCHours(9, 0, 0, 0);
  return d;
}
