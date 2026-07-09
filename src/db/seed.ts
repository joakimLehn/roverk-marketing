import 'dotenv/config';
import { db } from './index';
import { brands, channels, calendarTemplates } from './schema';
import { skjulFacts, vedFacts } from '../content/brand-facts';
import { skjulTemplates, SKJUL_CALENDAR_ID } from '../content/calendar-skjul';
import { vedTemplates, VED_CALENDAR_ID } from '../content/calendar-ved';
import { skjulHashtags, vedHashtags } from '../content/hashtags';

async function main() {
  const [skjul] = await db
    .insert(brands)
    .values({
      slug: 'skjul',
      name: 'Roverk Skjul',
      productFacts: skjulFacts,
      hashtags: skjulHashtags,
      color: '#3B6D11',
    })
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

  const [ved] = await db.insert(brands)
    .values({ slug: 'ved', name: 'Roverk Ved', productFacts: vedFacts, hashtags: vedHashtags, color: '#854F0B' })
    .returning();
  await db.insert(channels).values({ brandId: ved.id, platform: 'instagram', calendarId: VED_CALENDAR_ID, active: true });
  await db.insert(channels).values({ brandId: ved.id, platform: 'facebook', calendarId: VED_CALENDAR_ID, active: false });
  await db.insert(channels).values({ brandId: ved.id, platform: 'tiktok',   calendarId: VED_CALENDAR_ID, active: false });
  await db.insert(calendarTemplates).values(vedTemplates.map((t) => ({ ...t, calendarId: VED_CALENDAR_ID })));
  console.log('Seed ferdig: Roverk Ved lagt til.');
}

main();
