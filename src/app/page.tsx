import { db } from '@/db';
import { posts, channels, brands } from '@/db/schema';
import { eq, ne } from 'drizzle-orm';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function Inbox() {
  const rows = await db.select({
    id: posts.id, status: posts.status, scheduledFor: posts.scheduledFor, brand: brands.name, platform: channels.platform,
  }).from(posts)
    .innerJoin(channels, eq(posts.channelId, channels.id))
    .innerJoin(brands, eq(channels.brandId, brands.id))
    .where(ne(posts.status, 'rejected'));

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Innboks — utkast</h1>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.id}>
            <Link href={`/posts/${r.id}`} className="flex justify-between rounded border p-3 hover:bg-muted">
              <span>{r.brand} · {r.platform} · {new Date(r.scheduledFor).toLocaleDateString('no')}</span>
              <Badge>{r.status}</Badge>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
