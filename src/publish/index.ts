import type { Publisher } from './types';

// Fase 2: meta- og tiktok-adaptere implementerer Publisher og registreres her.
export function getPublisher(platform: string): Publisher {
  throw new Error(`Publisher for "${platform}" ikke implementert (Fase 2).`);
}
