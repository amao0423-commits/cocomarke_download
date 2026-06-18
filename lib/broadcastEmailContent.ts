import { buildBroadcastEmailHtml } from '@/lib/broadcastEmailLayout';

export const BROADCAST_BODY_MODES = ['plain', 'html'] as const;
export type BroadcastBodyMode = (typeof BROADCAST_BODY_MODES)[number];

export function normalizeBroadcastBodyMode(value: unknown): BroadcastBodyMode {
  return value === 'html' ? 'html' : 'plain';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function plainTextToHtmlFragment(value: string): string {
  const normalized = value.replace(/\r\n/g, '\n').trim();
  if (!normalized) return '<p></p>';

  return normalized
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((line) => escapeHtml(line.trimEnd()))
        .join('<br>');
      return `<p>${lines}</p>`;
    })
    .join('\n');
}

export function buildBroadcastEmailHtmlFromContent(params: {
  bodyContent: string;
  bodyMode: BroadcastBodyMode;
}): string {
  const fragment =
    params.bodyMode === 'html'
      ? params.bodyContent
      : plainTextToHtmlFragment(params.bodyContent);
  return buildBroadcastEmailHtml(fragment);
}
