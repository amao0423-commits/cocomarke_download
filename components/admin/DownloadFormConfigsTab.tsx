'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Mail,
  Tag,
  Type,
  Plus,
  Trash2,
  Info,
  Settings2,
} from 'lucide-react';
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD_TABLE_WRAP,
  ADMIN_FOCUS_RING,
} from '@/components/admin/adminPastel';

type FormConfigRow = {
  id: string;
  slug: string;
  name: string;
  template_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type TemplateOption = { id: string; updated_at: string };

function templateSelectLabel(updatedAt: string) {
  const d = new Date(updatedAt);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('ja-JP');
}

const btnDanger =
  'inline-flex items-center gap-1 text-sm font-medium text-rose-500 hover:text-rose-600 hover:underline disabled:opacity-40';

export function DownloadFormConfigsTab({ secretKey }: { secretKey: string }) {
  const [configs, setConfigs] = useState<FormConfigRow[]>([]);
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const [newSlug, setNewSlug] = useState('');
  const [newName, setNewName] = useState('');
  const [newTemplateId, setNewTemplateId] = useState<string>('');
  const [creating, setCreating] = useState(false);

  const auth = { Authorization: `Bearer ${secretKey}` };

  const load = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [cRes, tRes] = await Promise.all([
        fetch('/api/admin/download-form-configs', { headers: auth }),
        fetch('/api/admin/email-templates', { headers: auth }),
      ]);
      const cData = await cRes.json();
      const tData = await tRes.json();
      if (!cRes.ok) {
        setErrorMessage(cData?.error ?? 'フォーム設定の取得に失敗しました');
        return;
      }
      if (!tRes.ok) {
        setErrorMessage(tData?.error ?? 'メール一覧の取得に失敗しました');
        return;
      }
      setConfigs(cData.configs ?? []);
      const raw = tData.templates ?? [];
      setTemplates(
        raw.map((t: { id: string; updated_at: string }) => ({
          id: t.id,
          updated_at: t.updated_at,
        }))
      );
    } catch {
      setErrorMessage('取得中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, [secretKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const patchConfig = async (
    id: string,
    body: Record<string, unknown>
  ): Promise<boolean> => {
    setBusyId(id);
    setErrorMessage('');
    try {
      const res = await fetch(`/api/admin/download-form-configs/${id}`, {
        method: 'PATCH',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error ?? '更新に失敗しました');
        await load();
        return false;
      }
      if (data.config) {
        setConfigs((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...data.config } : c))
        );
      }
      return true;
    } catch {
      setErrorMessage('更新中にエラーが発生しました');
      await load();
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const createConfig = async () => {
    setCreating(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/download-form-configs', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: newSlug.trim().toLowerCase(),
          name: newName.trim(),
          template_id: newTemplateId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error ?? '作成に失敗しました');
        return;
      }
      setNewSlug('');
      setNewName('');
      setNewTemplateId('');
      await load();
    } catch {
      setErrorMessage('作成中にエラーが発生しました');
    } finally {
      setCreating(false);
    }
  };

  const removeConfig = async (row: FormConfigRow) => {
    if (row.slug === 'default') return;
    if (!confirm(`「${row.name}」を削除しますか？`)) return;
    setBusyId(row.id);
    try {
      const res = await fetch(`/api/admin/download-form-configs/${row.id}`, {
        method: 'DELETE',
        headers: auth,
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error ?? '削除に失敗しました');
        return;
      }
      await load();
    } catch {
      setErrorMessage('削除中にエラーが発生しました');
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-slate-500">読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-3xl border border-blue-50/90 bg-sky-50/40 px-4 py-3 text-sm leading-relaxed text-slate-600 shadow-xl shadow-blue-500/[0.04]">
        <Info
          className="h-5 w-5 shrink-0 text-sky-400 mt-0.5"
          aria-hidden
        />
        <p>
          この一覧では、サイト上の「どの申請フォームから送るメールに、どの文面を使うか」をまとめて選べます。行を追加・編集して、フォームごとに送るメールを割り当ててください。
          <span className="block mt-2 text-slate-600">
            まだここで文面を選んでいない場合は、あらかじめ「公開」しておいた標準のメールが送られます。資料ごとに決まった文面があるときは、そちらが優先されます。
          </span>
        </p>
      </div>

      {errorMessage && (
        <p className="text-rose-500 text-sm font-medium">{errorMessage}</p>
      )}

      <div className="rounded-3xl border border-blue-50/90 bg-white/90 p-4 sm:p-5 space-y-4 shadow-xl shadow-blue-500/5">
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-violet-300" aria-hidden />
          <h2 className="font-semibold text-slate-600">フォームを追加</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium text-slate-600 mb-1">
              <Tag className="h-3.5 w-3.5 text-sky-400 shrink-0" aria-hidden />
              ページ用の識別名（英小文字・ハイフン）
            </span>
            <input
              type="text"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="campaign-2025"
              className={`mt-1 w-full border border-blue-100 rounded-2xl px-3 py-2.5 text-sm bg-white/95 text-slate-600 shadow-sm ${ADMIN_FOCUS_RING}`}
            />
          </label>
          <label className="block text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium text-slate-600 mb-1">
              <Type className="h-3.5 w-3.5 text-violet-300 shrink-0" aria-hidden />
              管理画面での表示名
            </span>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="キャンペーンLP用"
              className={`mt-1 w-full border border-blue-100 rounded-2xl px-3 py-2.5 text-sm bg-white/95 text-slate-600 shadow-sm ${ADMIN_FOCUS_RING}`}
            />
          </label>
          <label className="block text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium text-slate-600 mb-1">
              <Mail className="h-3.5 w-3.5 text-rose-300 shrink-0" aria-hidden />
              このフォームで使うメール文面
            </span>
            <select
              value={newTemplateId}
              onChange={(e) => setNewTemplateId(e.target.value)}
              className={`mt-1 w-full border border-blue-100 rounded-2xl px-3 py-2.5 text-sm bg-white/95 text-slate-600 shadow-sm ${ADMIN_FOCUS_RING}`}
            >
              <option value="">おまかせ（標準のメールを使う）</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {templateSelectLabel(t.updated_at)}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => void createConfig()}
              disabled={creating || !newSlug.trim() || !newName.trim()}
              className={`w-full ${ADMIN_BTN_PRIMARY}`}
            >
              <Plus className="h-4 w-4 text-[#2C657A]" aria-hidden />
              {creating ? '作成中…' : '追加する'}
            </button>
          </div>
        </div>
      </div>

      <div className={ADMIN_CARD_TABLE_WRAP}>
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-blue-50/90 bg-sky-50/40">
              <th className="text-left py-3 px-3 font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Type className="h-4 w-4 text-sky-400" aria-hidden />
                  表示名
                </span>
              </th>
              <th className="text-left py-3 px-3 font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-violet-300" aria-hidden />
                  識別名
                </span>
              </th>
              <th className="text-left py-3 px-3 font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-rose-300" aria-hidden />
                  送るメール
                </span>
              </th>
              <th className="text-left py-3 px-3 font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Settings2 className="h-4 w-4 text-violet-300" aria-hidden />
                  操作
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {configs.map((row) => (
              <tr
                key={row.id}
                className="border-b border-blue-50/50 odd:bg-white even:bg-blue-50/20 hover:bg-sky-50/35 transition-colors"
              >
                <td className="py-3 px-3 align-middle">
                  <input
                    type="text"
                    defaultValue={row.name}
                    key={`${row.id}-name-${row.updated_at}`}
                    disabled={busyId === row.id}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v && v !== row.name) void patchConfig(row.id, { name: v });
                    }}
                    className={`w-full min-w-[8rem] border border-blue-100 rounded-2xl px-2 py-2 text-sm bg-white/95 text-slate-600 ${ADMIN_FOCUS_RING}`}
                  />
                </td>
                <td className="py-3 px-3 align-middle">
                  {row.slug === 'default' ? (
                    <span className="inline-flex items-center rounded-xl bg-sky-50/80 px-2 py-1 text-xs font-mono text-slate-600">
                      default
                    </span>
                  ) : (
                    <input
                      type="text"
                      defaultValue={row.slug}
                      key={`${row.id}-slug-${row.updated_at}`}
                      disabled={busyId === row.id}
                      onBlur={(e) => {
                        const v = e.target.value.trim().toLowerCase();
                        if (v && v !== row.slug) void patchConfig(row.id, { slug: v });
                      }}
                      className={`w-full min-w-[6rem] border border-blue-100 rounded-2xl px-2 py-2 text-xs font-mono bg-white/95 text-slate-600 ${ADMIN_FOCUS_RING}`}
                    />
                  )}
                </td>
                <td className="py-3 px-3 align-middle min-w-[12rem]">
                  <select
                    value={row.template_id ?? ''}
                    disabled={busyId === row.id}
                    onChange={(e) => {
                      const v = e.target.value || null;
                      void patchConfig(row.id, { template_id: v });
                    }}
                    className={`w-full border border-blue-100 rounded-2xl px-2 py-2 text-sm bg-white/95 text-slate-600 ${ADMIN_FOCUS_RING}`}
                  >
                    <option value="">おまかせ（標準のメール）</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {templateSelectLabel(t.updated_at)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-3 align-middle whitespace-nowrap">
                  {row.slug !== 'default' && (
                    <button
                      type="button"
                      onClick={() => void removeConfig(row)}
                      disabled={busyId === row.id}
                      className={btnDanger}
                    >
                      <Trash2 className="h-4 w-4 text-rose-300" aria-hidden />
                      削除
                    </button>
                  )}
                  {busyId === row.id && (
                    <span className="ml-2 text-xs text-slate-400">更新中…</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
