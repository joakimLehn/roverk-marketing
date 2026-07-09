'use client';

import { useMemo, useState, useTransition } from 'react';
import { Image as ImageIcon, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chooseVariant, markPosted, discardPost, editCaption } from '@/app/actions';
import type { WeekPost } from '@/lib/dashboard-types';

type Filter = 'all' | 'draft' | 'ready' | 'published';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'draft', label: 'Venter' },
  { key: 'ready', label: 'Klar' },
  { key: 'published', label: 'Postet' },
];

const STATUS_META: Record<WeekPost['status'], { label: string; dotClass: string; textClass: string }> = {
  draft: { label: 'Venter', dotClass: 'bg-status-venter', textClass: 'text-status-venter' },
  ready: { label: 'Klar', dotClass: 'bg-status-klar', textClass: 'text-status-klar' },
  published: { label: 'Postet', dotClass: 'bg-status-postet', textClass: 'text-status-postet' },
  rejected: { label: 'Forkastet', dotClass: 'bg-text-muted', textClass: 'text-text-muted' },
};

function formatDayDate(day: string, scheduledFor: string): string {
  const date = new Date(scheduledFor);
  const dd = date.getDate();
  const months = ['jan.', 'feb.', 'mars', 'apr.', 'mai', 'juni', 'juli', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'];
  return `${day} ${dd}. ${months[date.getMonth()]}`;
}

function hasGuardrailFlags(post: WeekPost): boolean {
  return post.variants.some((v) => v.guardrailFlags.length > 0);
}

export function WeekBoard({
  posts,
  brandName,
  weekLabel,
}: {
  posts: WeekPost[];
  brandName: string;
  weekLabel: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(posts[0]?.id ?? null);
  const [filter, setFilter] = useState<Filter>('all');

  const filteredPosts = useMemo(() => {
    if (filter === 'all') return posts;
    return posts.filter((p) => p.status === filter);
  }, [posts, filter]);

  const selectedPost = posts.find((p) => p.id === selectedId) ?? filteredPosts[0] ?? null;

  const readyOrPublished = posts.filter((p) => p.status === 'ready' || p.status === 'published').length;

  return (
    <main className="mx-auto flex min-h-screen max-w-[1400px] flex-col p-6">
      <TopBar
        weekLabel={weekLabel}
        brandName={brandName}
        total={posts.length}
        done={readyOrPublished}
        filter={filter}
        onFilterChange={setFilter}
      />
      <div className="mt-6 flex flex-1 gap-6">
        <div className="w-full max-w-[34%] shrink-0">
          <PostList
            posts={filteredPosts}
            selectedId={selectedPost?.id ?? null}
            onSelect={setSelectedId}
          />
        </div>
        <div className="min-w-0 flex-1">
          {selectedPost ? (
            <DetailPane key={selectedPost.id} post={selectedPost} />
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl border border-hairline bg-card p-12 text-sm text-text-muted">
              Ingen innlegg i dette filteret.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function TopBar({
  weekLabel,
  brandName,
  total,
  done,
  filter,
  onFilterChange,
}: {
  weekLabel: string;
  brandName: string;
  total: number;
  done: number;
  filter: Filter;
  onFilterChange: (f: Filter) => void;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="animate-in fade-in slide-in-from-top-1 duration-300 flex flex-col gap-4 border-b border-hairline pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          {weekLabel} · {brandName}
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-accent-gold transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-sm text-text-secondary">
            {done} av {total} klare
          </p>
        </div>
      </div>
      <div className="flex gap-1.5" role="group" aria-label="Filtrer innlegg etter status">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => onFilterChange(f.key)}
              aria-pressed={active}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-150',
                active
                  ? 'border-accent-gold bg-accent-gold/10 text-foreground'
                  : 'border-hairline bg-card text-text-secondary hover:bg-secondary',
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PostList({
  posts,
  selectedId,
  onSelect,
}: {
  posts: WeekPost[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {posts.map((post, i) => {
        const selected = post.id === selectedId;
        const meta = STATUS_META[post.status];
        const flagged = hasGuardrailFlags(post);
        return (
          <li
            key={post.id}
            className="animate-in fade-in slide-in-from-left-1"
            style={{ animationDelay: `${i * 30}ms`, animationDuration: '250ms', animationFillMode: 'backwards' }}
          >
            <button
              type="button"
              onClick={() => onSelect(post.id)}
              aria-current={selected ? 'true' : undefined}
              className={cn(
                'flex w-full flex-col gap-1 rounded-xl border px-4 py-3 text-left transition-colors duration-150',
                selected
                  ? 'border-accent-gold bg-accent-gold/[0.06]'
                  : 'border-hairline bg-card hover:bg-secondary/60',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading text-sm font-medium text-foreground">
                  {formatDayDate(post.day, post.scheduledFor)}
                </span>
                <div className="flex items-center gap-1.5">
                  {flagged && (
                    <TriangleAlert
                      className="size-3.5 text-destructive"
                      aria-label="Advarsel: en variant har fanget opp en guardrail"
                    />
                  )}
                  <span className={cn('size-1.5 rounded-full', meta.dotClass)} aria-hidden="true" />
                  <span className={cn('text-xs font-medium', meta.textClass)}>{meta.label}</span>
                </div>
              </div>
              <span className="text-xs text-text-secondary">
                {post.format} · {post.pillar}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function DetailPane({ post }: { post: WeekPost }) {
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState<'full' | 'text' | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftCaption, setDraftCaption] = useState('');

  const chosenVariant = post.variants.find((v) => v.id === post.chosenVariantId) ?? null;
  const chosenBlocked = !!chosenVariant && chosenVariant.guardrailFlags.length > 0;

  function copyText(): string {
    if (!chosenVariant) return '';
    return `${chosenVariant.caption}\n\n${chosenVariant.hashtags.join(' ')}`;
  }

  function handleCopyAndOpen() {
    if (!chosenVariant || chosenBlocked) return;
    navigator.clipboard.writeText(copyText());
    window.open('https://business.facebook.com/latest/composer', '_blank');
    setCopied('full');
    setTimeout(() => setCopied(null), 2000);
  }

  function handleCopyOnly() {
    if (!chosenVariant || chosenBlocked) return;
    navigator.clipboard.writeText(copyText());
    setCopied('text');
    setTimeout(() => setCopied(null), 2000);
  }

  function handleMarkPosted() {
    startTransition(async () => {
      await markPosted(post.id);
    });
  }

  function handleDiscard() {
    startTransition(async () => {
      await discardPost(post.id);
    });
  }

  function handleEditToggle() {
    if (!editing && chosenVariant) {
      setDraftCaption(chosenVariant.caption);
    }
    setEditing((v) => !v);
  }

  function handleSaveEdit() {
    if (!chosenVariant) return;
    startTransition(async () => {
      await editCaption(chosenVariant.id, draftCaption);
      setEditing(false);
    });
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-hairline bg-card">
      <div className="border-b border-hairline px-6 py-5">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          {formatDayDate(post.day, post.scheduledFor)}
        </h2>
        <p className="mt-1.5 text-sm text-text-secondary">
          {post.format} · {post.pillar} · CTA: {post.cta}
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        {post.variants.map((variant) => (
          <VariantCard
            key={variant.id}
            variant={variant}
            chosen={post.chosenVariantId === variant.id}
            onChoose={() => {
              startTransition(async () => {
                await chooseVariant(post.id, variant.id);
              });
            }}
          />
        ))}
      </div>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-2 border-t border-hairline bg-card px-6 py-4">
        {editing && chosenVariant ? (
          <div className="flex w-full flex-col gap-2">
            <textarea
              value={draftCaption}
              onChange={(e) => setDraftCaption(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-hairline bg-background p-3 text-[15px] leading-relaxed text-foreground outline-none focus-visible:border-accent-gold"
              aria-label="Rediger valgt bildetekst"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isPending}
                className="rounded-lg bg-accent-gold px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-gold/90 disabled:opacity-50"
              >
                Lagre
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg border border-hairline bg-card px-4 py-2 text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-secondary"
              >
                Avbryt
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCopyAndOpen}
              disabled={!chosenVariant || chosenBlocked || isPending}
              className="rounded-lg bg-accent-gold px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-gold/90 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Kopier bildetekst og åpne Business Suite"
            >
              {copied === 'full' ? 'Kopiert!' : 'Kopier + åpne Business Suite'}
            </button>
            <button
              type="button"
              onClick={handleCopyOnly}
              disabled={!chosenVariant || chosenBlocked || isPending}
              className="rounded-lg border border-hairline bg-card px-4 py-2 text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Kopier bare tekst"
            >
              {copied === 'text' ? 'Kopiert!' : 'Kopier bare tekst'}
            </button>
            <button
              type="button"
              onClick={handleMarkPosted}
              disabled={!chosenVariant || isPending}
              className="rounded-lg border border-hairline bg-card px-4 py-2 text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Marker innlegg som postet"
            >
              Marker som postet
            </button>
            <button
              type="button"
              onClick={handleEditToggle}
              disabled={!chosenVariant || isPending}
              className="rounded-lg border border-hairline bg-card px-4 py-2 text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Rediger valgt bildetekst"
            >
              Rediger
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              disabled={isPending}
              className="ml-auto rounded-lg px-4 py-2 text-sm font-medium text-text-muted transition-colors duration-150 hover:bg-secondary hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Forkast innlegg"
            >
              Forkast
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function VariantCard({
  variant,
  chosen,
  onChoose,
}: {
  variant: WeekPost['variants'][number];
  chosen: boolean;
  onChoose: () => void;
}) {
  const flagged = variant.guardrailFlags.length > 0;
  return (
    <div
      role="button"
      tabIndex={flagged ? -1 : 0}
      aria-disabled={flagged}
      aria-pressed={chosen}
      onClick={() => {
        if (!flagged) onChoose();
      }}
      onKeyDown={(e) => {
        if (!flagged && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onChoose();
        }
      }}
      className={cn(
        'relative flex flex-col gap-3 rounded-xl border p-4 transition-colors duration-150',
        flagged
          ? 'cursor-not-allowed border-hairline bg-secondary/40'
          : 'cursor-pointer border-hairline bg-card hover:bg-secondary/40',
        chosen && 'border-2 border-accent-gold bg-accent-gold/[0.04]',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {flagged && (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
            <TriangleAlert className="size-3" aria-hidden="true" />
            {variant.guardrailFlags.join(', ')}
          </span>
        )}
        {chosen && (
          <span className="ml-auto inline-flex items-center rounded-full bg-accent-gold px-2.5 py-1 text-xs font-medium text-white">
            Valgt
          </span>
        )}
      </div>
      <p className="whitespace-pre-wrap text-[15px] leading-[1.6] text-foreground">{variant.caption}</p>
      {variant.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {variant.hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-2 py-0.5 text-xs text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {variant.suggestedAssetTag && (
        <p className="flex items-center gap-1.5 text-xs text-text-muted">
          <ImageIcon className="size-3.5" aria-hidden="true" />
          Foreslått asset: <span className="font-mono">{variant.suggestedAssetTag}</span>
        </p>
      )}
    </div>
  );
}
