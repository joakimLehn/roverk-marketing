'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { CircleCheck, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { markPosted } from '@/app/actions';
import { brandColor, type TodayItem } from '@/lib/dashboard-types';

const WEEKDAYS = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
const MONTHS = [
  'januar', 'februar', 'mars', 'april', 'mai', 'juni',
  'juli', 'august', 'september', 'oktober', 'november', 'desember',
];

function formatTodayLabel(date: Date): string {
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()}. ${MONTHS[date.getMonth()]}`;
}

export function TodayQueue({ items }: { items: TodayItem[] }) {
  const [dateLabel] = useState<string>(() => formatTodayLabel(new Date()));

  const total = items.length;
  const published = items.filter((i) => i.status === 'published').length;
  const pct = total > 0 ? Math.round((published / total) * 100) : 0;

  const nextUpIndex = items.findIndex((i) => i.status !== 'published');

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1100px] flex-col px-6 py-8">
      <header className="animate-in fade-in slide-in-from-top-1 duration-300 border-b border-hairline pb-5">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          I dag
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          {dateLabel} · alle merkevarer
        </p>
        {total > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-accent-gold transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-sm text-text-secondary">
              {published} av {total} postet
            </p>
          </div>
        )}
      </header>

      <div className="mt-6 flex-1">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item, i) => (
              <li
                key={item.postId}
                className="animate-in fade-in slide-in-from-left-1"
                style={{ animationDelay: `${i * 30}ms`, animationDuration: '250ms', animationFillMode: 'backwards' }}
              >
                <QueueCard item={item} isNextUp={i === nextUpIndex} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-2 rounded-xl border border-hairline bg-card p-12 text-center">
      <p className="font-heading text-lg font-medium text-foreground">Ingenting planlagt i dag.</p>
      <p className="text-sm text-text-muted">Se Uke-fanen for det som kommer.</p>
      <Link
        href="/uke"
        className="mt-3 rounded-lg border border-hairline bg-card px-4 py-2 text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-secondary"
      >
        Gå til Uke
      </Link>
    </div>
  );
}

function QueueCard({ item, isNextUp }: { item: TodayItem; isNextUp: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const color = brandColor(item.brandSlug, item.brandColorStored);
  const flagged = item.guardrailFlags.length > 0;
  const published = item.status === 'published';

  function handleCopyAndOpen() {
    if (flagged) return;
    const text = `${item.caption}\n\n${item.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    window.open('https://business.facebook.com/latest/composer', '_blank');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleMarkPosted() {
    startTransition(async () => {
      await markPosted(item.postId);
    });
  }

  if (published) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-hairline bg-card/60 px-4 py-3 opacity-60">
        <div className="flex items-center justify-between gap-2">
          <BrandChip brandName={item.brandName} color={color} />
          <span className="inline-flex items-center gap-1 text-xs font-medium text-status-postet">
            <CircleCheck className="size-3.5" aria-hidden="true" />
            Postet
          </span>
        </div>
        <p className="text-sm text-text-muted line-through">{item.caption}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border bg-card p-4',
        isNextUp ? 'border-2 border-accent-gold' : 'border-hairline',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BrandChip brandName={item.brandName} color={color} />
          {isNextUp && (
            <span className="inline-flex items-center rounded-full bg-accent-gold px-2.5 py-1 text-xs font-medium text-white">
              Neste opp
            </span>
          )}
        </div>
        <span className="text-xs text-text-muted">
          {item.platform} · {item.format}
        </span>
      </div>

      <p className="whitespace-pre-wrap text-[15px] leading-[1.6] text-foreground">{item.caption}</p>

      <p className="text-xs text-text-muted">
        {item.suggestedAssetTag && <span className="font-mono">{item.suggestedAssetTag}</span>}
        {item.suggestedAssetTag && item.hashtags.length > 0 && ' · '}
        {item.hashtags.slice(0, 3).join(' ')}
      </p>

      {flagged && (
        <p className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
          <TriangleAlert className="size-3" aria-hidden="true" />
          {item.guardrailFlags.join(', ')}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCopyAndOpen}
          disabled={flagged || isPending}
          className="rounded-lg bg-accent-gold px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-gold/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? 'Kopiert!' : 'Kopier + åpne Business Suite'}
        </button>
        <button
          type="button"
          onClick={handleMarkPosted}
          disabled={isPending}
          className="rounded-lg border border-hairline bg-card px-4 py-2 text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Marker som postet
        </button>
      </div>
    </div>
  );
}

function BrandChip({ brandName, color }: { brandName: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      {brandName}
    </span>
  );
}
