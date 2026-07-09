import 'dotenv/config';
import { db } from './index';
import { brands, channels, calendarTemplates } from './schema';
import { skjulFacts, vedFacts, ordenFacts, roverkFacts } from '../content/brand-facts';
import { skjulTemplates, SKJUL_CALENDAR_ID } from '../content/calendar-skjul';
import { vedTemplates, VED_CALENDAR_ID } from '../content/calendar-ved';
import { ordenTemplates, ORDEN_CALENDAR_ID } from '../content/calendar-orden';
import { roverkTemplates, ROVERK_CALENDAR_ID } from '../content/calendar-roverk';
import { skjulHashtags, vedHashtags, ordenHashtags, roverkHashtags } from '../content/hashtags';

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

  const [orden] = await db.insert(brands)
    .values({ slug: 'orden', name: 'Roverk Orden', productFacts: ordenFacts, hashtags: ordenHashtags, color: '#185FA5' })
    .returning();
  await db.insert(channels).values({ brandId: orden.id, platform: 'instagram', calendarId: ORDEN_CALENDAR_ID, active: true });
  await db.insert(channels).values({ brandId: orden.id, platform: 'facebook', calendarId: ORDEN_CALENDAR_ID, active: false });
  await db.insert(channels).values({ brandId: orden.id, platform: 'tiktok',   calendarId: ORDEN_CALENDAR_ID, active: false });
  await db.insert(calendarTemplates).values(ordenTemplates.map((t) => ({ ...t, calendarId: ORDEN_CALENDAR_ID })));
  console.log('Seed ferdig: Roverk Orden lagt til.');

  const [roverk] = await db.insert(brands)
    .values({ slug: 'roverk', name: 'Roverk', productFacts: roverkFacts, hashtags: roverkHashtags, color: '#C7924E', toneOverride: 'Paraply-/merkevarekonto: kuratert, roligere frekvens, bygg navnet Roverk og kryss-henvis til produktene (Skjul/Ved/Orden).' })
    .returning();
  await db.insert(channels).values({ brandId: roverk.id, platform: 'instagram', calendarId: ROVERK_CALENDAR_ID, active: true });
  await db.insert(channels).values({ brandId: roverk.id, platform: 'facebook', calendarId: ROVERK_CALENDAR_ID, active: false });
  await db.insert(channels).values({ brandId: roverk.id, platform: 'tiktok',   calendarId: ROVERK_CALENDAR_ID, active: false });
  await db.insert(calendarTemplates).values(roverkTemplates.map((t) => ({ ...t, calendarId: ROVERK_CALENDAR_ID })));
  console.log('Seed ferdig: Roverk (morselskap) lagt til.');
}

main();
