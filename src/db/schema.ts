import { pgTable, uuid, text, boolean, timestamp, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';

export const platformEnum = pgEnum('platform', ['facebook', 'instagram', 'tiktok']);
export const postStatusEnum = pgEnum('post_status', ['draft', 'ready', 'published', 'rejected']);
export const assetTypeEnum = pgEnum('asset_type', ['video', 'image']);

export const brands = pgTable('brands', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  toneOverride: text('tone_override'),
  productFacts: jsonb('product_facts').$type<ProductFacts>(),
});

export const channels = pgTable('channels', {
  id: uuid('id').defaultRandom().primaryKey(),
  brandId: uuid('brand_id').notNull().references(() => brands.id),
  platform: platformEnum('platform').notNull(),
  accountId: text('account_id'),
  pageId: text('page_id'),
  igUserId: text('ig_user_id'),
  tokenRef: text('token_ref'),
  calendarId: text('calendar_id').notNull(),
  toneOverride: text('tone_override'),
  active: boolean('active').notNull().default(false),
});

export const calendarTemplates = pgTable('calendar_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  calendarId: text('calendar_id').notNull(),
  week: integer('week').notNull(),
  day: text('day').notNull(),
  platform: platformEnum('platform').notNull(),
  format: text('format').notNull(),
  pillar: text('pillar').notNull(),
  hook: text('hook').notNull(),
  cta: text('cta').notNull(),
  notes: text('notes'),
});

export const assets = pgTable('assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  brandId: uuid('brand_id').notNull().references(() => brands.id),
  type: assetTypeEnum('type').notNull(),
  pathOrUrl: text('path_or_url').notNull(),
  format: text('format'),
  tags: text('tags').array(),
  durationS: integer('duration_s'),
  credit: text('credit'),
});

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  channelId: uuid('channel_id').notNull().references(() => channels.id),
  templateId: uuid('template_id').references(() => calendarTemplates.id),
  scheduledFor: timestamp('scheduled_for', { withTimezone: true }).notNull(),
  status: postStatusEnum('status').notNull().default('draft'),
  chosenVariantId: uuid('chosen_variant_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const postVariants = pgTable('post_variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').notNull().references(() => posts.id),
  caption: text('caption').notNull(),
  hashtags: text('hashtags').array().notNull(),
  suggestedAssetId: uuid('suggested_asset_id').references(() => assets.id),
  model: text('model').notNull(),
  guardrailFlags: jsonb('guardrail_flags').$type<string[]>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const tokens = pgTable('tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  channelId: uuid('channel_id').notNull().references(() => channels.id),
  accessToken: text('access_token').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
});

export const logs = pgTable('logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').references(() => posts.id),
  level: text('level').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type ProductFacts = {
  priceFrom: number;
  currency: string;
  usps: string[];
  geo: string[];
  honestyRules: string[];
};
