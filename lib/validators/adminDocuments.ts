import { z } from 'zod';

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const uploadUrlBodySchema = z.object({
  fileName: z.string().min(1).max(500),
  mimeType: z.string(),
  fileSize: z.number().int().positive(),
});

export const documentCreateSchema = z.object({
  title: z.string().min(1).max(500),
  storage_path: z.string().min(1),
  file_name: z.string().optional().nullable(),
  file_size: z.number().int().nonnegative().optional().nullable(),
  file_type: z.string().optional().nullable(),
  download_url: z.union([z.string().url(), z.literal('')]).optional().nullable(),
  /** 一覧・ピックアップ用。公開アクセス可能な画像URL */
  thumbnail_url: z.union([z.string().url(), z.literal('')]).optional().nullable(),
  category: z.string().min(1).max(200).optional().nullable(),
  sort_order: z.number().int().min(0).optional(),
  /** ダウンロードページ左カラム設定 */
  hero_description: z.string().max(2000).optional().nullable(),
  hero_highlight_1: z.string().max(500).optional().nullable(),
  hero_highlight_2: z.string().max(500).optional().nullable(),
  hero_highlight_3: z.string().max(500).optional().nullable(),
  /** 箇条書き4行目以降（改行区切り） */
  hero_highlights_extra: z.string().max(4000).optional().nullable(),
  hero_image_1_url: z.union([z.string().url(), z.literal('')]).optional().nullable(),
  hero_image_2_url: z.union([z.string().url(), z.literal('')]).optional().nullable(),
});

export const documentCategoryCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
});

export const documentCategoryUpdateSchema = z
  .object({
    headline: z.string().max(500).optional().nullable(),
    description: z.string().max(2000).optional().nullable(),
  })
  .refine((d) => d.headline !== undefined || d.description !== undefined, {
    message: '更新項目が必要です',
  });

export const templateLinkSchema = z.object({
  document_id: z.string().uuid(),
  label: z.string().min(1).max(500),
  sort_order: z.number().int().optional(),
});

export const emailTemplateCreateSchema = z.object({
  subject: z.string().min(1).max(998),
  body_html: z.string().min(1),
  is_published: z.boolean().optional(),
  links: z.array(templateLinkSchema).default([]),
});

export const emailTemplateUpdateSchema = z
  .object({
    subject: z.string().min(1).max(998).optional(),
    body_html: z.string().min(1).optional(),
    is_published: z.boolean().optional(),
    links: z.array(templateLinkSchema).optional(),
  })
  .refine(
    (d) =>
      d.subject !== undefined ||
      d.body_html !== undefined ||
      d.is_published !== undefined ||
      d.links !== undefined,
    { message: '更新項目が必要です' }
  );
