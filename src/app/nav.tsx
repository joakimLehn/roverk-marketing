'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/', label: 'I dag' },
  { href: '/uke', label: 'Uke' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between border-b border-hairline py-4">
      <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
        Roverk
      </span>
      <div className="flex items-center gap-6">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'pb-1 text-sm font-medium transition-colors duration-150',
                active
                  ? 'border-b-2 border-accent-gold text-foreground'
                  : 'border-b-2 border-transparent text-text-muted hover:text-text-secondary',
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
