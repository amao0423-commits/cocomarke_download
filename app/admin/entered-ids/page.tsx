'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  FileUp,
  Mail,
  Link2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const DiagnosticsStatsTab = dynamic(() =>
  import('@/components/admin/DiagnosticsStatsTab').then((m) => ({ default: m.DiagnosticsStatsTab }))
);
const DownloadRequestsTab = dynamic(() =>
  import('@/components/admin/DownloadRequestsTab').then((m) => ({ default: m.DownloadRequestsTab }))
);
const DocumentsTab = dynamic(() =>
  import('@/components/admin/DocumentsTab').then((m) => ({ default: m.DocumentsTab }))
);
const TemplatesTab = dynamic(() =>
  import('@/components/admin/TemplatesTab').then((m) => ({ default: m.TemplatesTab }))
);
const DefaultMailTemplateTab = dynamic(() =>
  import('@/components/admin/DefaultMailTemplateTab').then((m) => ({ default: m.DefaultMailTemplateTab }))
);
const DownloadFormConfigsTab = dynamic(() =>
  import('@/components/admin/DownloadFormConfigsTab').then((m) => ({ default: m.DownloadFormConfigsTab }))
);
const ImagesTab = dynamic(() =>
  import('@/components/admin/ImagesTab').then((m) => ({ default: m.ImagesTab }))
);
const RestaurantDiagnosisTab = dynamic(() =>
  import('@/components/admin/RestaurantDiagnosisTab').then((m) => ({ default: m.RestaurantDiagnosisTab }))
);
const BroadcastEmailTab = dynamic(() =>
  import('@/components/admin/BroadcastEmailTab').then((m) => ({ default: m.BroadcastEmailTab }))
);
import {
  ADMIN_PAGE_BG,
  ADMIN_CARD,
  ADMIN_HEADER_BAR,
  ADMIN_BTN_AUTH,
  ADMIN_BTN_SECONDARY,
  adminTabButtonClass,
  ADMIN_TAB_WRAP,
  ADMIN_ICON_SKY,
  ADMIN_ICON_VIOLET,
  ADMIN_ICON_ROSE,
} from '@/components/admin/adminPastel';

type ActiveTab =
  | 'diagnostics'
  | 'download'
  | 'restaurantDiagnosis'
  | 'formSettings'
  | 'templates'
  | 'mailDefaults'
  | 'broadcast'
  | 'documents'
  | 'images';

export default function AdminPage() {
  const [secretKey, setSecretKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('diagnostics');

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
    setActiveTab('diagnostics');
  };

  const tabBtn = (id: ActiveTab, label: string) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={adminTabButtonClass(activeTab === id)}
    >
      {label}
    </button>
  );

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

            <button
              onClick={handleAuthenticate}
              type="button"
              className={ADMIN_BTN_AUTH}
            >
              認証する
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${ADMIN_PAGE_BG}`}>
      <div className={`sticky top-0 z-10 ${ADMIN_HEADER_BAR}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className={`h-7 w-7 shrink-0 ${ADMIN_ICON_SKY} hidden sm:block`} aria-hidden />
            <h1 className="font-semibold text-slate-600 truncate">管理ダッシュボード</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className={`shrink-0 px-4 py-2 ${ADMIN_BTN_SECONDARY} text-xs sm:text-sm`}
          >
            ログアウト
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <div className="rounded-3xl border border-violet-100/60 bg-gradient-to-r from-white via-sky-50/40 to-rose-50/30 px-4 py-3 shadow-xl shadow-violet-500/[0.06]">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1.5">
            <Sparkles className={`h-3.5 w-3.5 ${ADMIN_ICON_VIOLET}`} aria-hidden />
            運用ガイド
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-1.5 border border-blue-50/80 shadow-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A0D8EF] text-[#2C657A] text-xs font-bold">
                1
              </span>
              <FileUp className={`h-4 w-4 ${ADMIN_ICON_SKY} shrink-0`} aria-hidden />
              <span className="font-medium">資料をアップ</span>
            </span>
            <ChevronRight className="h-4 w-4 text-slate-300 hidden sm:block shrink-0" aria-hidden />
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-1.5 border border-blue-50/80 shadow-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A0D8EF] text-[#2C657A] text-xs font-bold">
                2
              </span>
              <Mail className={`h-4 w-4 ${ADMIN_ICON_ROSE} shrink-0`} aria-hidden />
              <span className="font-medium">メールを作る</span>
            </span>
            <ChevronRight className="h-4 w-4 text-slate-300 hidden sm:block shrink-0" aria-hidden />
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-1.5 border border-blue-50/80 shadow-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A0D8EF] text-[#2C657A] text-xs font-bold">
                3
              </span>
              <Link2 className={`h-4 w-4 ${ADMIN_ICON_VIOLET} shrink-0`} aria-hidden />
              <span className="font-medium">フォームと紐付ける</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium text-slate-500 px-0.5">まずはここから（おすすめの順）</p>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-600 px-0.5">診断・申請の確認</p>
            <div className={ADMIN_TAB_WRAP}>
              {tabBtn('diagnostics', '📈 診断統計')}
              {tabBtn('download', '📥 届いた申請')}
              {tabBtn('restaurantDiagnosis', '🍽️ SNS診断申請')}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-600 px-0.5">フォーム・メールの設定</p>
            <div className={ADMIN_TAB_WRAP}>
              {tabBtn('formSettings', '🔗 フォーム紐付け')}
              {tabBtn('templates', '✉️ メール作成')}
              {tabBtn('mailDefaults', '📝 メールの下書き')}
              {tabBtn('broadcast', '📣 一斉メール')}
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 px-0.5 pt-1">配布物・メディア</p>
          <div className={ADMIN_TAB_WRAP}>
            {tabBtn('documents', '📚 資料管理')}
            {tabBtn('images', '🖼️ 画像')}
          </div>
        </div>

        <div className={`${ADMIN_CARD} p-5 sm:p-6`}>
          {activeTab === 'diagnostics' && <DiagnosticsStatsTab secretKey={secretKey} />}
          {activeTab === 'download' && <DownloadRequestsTab secretKey={secretKey} />}
          {activeTab === 'restaurantDiagnosis' && <RestaurantDiagnosisTab secretKey={secretKey} />}
          {activeTab === 'formSettings' && <DownloadFormConfigsTab secretKey={secretKey} />}
          {activeTab === 'documents' && <DocumentsTab secretKey={secretKey} />}
          {activeTab === 'mailDefaults' && <DefaultMailTemplateTab secretKey={secretKey} />}
          {activeTab === 'broadcast' && <BroadcastEmailTab secretKey={secretKey} />}
          {activeTab === 'templates' && <TemplatesTab secretKey={secretKey} />}
          {activeTab === 'images' && <ImagesTab secretKey={secretKey} />}
        </div>
      </div>
    </div>
  );
}
