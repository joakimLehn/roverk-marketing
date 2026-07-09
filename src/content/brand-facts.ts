import type { ProductFacts } from '@/db/schema';

export const skjulFacts: ProductFacts = {
  priceFrom: 5990,
  currency: 'NOK',
  usps: [
    'Ikke søknadspliktig (frittstående)',
    'Betal etter montering',
    'Levert ferdig montert i Trondheimsområdet (levering inkludert)',
    'Håndbygd lokalt i ekte tre',
    'Skjuler 2–4 dunker (Standard & XL)',
  ],
  geo: ['Trondheim', 'Malvik', 'Melhus', 'Stjørdal', 'Klæbu', 'Heimdal'],
  honestyRules: [
    'Aldri oppdiktede omtaler, stjerner eller antall solgte',
    'Aldri «kjent fra»',
    'Kun ekte fakta og garantier',
  ],
};
