import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Lazy init: neon() kalles FØRST ved faktisk DB-bruk (runtime), ikke ved import.
// Det hindrer at `next build` (page-data-innsamling) krasjer når DATABASE_URL
// ikke er satt, og gir en tydelig feil i runtime hvis den mangler.
function init() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL er ikke satt');
  return drizzle(neon(url), { schema });
}

let _db: ReturnType<typeof init> | null = null;

export const db = new Proxy({} as ReturnType<typeof init>, {
  get(_target, prop, receiver) {
    _db ??= init();
    const value = Reflect.get(_db, prop, receiver);
    return typeof value === 'function' ? value.bind(_db) : value;
  },
});
