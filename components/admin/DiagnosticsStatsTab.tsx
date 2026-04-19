'use client';

import dynamic from 'next/dynamic';
import { Sparkles } from 'lucide-react';
import { AnalysisTab } from '@/components/admin/AnalysisTab';

const DownloadStatsDashboard = dynamic(
  () =>
    import('@/components/admin/DownloadStatsDashboard').then((mod) => ({
      default: mod.DownloadStatsDashboard,
    })),
  { ssr: false }
);

type Props = { secretKey: string };

export function DiagnosticsStatsTab({ secretKey }: Props) {
  return (
    <div className="space-y-6">
      <DownloadStatsDashboard secretKey={secretKey} className="mb-0" />

      <div className="rounded-3xl border border-blue-50/90 bg-white p-5 shadow-xl shadow-blue-500/5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 shrink-0 text-sky-400" aria-hidden />
          <h2 className="text-base font-semibold text-slate-600">アカウント診断の記録</h2>
        </div>
        <p className="mb-4 text-sm text-slate-600">
          診断ツールに入力されたアカウントの一覧です。行をタップすると、そのときの診断結果を確認できます。
        </p>
        <AnalysisTab secretKey={secretKey} />
      </div>
    </div>
  );
}
