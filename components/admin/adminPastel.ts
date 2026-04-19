/**
 * 管理画面共通のパステル系 Tailwind クラス断片
 * （ブランドネイビーに依存しないトーン統一用）
 */
export const ADMIN_PAGE_BG = 'bg-[#F8F9FF]';

export const ADMIN_CARD =
  'rounded-3xl border border-blue-50/90 bg-white shadow-xl shadow-blue-500/5';

export const ADMIN_CARD_TABLE_WRAP =
  'overflow-x-auto rounded-2xl border border-blue-50/80 bg-white shadow-xl shadow-blue-500/5';

export const ADMIN_HEADER_BAR =
  'border-b border-blue-50/80 bg-white/90 backdrop-blur-md shadow-xl shadow-blue-500/[0.04]';

export const ADMIN_BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 rounded-2xl bg-[#A0D8EF] px-4 py-2.5 text-sm font-semibold text-[#2C657A] shadow-sm transition-all duration-200 hover:brightness-[1.06] hover:shadow-md active:translate-y-px disabled:opacity-40';

export const ADMIN_BTN_PRIMARY_COMPACT =
  'inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#A0D8EF] px-4 py-2.5 text-sm font-semibold text-[#2C657A] shadow-sm transition-all duration-200 hover:brightness-[1.06] hover:shadow-md active:translate-y-px disabled:opacity-40';

export const ADMIN_BTN_AUTH =
  'w-full rounded-2xl bg-[#A0D8EF] py-3 text-sm font-semibold text-white shadow-md shadow-sky-400/20 transition-all duration-200 hover:brightness-[1.05] disabled:opacity-40';

export const ADMIN_BTN_PINK =
  'inline-flex items-center justify-center rounded-2xl bg-[#FFC0CB] px-4 py-2 text-sm font-semibold text-[#8B4A5C] shadow-sm transition-all duration-200 hover:brightness-[1.04] disabled:opacity-40';

export const ADMIN_BTN_SECONDARY =
  'inline-flex items-center justify-center rounded-2xl border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all duration-200 hover:bg-violet-50/50 hover:border-sky-100 disabled:opacity-40';

export const ADMIN_BTN_OUTLINE =
  'inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-sky-50/60 hover:border-sky-200/50 disabled:opacity-40';

export const ADMIN_TAB_WRAP =
  'flex flex-wrap gap-2 p-2 rounded-3xl border border-blue-50/70 bg-white/90 shadow-xl shadow-blue-500/[0.05] w-fit max-w-full';

export const ADMIN_FOCUS_RING = 'focus:outline-none focus:ring-2 focus:ring-sky-200/80';

export const ADMIN_ICON_SKY = 'text-sky-400';
export const ADMIN_ICON_VIOLET = 'text-violet-300';
export const ADMIN_ICON_ROSE = 'text-rose-300';

/** タブ切り替え（page 用） */
export function adminTabButtonClass(active: boolean): string {
  const base =
    'px-3 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap border transition-all duration-200 text-slate-600';
  return active
    ? `${base} bg-sky-50/95 border-sky-100 border-b-[3px] border-b-sky-300/90 shadow-sm`
    : `${base} border-blue-50/80 bg-white/95 hover:bg-violet-50/45 hover:border-sky-100/70`;
}
