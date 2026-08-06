'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { FileUp, ToggleRight, Sparkles } from 'lucide-react';

const DiagnosticsStatsTab = dynamic(() =>
  import('@/components/admin/DiagnosticsStatsTab').then((m) => ({ default: m.DiagnosticsStatsTab }))
);
const DownloadRequestsTab = dynamic(() =>
  import('@/components/admin/DownloadRequestsTab').then((m) => ({ default: m.DownloadRequestsTab }))
);
const RestaurantDiagnosisTab = dynamic(() =>
  import('@/components/admin/RestaurantDiagnosisTab').then((m) => ({ default: m.RestaurantDiagnosisTab }))
);
const PlanningRequestsTab = dynamic(() =>
  import('@/components/admin/PlanningRequestsTab').then((m) => ({ default: m.PlanningRequestsTab }))
);
const DocumentsTab = dynamic(() =>
  import('@/components/admin/DocumentsTab').then((m) => ({ default: m.DocumentsTab }))
);
const BroadcastEmailTab = dynamic(() =>
  import('@/components/admin/BroadcastEmailTab').then((m) => ({ default: m.BroadcastEmailTab }))
);
const ImagesTab = dynamic(() =>
  import('@/components/admin/ImagesTab').then((m) => ({ default: m.ImagesTab }))
);

import {
  ADMIN_PAGE_BG,
  ADMIN_CARD,
  ADMIN_BTN_AUTH,
  ADMIN_ICON_SKY,
  ADMIN_ICON_VIOLET,
} from '@/components/admin/adminPastel';

type ActiveTab =
  | 'diagnostics'
  | 'download'
  | 'restaurantDiagnosis'
  | 'planning'
  | 'documents'
  | 'broadcast'
  | 'images';

type NavItem = { id: ActiveTab; label: string; icon: string };
const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'CONTENT',
    items: [
      { id: 'documents', label: '資料管理', icon: '📚' },
      { id: 'images', label: '画像ライブラリ', icon: '🖼️' },
    ],
  },
  {
    section: 'LEADS',
    items: [
      { id: 'download', label: '資料DL申請', icon: '📥' },
      { id: 'restaurantDiagnosis', label: '飲食店無料診断', icon: '🍽️' },
      { id: 'planning', label: 'プランニング履歴', icon: '🧭' },
      { id: 'diagnostics', label: '診断統計', icon: '📈' },
    ],
  },
  {
    section: 'OUTREACH',
    items: [{ id: 'broadcast', label: '一斉メール', icon: '📣' }],
  },
];

const ALL_ITEMS = NAV.flatMap((g) => g.items);

export default function AdminPage() {
  const [secretKey, setSecretKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('download');

  const handleAuthenticate = async () => {
    if (!secretKey.trim()) {
      setErrorMessage('秘密キーを入力してください');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/admin/entered-ids', {
        headers: { Authorization: `Bearer ${secretKey}` },
      });
      if (!response.ok) {
        setErrorMessage('認証に失敗しました。秘密キーを確認してください。');
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
      setErrorMessage('');
    } catch {
      setErrorMessage('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSecretKey('');
    setErrorMessage('');
    setActiveTab('download');
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${ADMIN_PAGE_BG}`}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4 border-4 border-sky-100 border-t-sky-400 rounded-full"
          />
          <p className="text-slate-600">認証中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${ADMIN_PAGE_BG}`}>
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${ADMIN_CARD} p-8`}
          >
            <div className="flex justify-center mb-3">
              <Sparkles className={`h-10 w-10 ${ADMIN_ICON_SKY}`} aria-hidden />
            </div>
            <h1 className="font-semibold mb-2 text-center text-slate-600">管理者認証</h1>
            <p className="text-slate-500 text-sm mb-6 text-center">
              管理画面を表示するには秘密キーが必要です。
            </p>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuthenticate()}
              placeholder="秘密キーを入力"
              className="w-full px-4 py-3 border border-blue-100 rounded-2xl text-base text-slate-600 bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-200/80 transition-colors mb-4"
            />
            {errorMessage && (
              <p className="text-rose-500 text-sm mb-4 text-center">{errorMessage}</p>
            )}
            <button onClick={handleAuthenticate} type="button" className={ADMIN_BTN_AUTH}>
              認証する
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const navBtnClass = (active: boolean) =>
    `flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] transition ${
      active ? 'bg-[#0D3B75] font-bold text-white' : 'text-[#4A5871] hover:bg-white'
    }`;

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* トップバー（ネイビー） */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-[#0D3B75] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <span className="h-5 w-5 shrink-0 rounded-full bg-white/90" aria-hidden />
          <span className="truncate text-[15px] font-bold text-white">COCOマーケ 管理</span>
          <span className="hidden rounded bg-white/15 px-2 py-0.5 font-mono text-[10px] tracking-wide text-white/85 sm:inline">
            PRODUCTION
          </span>
        </div>
        <div className="flex items-center gap-3 text-[13px] text-white/85">
          <a href="/" className="hidden transition hover:text-white sm:inline">
            公開サイトを見る →
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 rounded-md border border-white/25 px-3 py-1.5 text-white transition hover:bg-white/10"
          >
            ログアウト
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1280px]">
        {/* 左サイドバー（PC） */}
        <aside className="hidden w-[224px] shrink-0 border-r border-[#E4E9F0] px-3 py-6 lg:block">
          <nav className="flex flex-col gap-6">
            {NAV.map((group) => (
              <div key={group.section}>
                <div className="px-3 pb-2 font-mono text-[10px] font-bold tracking-[.12em] text-[#9AA6B8]">
                  {group.section}
                </div>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={navBtnClass(activeTab === item.id)}
                    >
                      <span aria-hidden>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* コンテンツ */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6">
          {/* モバイル用ナビ（横スクロール） */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {ALL_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === item.id
                    ? 'bg-[#0D3B75] text-white'
                    : 'border border-[#E4E9F0] bg-white text-[#4A5871]'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          {/* 運用ガイド */}
          <div className="mb-5 rounded-2xl border border-[#E4E9F0] bg-white px-4 py-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#7A879C]">
              <Sparkles className={`h-3.5 w-3.5 ${ADMIN_ICON_VIOLET}`} aria-hidden />
              運用ガイド
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-[#4A5871]">
              <span className="inline-flex items-center gap-2 rounded-xl border border-[#E4E9F0] bg-[#F7F9FC] px-3 py-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0D3B75] text-[11px] font-bold text-white">1</span>
                <FileUp className={`h-4 w-4 ${ADMIN_ICON_SKY} shrink-0`} aria-hidden />
                <span className="font-medium">資料をアップ</span>
              </span>
              <span className="hidden text-[#C8D2E0] sm:block">→</span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-[#E4E9F0] bg-[#F7F9FC] px-3 py-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0D3B75] text-[11px] font-bold text-white">2</span>
                <ToggleRight className={`h-4 w-4 ${ADMIN_ICON_SKY} shrink-0`} aria-hidden />
                <span className="font-medium">公開する</span>
              </span>
            </div>
          </div>

          {/* アクティブなタブの内容 */}
          <div className="rounded-2xl border border-[#E4E9F0] bg-white p-5 shadow-[0_1px_3px_rgba(13,59,117,.05)] sm:p-6">
            {activeTab === 'diagnostics' && <DiagnosticsStatsTab secretKey={secretKey} />}
            {activeTab === 'download' && <DownloadRequestsTab secretKey={secretKey} />}
            {activeTab === 'restaurantDiagnosis' && <RestaurantDiagnosisTab secretKey={secretKey} />}
            {activeTab === 'planning' && <PlanningRequestsTab secretKey={secretKey} />}
            {activeTab === 'documents' && <DocumentsTab secretKey={secretKey} />}
            {activeTab === 'broadcast' && <BroadcastEmailTab secretKey={secretKey} />}
            {activeTab === 'images' && <ImagesTab secretKey={secretKey} />}
          </div>
        </main>
      </div>
    </div>
  );
}
