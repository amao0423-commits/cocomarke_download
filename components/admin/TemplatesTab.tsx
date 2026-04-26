'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  Layers,
  Mail,
  Megaphone,
  Plus,
  Send,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { DEFAULT_EMAIL_TEMPLATE_SUBJECT } from '@/lib/email-template-defaults';
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_OUTLINE,
} from '@/components/admin/adminPastel';

const btnPrimary = `${ADMIN_BTN_PRIMARY} px-4 py-2.5`;

const btnOutline = `${ADMIN_BTN_OUTLINE} px-3 py-2`;

const btnDanger =
  'text-sm font-medium text-rose-500 transition-colors hover:text-rose-600 hover:underline';

type TemplateRow = {
  id: string;
  subject: string;
  is_published: boolean;
  updated_at: string;
};

type DocumentRow = { id: string; title: string };

type LinkRow = { document_id: string; label: string };

function StepBlock({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-blue-50/90 bg-white/95 p-4 space-y-3 shadow-xl shadow-blue-500/5">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#A0D8EF] text-xs font-bold text-[#2C657A]">
          {step}
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-slate-600">{title}</h3>
          <p className="text-xs leading-5 text-slate-600">{description}</p>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function TemplatesTab({ secretKey }: { secretKey: string }) {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [subject, setSubject] = useState(DEFAULT_EMAIL_TEMPLATE_SUBJECT);
  const [useDefaultBody, setUseDefaultBody] = useState(true);
  const [bodyHtml, setBodyHtml] = useState('');
  const [publish, setPublish] = useState(false);
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [busy, setBusy] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editPublish, setEditPublish] = useState(false);
  const [editLinks, setEditLinks] = useState<LinkRow[]>([]);
  const [testEmailTo, setTestEmailTo] = useState('');
  const [testSampleName, setTestSampleName] = useState('テスト 太郎');
  const [testBusy, setTestBusy] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  const auth = { Authorization: `Bearer ${secretKey}` };
  const hasDocuments = documents.length > 0;

  const load = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [tRes, dRes, defRes] = await Promise.all([
        fetch('/api/admin/email-templates', { headers: auth }),
        fetch('/api/admin/documents', { headers: auth }),
        fetch('/api/admin/site-settings/default-email-body', { headers: auth }),
      ]);
      const tData = await tRes.json();
      const dData = await dRes.json();
      if (!tRes.ok) {
        setErrorMessage(tData?.error ?? 'テンプレート取得に失敗しました');
        return;
      }
      if (!dRes.ok) {
        setErrorMessage(dData?.error ?? '資料一覧の取得に失敗しました');
        return;
      }
      setTemplates(tData.templates ?? []);
      setDocuments(dData.documents ?? []);
      if (defRes.ok) {
        const def = await defRes.json();
        if (typeof def.subject === 'string' && def.subject.trim()) {
          setSubject(def.subject.trim());
        }
      }
    } catch {
      setErrorMessage('取得中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, [secretKey]);

  useEffect(() => {
    load();
  }, [load]);

  const addLinkRow = () => {
    const first = documents[0]?.id ?? '';
    setLinks((prev) => [...prev, { document_id: first, label: '資料をダウンロード' }]);
  };

  const createTemplate = async () => {
    setBusy(true);
    setErrorMessage('');
    try {
      const body = useDefaultBody ? '__DEFAULT__' : bodyHtml;
      if (!useDefaultBody && !body.trim()) {
        setErrorMessage('本文を入力するか、既定HTMLを使うにチェックしてください');
        setBusy(false);
        return;
      }
      const res = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          body_html: body,
          is_published: publish,
          links: links.filter((l) => l.document_id && l.label.trim()),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error ?? '作成に失敗しました');
        return;
      }
      setUseDefaultBody(true);
      setBodyHtml('');
      setPublish(false);
      setLinks([]);
      await load();
    } catch {
      setErrorMessage('作成中にエラーが発生しました');
    } finally {
      setBusy(false);
    }
  };

  const startEdit = async (id: string) => {
    setErrorMessage('');
    const res = await fetch(`/api/admin/email-templates/${id}`, { headers: auth });
    const data = await res.json();
    if (!res.ok) {
      setErrorMessage(data?.error ?? '読み込みに失敗しました');
      return;
    }
    setEditingId(id);
    setEditSubject(data.template.subject);
    setEditBody(data.template.body_html);
    setEditPublish(data.template.is_published);
    setEditLinks(
      (data.links as { document_id: string; label: string }[]).map((l) => ({
        document_id: l.document_id,
        label: l.label,
      }))
    );
    setTestMessage('');
  };

  const sendTestEmail = async () => {
    if (!editingId) return;
    setTestBusy(true);
    setTestMessage('');
    setErrorMessage('');
    try {
      const res = await fetch(`/api/admin/email-templates/${editingId}/test-send`, {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmailTo.trim(),
          sampleName: testSampleName.trim() || 'テスト 太郎',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error ?? 'テスト送信に失敗しました');
        return;
      }
      setTestMessage('送信しました。受信トレイを確認してください。');
    } catch {
      setErrorMessage('テスト送信中にエラーが発生しました');
    } finally {
      setTestBusy(false);
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setBusy(true);
    setErrorMessage('');
    try {
      const res = await fetch(`/api/admin/email-templates/${editingId}`, {
        method: 'PATCH',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: editSubject.trim(),
          body_html: editBody,
          is_published: editPublish,
          links: editLinks.filter((l) => l.document_id && l.label.trim()),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error ?? '更新に失敗しました');
        return;
      }
      setEditingId(null);
      await load();
    } catch {
      setErrorMessage('更新中にエラーが発生しました');
    } finally {
      setBusy(false);
    }
  };

  const removeTemplate = async (id: string) => {
    if (!confirm('このテンプレートを削除しますか？')) return;
    const res = await fetch(`/api/admin/email-templates/${id}`, {
      method: 'DELETE',
      headers: auth,
    });
    if (res.ok) {
      if (editingId === id) setEditingId(null);
      await load();
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-gray-500">読み込み中...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Megaphone className="h-6 w-6 text-sky-400 shrink-0" aria-hidden />
        <h2 className="text-lg font-semibold text-slate-600">メールを新規作成</h2>
      </div>
      {errorMessage && <p className="text-rose-500 text-sm font-medium">{errorMessage}</p>}

      <div className="rounded-3xl border border-blue-50/90 bg-white p-4 sm:p-5 space-y-4 shadow-xl shadow-blue-500/5">
        <p className="text-sm leading-relaxed text-slate-600 flex gap-2">
          <Sparkles className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" aria-hidden />
          上から順に進めると、申請後に送るメールの文面が完成します。
        </p>
        <StepBlock
          step={1}
          title="メールの題名を決める"
          description="受け取る人が最初に見る件名です。最初の一行は「📝 メールの下書き」で保存した題名が入ります。"
        >
          <label className="block">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <Mail className="h-3.5 w-3.5 text-rose-300" aria-hidden />
              件名
            </span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200/80"
            />
          </label>
        </StepBlock>
        <StepBlock
          step={2}
          title="本文を決める"
          description="通常は下書きの本文を使えば大丈夫です。必要なときだけ、自分でHTMLを書き換えられます。"
        >
          <label className="flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={useDefaultBody}
              onChange={(e) => setUseDefaultBody(e.target.checked)}
              className="rounded border-slate-300"
            />
            用意済みの本文を使う
          </label>
          <p className="text-xs leading-5 text-slate-500 flex gap-1.5">
            <BookOpen className="h-3.5 w-3.5 shrink-0 mt-0.5 text-violet-300" aria-hidden />
            下書きの編集は「📝 メールの下書き」で行えます。お名前の差し込みや、下のステップの資料ボタンは自動で入ります。
          </p>
          {!useDefaultBody && (
            <label className="block">
              <span className="flex items-center gap-1.5 text-xs text-slate-600">
                <FileText className="h-3.5 w-3.5 text-sky-400" aria-hidden />
                本文（HTML）— {'{{name}}'} ・ {'{{documentButtons}}'} ・ {'{{emailLogoUrl}}'}{' '}
                などが使えます
              </span>
              <textarea
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                rows={8}
                className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200/80"
              />
            </label>
          )}
        </StepBlock>
        <StepBlock
          step={3}
          title="メール内の資料ボタンを決める"
          description="ここで選んだ資料は、メールの中のボタンだけでなく、どの文面を送るか決めるときの目印にもなります。"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-violet-300" aria-hidden />
                追加済みの資料ボタン: {links.length}件
              </p>
              <p className="text-xs text-slate-500 mt-1">
                資料を選んでから、ボタンに表示する文字を入れてください。1資料につき1つずつ割り当てると分かりやすいです。
              </p>
            </div>
            <button
              type="button"
              onClick={addLinkRow}
              disabled={!hasDocuments}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-500/90 hover:text-sky-600 hover:underline disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              資料ボタンを追加
            </button>
          </div>
          {!hasDocuments && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
              まだ資料がありません。先に「📚 資料管理」でPDFを登録すると、ここで選べます。
            </div>
          )}
          {hasDocuments && links.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 px-3 py-3 text-xs leading-5 text-gray-600">
              右上の「資料ボタンを追加」を押すと、メール内に出すボタンを作れます。
            </div>
          )}
          <div className="space-y-3">
            {links.map((l, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-3 space-y-2">
                <p className="text-xs font-semibold text-gray-700">資料ボタン {i + 1}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <label className="flex-1 min-w-[12rem] text-xs text-gray-500">
                    資料を選ぶ
                    <select
                      value={l.document_id}
                      onChange={(e) => {
                        const v = e.target.value;
                        setLinks((prev) =>
                          prev.map((x, j) => (j === i ? { ...x, document_id: v } : x))
                        );
                      }}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
                    >
                      {documents.map((d) => (
                        <option key={d.id} value={d.id}>{d.title}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex-1 min-w-[12rem] text-xs text-gray-500">
                    ボタンに表示する文字
                    <input
                      type="text"
                      value={l.label}
                      onChange={(e) => {
                        const v = e.target.value;
                        setLinks((prev) =>
                          prev.map((x, j) => (j === i ? { ...x, label: v } : x))
                        );
                      }}
                      placeholder="例: PDFを開く"
                      className="mt-1 w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setLinks((prev) => prev.filter((_, j) => j !== i))}
                    className={`inline-flex items-center gap-1 text-xs self-end ${btnDanger}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </StepBlock>
        <StepBlock
          step={4}
          title="公開設定を決めて保存する"
          description="すぐ使う文面は公開にしてください。複数まとめて公開できます。送信時はフォームや資料との対応から、適切な文面が選ばれます。"
        >
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
            />
            このテンプレートを公開する
          </label>
        </StepBlock>
        <button
          type="button"
          onClick={() => void createTemplate()}
          disabled={busy || !subject.trim()}
          className={btnPrimary}
        >
          <Send className="h-4 w-4" aria-hidden />
          {busy ? '保存中…' : 'この内容でメール文面を追加'}
        </button>
      </div>

      <div>
        <h2 className="font-semibold text-slate-600 mb-3 flex items-center gap-2">
          <Mail className="h-5 w-5 text-rose-300" aria-hidden />
          作成済みのメール文面
        </h2>
        {templates.length === 0 ? (
          <p className="text-slate-500 text-sm">まだありません。上のフォームから追加してください。</p>
        ) : (
          <ul className="divide-y divide-blue-50/80 border border-blue-50/90 rounded-3xl bg-white shadow-xl shadow-blue-500/5 overflow-hidden">
            {templates.map((t) => (
              <li key={t.id} className="p-4 flex flex-wrap items-center justify-between gap-2 hover:bg-slate-50/80 transition-colors">
                <div>
                  <p className="font-medium text-slate-600">{t.subject}</p>
                  <p className="text-xs text-slate-500">
                    {t.is_published ? '公開中' : '下書き'} ·{' '}
                    {new Date(t.updated_at).toLocaleString('ja-JP')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => void startEdit(t.id)}
                    className={btnOutline}
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={() => void removeTemplate(t.id)}
                    className={`text-sm px-3 py-2 rounded-xl border border-rose-100 bg-rose-50/50 text-rose-600 font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-50`}
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-500/25 backdrop-blur-[2px]">
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-500/10 border border-blue-50/90 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-3">
            <h3 className="font-semibold text-slate-600 flex items-center gap-2">
              <Mail className="h-5 w-5 text-rose-300" aria-hidden />
              メール文面を編集
            </h3>
            <p className="text-xs leading-5 text-gray-600">
              1. 本文を確認 2. 資料ボタンを確認 3. 保存 4. テスト送信、の順で進めるとスムーズです。
            </p>
            <label className="block">
              <span className="text-xs text-gray-500">件名</span>
              <input
                type="text"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">
                本文HTML（{'{{name}}'}・{'{{documentButtons}}'}・{'{{emailLogoUrl}}'}）
              </span>
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={10}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editPublish}
                onChange={(e) => setEditPublish(e.target.checked)}
              />
              公開する
            </label>
            <div>
              <div className="flex justify-between mb-1">
                <div>
                  <span className="text-xs text-gray-500">資料リンク</span>
                  <p className="text-xs text-gray-500">メール内に表示するボタンをここで増やせます。</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditLinks((prev) => [
                      ...prev,
                      { document_id: documents[0]?.id ?? '', label: '資料をダウンロード' },
                    ])
                  }
                  className="text-xs text-slate-700"
                  disabled={documents.length === 0}
                >
                  行を追加
                </button>
              </div>
              {!hasDocuments && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
                  まだ資料が登録されていないため、ここでは追加できません。先に資料を登録してください。
                </div>
              )}
              {hasDocuments && editLinks.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 px-3 py-3 text-xs leading-5 text-gray-600">
                  「行を追加」を押すと、メール内の資料ボタンを追加できます。
                </div>
              )}
              <div className="space-y-2">
                {editLinks.map((l, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-700">資料ボタン {i + 1}</p>
                    <div className="flex flex-wrap gap-2">
                      <label className="flex-1 min-w-[12rem] text-xs text-gray-500">
                        資料を選ぶ
                        <select
                          value={l.document_id}
                          onChange={(e) => {
                            const v = e.target.value;
                            setEditLinks((prev) =>
                              prev.map((x, j) => (j === i ? { ...x, document_id: v } : x))
                            );
                          }}
                          className="mt-1 w-full border rounded-lg px-2 py-2 text-sm"
                        >
                          {documents.map((d) => (
                            <option key={d.id} value={d.id}>{d.title}</option>
                          ))}
                        </select>
                      </label>
                      <label className="flex-1 min-w-[12rem] text-xs text-gray-500">
                        ボタンに表示する文字
                        <input
                          type="text"
                          value={l.label}
                          onChange={(e) => {
                            const v = e.target.value;
                            setEditLinks((prev) =>
                              prev.map((x, j) => (j === i ? { ...x, label: v } : x))
                            );
                          }}
                          className="mt-1 w-full border rounded-lg px-2 py-2 text-sm flex-1"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditLinks((prev) => prev.filter((_, j) => j !== i))}
                      className={`inline-flex items-center gap-1 text-xs ${btnDanger}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      削除
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-2 space-y-2">
              <p className="text-xs font-semibold text-gray-800">テストメール</p>
              <p className="text-xs text-gray-500">
                実際の資料ダウンロード用URL（署名付き）が入ります。保存前の編集内容は、先に「保存」すると反映されます。
              </p>
              <div className="flex flex-wrap gap-2 items-end">
                <label className="flex-1 min-w-[10rem] text-xs text-gray-500">
                  送信先
                  <input
                    type="email"
                    value={testEmailTo}
                    onChange={(e) => setTestEmailTo(e.target.value)}
                    placeholder="your@example.com"
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex-1 min-w-[8rem] text-xs text-gray-500">
                  {'{{name}}'} 用（任意）
                  <input
                    type="text"
                    value={testSampleName}
                    onChange={(e) => setTestSampleName(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => void sendTestEmail()}
                disabled={testBusy || !testEmailTo.trim()}
                className={`${btnOutline} border-sky-200/60 text-sky-600`}
              >
                <Send className="h-4 w-4" aria-hidden />
                {testBusy ? '送信中…' : 'テストメールを送る'}
              </button>
              {testMessage && (
                <p className="text-xs text-green-700">{testMessage}</p>
              )}
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className={btnOutline}
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => void saveEdit()}
                disabled={busy}
                className={btnPrimary}
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
