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

export const vedFacts: ProductFacts = {
  priceFrom: 5990,
  currency: 'NOK',
  usps: [
    'Tørr ved hele vinteren – bratt tak (63°) feller regn og snø, åpne gavler og luftespalter gir gjennomtrekk',
    'Levert og ferdig montert – vi tar hele jobben',
    'Ikke søknadspliktig (frittstående)',
    'Betal først når det står ferdig – ingen forskudd',
    'Ekte trehåndverk, håndbygd lokalt i Trondheim',
    'Tre størrelser: ~1 000 / 2 500 / 5 000 liter (fra 5 990 / 9 990 / 14 990 kr)',
  ],
  geo: ['Trondheim', 'Melhus', 'Malvik'],
  honestyRules: [
    'Rolig, trygg tone – ikke rop, ikke «BILLIGST!» («Bygget for orden», ikke «knalltilbud»)',
    'Maks 1–2 emoji per innlegg, aldri i overskrift',
    'Aldri påstander om antall solgte, stjerner eller kundesitater vi ikke har',
    'Introduksjonspris/hast brukes kun hvis det faktisk stemmer',
  ],
};

export const ordenFacts: ProductFacts = {
  priceFrom: 3190,
  currency: 'NOK',
  usps: [
    'Kassene alltid inkludert (Stor 60 l / Veldig stor 100 l)',
    'Levert og ferdig montert – ingen flatpakke, ingen helgeprosjekt',
    'Betal først når det står ferdig – ingen forskudd',
    'Kasser henger i kanten på et rack i ekte tre – utnytter hele høyden',
    'På hjul som tilvalg – trill racket dit du vil',
    'Rimeligere enn IKEA-hyller kjøpt og bygget selv (levering + montering inkludert)',
  ],
  geo: ['Trondheim', 'Melhus', 'Malvik'],
  honestyRules: [
    'Rolig, trygg tone – ikke rop, ikke «BILLIGST!» («Bygget for orden», ikke «knalltilbud»)',
    'Maks 1–2 emoji per innlegg, aldri i overskrift',
    'Aldri påstander om antall solgte, stjerner eller kundesitater vi ikke har',
    'IKEA-sammenligning holdes ærlig: «rimeligere enn IKEA-deler levert og montert», aldri «billigst»',
    'Introduksjonspris/hast brukes kun hvis det faktisk stemmer',
  ],
};
