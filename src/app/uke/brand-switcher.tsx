'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { WeekBoard } from '@/app/week-board';
import type { BrandWeek } from '@/lib/dashboard-types';

export function BrandSwitcher({ brands }: { brands: BrandWeek[] }) {
  const [activeSlug, setActiveSlug] = useState<string | undefined>(brands[0]?.brandSlug);

  if (brands.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-2 p-6 text-center">
        <h1 className="text-xl font-heading font-semibold">Ingen aktive merkevarer ennå.</h1>
      </main>
    );
  }

  const activeBrand = brands.find((b) => b.brandSlug === activeSlug) ?? brands[0];

  return (
    <div className="flex min-h-screen flex-col">
      {brands.length > 1 && (
        <nav
          className="mx-auto flex w-full max-w-[1400px] items-center gap-1 border-b border-hairline px-6 pt-6"
          role="tablist"
          aria-label="Velg merkevare"
        >
          {brands.map((brand) => {
            const active = brand.brandSlug === activeBrand.brandSlug;
            return (
              <button
                key={brand.brandSlug}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveSlug(brand.brandSlug)}
                className={cn(
                  'flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors duration-150',
                  active ? 'text-foreground' : 'border-transparent text-text-muted hover:text-text-secondary',
                )}
                style={active ? { borderBottomColor: brand.color ?? '#C7924E' } : undefined}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: brand.color ?? '#C7924E' }}
                  aria-hidden="true"
                />
                {brand.brandName}
              </button>
            );
          })}
        </nav>
      )}
      <WeekBoard
        key={activeBrand.brandSlug}
        posts={activeBrand.posts}
        brandName={activeBrand.brandName}
        weekLabel={activeBrand.weekLabel}
      />
    </div>
  );
}
