import { db } from '@/db';
import { channels } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateWeekForChannel } from '@/content/generate-week';

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  const active = await db.select().from(channels).where(eq(channels.active, true));
  for (const ch of active) {
    await generateWeekForChannel(ch.id, 1);
  }
  return Response.json({ ok: true, channels: active.length });
}
