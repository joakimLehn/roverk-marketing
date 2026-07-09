import { db } from '@/db';
import { posts, postVariants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { approvePost, rejectPost } from '@/app/actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post] = await db.select().from(posts).where(eq(posts.id, id));
  if (!post) return <main className="p-6">Ikke funnet</main>;
  const variants = await db.select().from(postVariants).where(eq(postVariants.postId, id));

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <Link href="/" className="text-sm underline">← Innboks</Link>
      <h1 className="text-xl font-semibold">Utkast · {post.status}</h1>
      {variants.map((v) => (
        <div key={v.id} className="rounded border p-4 space-y-2">
          {v.guardrailFlags && v.guardrailFlags.length > 0 && (
            <Badge className="bg-red-600">⚠ {v.guardrailFlags.join(', ')}</Badge>
          )}
          <p className="whitespace-pre-wrap">{v.caption}</p>
          <p className="text-sm text-muted-foreground">{v.hashtags.join(' ')}</p>
          <form action={approvePost.bind(null, post.id, v.id)}>
            <Button type="submit" disabled={(v.guardrailFlags?.length ?? 0) > 0}>Godkjenn denne varianten</Button>
          </form>
        </div>
      ))}
      <form action={rejectPost.bind(null, post.id)}>
        <Button variant="destructive" type="submit">Forkast</Button>
      </form>
    </main>
  );
}
