import 'dotenv/config';
import { db } from './index';
import { brands, channels, calendarTemplates } from './schema';
import { skjulFacts } from '../content/brand-facts';
import { skjulTemplates, SKJUL_CALENDAR_ID } from '../content/calendar-skjul';

async function main() {
  const [skjul] = await db
    .insert(brands)
    .values({ slug: 'skjul', name: 'Roverk Skjul', productFacts: skjulFacts })
    .returning();

  await db.insert(channels).values({
    brandId: skjul.id,
    platform: 'instagram',
    calendarId: SKJUL_CALENDAR_ID,
    active: true,
  });

  await db.insert(calendarTemplates).values(
    skjulTemplates.map((t) => ({ ...t, calendarId: SKJUL_CALENDAR_ID })),
  );

  console.log('Seed ferdig: Roverk Skjul × Instagram aktiv.');
}

main();
