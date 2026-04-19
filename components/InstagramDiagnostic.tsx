'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  LayoutGrid,
  Heart,
  MessageCircle,
  Clock,
  Lock,
  Check,
  X,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import TotalAnalysisCounter from '@/components/TotalAnalysisCounter';

type HashtagItem = { hashtag: string; count: number };

type GrowthCoreCustomer = {
  is_callable?: boolean;
  message?: string;
};

type AnalyzeResult = {
  username?: string;
  full_name?: string;
  biography?: string;
  profile_image_url?: string;
  follower_count?: number;
  follow_count?: number;
  post_count?: number;
  average_like_count?: number;
  average_comment_count?: number;
  average_post_hour?: number;
  follower_grade?: string;
  post_count_grade?: string;
  activity_grade?: string;
  total_grade?: string;
  post_type?: string;
  photo_rate?: number;
  reels_rate?: number;
  carousel_rate?: number;
  recent_hashtag_list?: HashtagItem[];
  recommend_service_message?: string[];
  feedback_message?: string[];
  improvement_message?: string[];
  growthcore_customer?: GrowthCoreCustomer;
  posts_per_day?: Record<string, number> | Array<{ date: string; count: number }>;
  most_popular_post_time?: Record<string, number> | Array<{ day_of_week?: string; day?: string; count: number }>;
};

type DayCount = { date: string; count: number };
type WeekdayCount = { day: string; count: number };

const WEEKDAY_ORDER = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const WEEKDAY_LABELS_JA: Record<string, string> = {
  Sun: '日', Mon: '月', Tue: '火', Wed: '水', Thu: '木', Fri: '金', Sat: '土',
};

function normalizePostsPerDay(raw: AnalyzeResult['posts_per_day']): DayCount[] {
  if (!raw) return [];
  const toStr = (v: unknown): string => (v != null && String(v).trim() !== '' ? String(v).trim() : '');
  if (Array.isArray(raw)) {
    return raw
      .map((x) => ({ date: toStr(x.date), count: Number(x.count) }))
      .filter((x) => x.date !== '' && !Number.isNaN(x.count))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
  return Object.entries(raw)
    .map(([date, count]) => ({ date: toStr(date), count: Number(count) }))
    .filter((x) => x.date !== '' && !Number.isNaN(x.count))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function normalizeMostPopularPostTime(raw: AnalyzeResult['most_popular_post_time']): WeekdayCount[] {
  if (!raw) return [];
  let entries: [string, number][];
  if (Array.isArray(raw)) {
    entries = raw
      .map((x: { day_of_week?: string; day?: string; count: number }) => [
        (x.day_of_week ?? x.day ?? '').toString(),
        Number(x.count),
      ] as [string, number])
      .filter(([d]) => d) as [string, number][];
  } else {
    entries = Object.entries(raw)
      .map(([k, v]) => [k, Number(v)] as [string, number])
      .filter(([, v]) => !Number.isNaN(v)) as [string, number][];
  }
  const byDay = new Map(entries.map(([d, c]) => [d, c]));
  return WEEKDAY_ORDER.map((day) => ({
    day: WEEKDAY_LABELS_JA[day] ?? day,
    count: byDay.get(day) ?? byDay.get(day.slice(0, 2)) ?? 0,
  }));
}

function normalizeInstagramId(value: string): string {
  return value
    .trim()
    .replace(/^@/, '')
    .replace(/:\d+$/, ''); // 本番で付与されうる ":1" 等を除去（Instagram ID にコロンは含まれない）
}

/** 表示用：韓国語のエラーメッセージを日本語に変換（API経由で届いた場合のフォールバック） */
function toDisplayError(message: string): string {
  const t = message.trim();
  if (t === '잠시후 다시 시도해주세요' || t === '잠시 후 다시 시도해 주세요' || t === '잠시 후 다시 시도해주세요') {
    return '入力したユーザー名に誤りがあるか、しばらく経ってから再度お試しください。';
  }
  if (/[\uAC00-\uD7A3]/.test(message)) {
    return '分析結果を取得できませんでした。IDを確認するか、しばらく経ってから再度お試しください。';
  }
  return message;
}

/** APIの評価を S/A/B/C/D の英字に統一する（投稿数・活動性・フォロワー・総合） */
function normalizeGradeToLetter(raw: string | undefined): string {
  if (raw == null || String(raw).trim() === '') return '—';
  const s = String(raw).trim();
  const u = s.toUpperCase();
  if (u === 'S' || u === 'A' || u === 'B' || u === 'C' || u === 'D') return u;
  if (s === '不足' || s === '低' || s === '悪' || u === 'LOW' || u === 'POOR') return 'D';
  if (s === '良好' || s === '高' || u === 'HIGH' || u === 'GOOD') return 'A';
  return 'B';
}

const DIAGNOSIS_STEPS = [
  'アカウントデータの読み込み中...',
  'エンゲージメント率の精密計算中...',
  'アルゴリズムに基づいた改善案を生成中...',
] as const;

const PROGRESS_DURATION_MS = 3000;
const TRANSITION_DURATION_MS = 0;

const METRIC_ICONS = {
  follower: Users,
  follow: UserPlus,
  posts: LayoutGrid,
  likes: Heart,
  comments: MessageCircle,
} as const;

export default function InstagramDiagnostic({
  variant = 'page',
  onRequestClose,
}: {
  variant?: 'page' | 'overlay';
  onRequestClose?: () => void;
} = {}) {
  const [instagramId, setInstagramId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisProgress, setDiagnosisProgress] = useState(0);
  const [isTransitioningToResult, setIsTransitioningToResult] = useState(false);
  const [pendingResult, setPendingResult] = useState<AnalyzeResult | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const analysisStartTimeRef = useRef<number>(0);
  const apiCompletedRef = useRef<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);
  const resultContainerRef = useRef<HTMLDivElement>(null);
  const refParamRef = useRef<string | null>(null);
  const [resultFitScale, setResultFitScale] = useState(1);

  const searchParams = useSearchParams();
  useEffect(() => {
    const refVal = searchParams.get('ref')?.trim();
    if (refVal) {
      refParamRef.current = refVal;
      try {
        sessionStorage.setItem('hp_ref', refVal);
      } catch {
        /* ignore */
      }
    }
  }, [searchParams]);

  const canSubmit = normalizeInstagramId(instagramId).length > 0;

  useEffect(() => {
    if (variant !== 'overlay') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onRequestClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [variant, onRequestClose]);

  useEffect(() => {
    if (!isAnalyzing || isTransitioningToResult) return;
    apiCompletedRef.current = false;
    analysisStartTimeRef.current = Date.now();
    
    const interval = setInterval(() => {
      try {
        if (apiCompletedRef.current) return;
        const elapsed = Date.now() - analysisStartTimeRef.current;
        const t = Math.min(1, elapsed / PROGRESS_DURATION_MS);
        const easeOut = 1 - (1 - t) * (1 - t);
        const progress = Math.min(100, easeOut * 100);
        setDiagnosisProgress(progress);
        if (progress >= 100) clearInterval(interval);
      } catch (error) {
        console.error('Progress update error:', error);
        clearInterval(interval);
      }
    }, 50);
    
    return () => {
      clearInterval(interval);
    };
  }, [isAnalyzing, isTransitioningToResult]);

  useEffect(() => {
    if (diagnosisProgress < 100 || !pendingResult || !isAnalyzing || isTransitioningToResult) return;
    
    setIsTransitioningToResult(true);
    
    const t = setTimeout(() => {
      try {
        setResult(pendingResult);
        setPendingResult(null);
        setIsAnalyzing(false);
        setDiagnosisProgress(0);
      } catch (error) {
        console.error('Transition error:', error);
      } finally {
        // 必ず遷移フラグをリセット
        setIsTransitioningToResult(false);
      }
    }, TRANSITION_DURATION_MS);
    
    return () => {
      clearTimeout(t);
    };
  }, [diagnosisProgress, pendingResult, isAnalyzing]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (isAnalyzing) return;
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const id = normalizeInstagramId(instagramId);
    
    try {
      setErrorMessage(null);
      setIsAnalyzing(true);
      setResult(null);
      setDiagnosisProgress(0);
      setPendingResult(null);
      setIsTransitioningToResult(false);

      const refValue =
        refParamRef.current ??
        (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('hp_ref') : null);
      if (refValue && process.env.NEXT_PUBLIC_HP_API_BASE?.trim()) {
        fetch('/api/hp/set-instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ref: refValue, instagram_id: id }),
        }).catch((err) => {
          console.error('HP set-instagram request failed', err);
        });
      }

      const response = await fetch(
        `/api/analyze?id=${encodeURIComponent(id)}`,
        { method: 'GET' }
      );
      const data = await response.json();

      if (!response.ok) {
        // IP制限エラーの場合、詳細情報を含めて表示
        if (response.status === 429) {
          let message = data?.error ?? 'アクセス制限がかかっています';
          if (data?.remainingMinutes) {
            message += `（あと${data.remainingMinutes}分お待ちください）`;
          } else if (data?.blockedUntil) {
            const blockedDate = new Date(data.blockedUntil);
            const now = new Date();
            const diffMinutes = Math.ceil((blockedDate.getTime() - now.getTime()) / (60 * 1000));
            if (diffMinutes > 0) {
              message += `（あと約${diffMinutes}分お待ちください）`;
            }
          }
          setErrorMessage(message);
        } else {
          setErrorMessage(data?.error ?? '分析に失敗しました');
        }
        return;
      }

      const payload = data as Record<string, unknown>;
      const hasResult =
        payload &&
        typeof payload === 'object' &&
        ((payload.username ?? payload.userName) != null ||
          (payload.full_name ?? payload.fullName) != null ||
          (payload.follower_count ?? payload.followerCount) != null ||
          (payload.post_count ?? payload.postCount) != null);
      if (!hasResult) {
        setErrorMessage('分析結果を取得できませんでした。IDを確認するか、しばらく経ってから再度お試しください。');
        return;
      }

      apiCompletedRef.current = true;
      setPendingResult(data as AnalyzeResult);
      setDiagnosisProgress(100);
    } catch (error) {
      console.error('Analysis error:', error);
      setErrorMessage('分析中にエラーが発生しました。もう一度お試しください。');
    } finally {
      isSubmittingRef.current = false;
      // エラー時は分析状態を確実にリセット
      if (!apiCompletedRef.current) {
        setIsAnalyzing(false);
        setIsTransitioningToResult(false);
      }
    }
  };

  const handleReset = () => {
    try {
      isSubmittingRef.current = false;
      setInstagramId('');
      setResult(null);
      setErrorMessage(null);
      setIsAnalyzing(false);
      setDiagnosisProgress(0);
      setPendingResult(null);
      setIsTransitioningToResult(false);
      apiCompletedRef.current = false;
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  const handleCloseResult = () => {
    setResult(null);
    if (variant === 'overlay') onRequestClose?.();
  };

  useEffect(() => {
    if (!result) {
      setResultFitScale(1);
      return;
    }
    const el = resultContainerRef.current;
    const updateScale = () => {
      if (!el) return;
      const contentHeight = el.offsetHeight;
      const vh = window.innerHeight;
      const padding = 40;
      const s = contentHeight <= 0 ? 1 : Math.min(1, (vh - padding) / contentHeight);
      setResultFitScale(s);
    };
    const raf = requestAnimationFrame(() => updateScale());
    window.addEventListener('resize', updateScale);
    const ro =
      typeof ResizeObserver !== 'undefined' && el
        ? new ResizeObserver(updateScale)
        : null;
    if (ro && el) ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateScale);
      if (ro && el) ro.unobserve(el);
    };
  }, [result]);

  // レンダリング条件: 優先順位順に評価
  // 1. 結果が存在する場合 → 結果画面
  if (result && !isAnalyzing) {
    const customer = result.growthcore_customer;
    const postsPerDaySeries = normalizePostsPerDay(result.posts_per_day);
    const weekdaySeries = normalizeMostPopularPostTime(result.most_popular_post_time);
    const hasStatsData = postsPerDaySeries.length > 0 || weekdaySeries.some((x) => x.count > 0);
    const dailyAvg = postsPerDaySeries.length
      ? postsPerDaySeries.reduce((s, x) => s + x.count, 0) / postsPerDaySeries.length
      : 0;
    const last7 = postsPerDaySeries.slice(-7).reduce((s, x) => s + x.count, 0);
    const last30 = postsPerDaySeries.slice(-30).reduce((s, x) => s + x.count, 0);
    const sparklineData = postsPerDaySeries.slice(-14).map((x) => ({ ...x, name: x.date.slice(5) }));

    type MetricCard = { name: string; display: string; icon: 'follower' | 'follow' | 'posts' | 'likes' | 'comments' };
    const metricsCards: MetricCard[] = [];
    if (result.follower_count != null) metricsCards.push({ name: 'フォロワー', display: result.follower_count.toLocaleString(), icon: 'follower' });
    if (result.follow_count != null) metricsCards.push({ name: 'フォロー', display: result.follow_count.toLocaleString(), icon: 'follow' });
    if (result.post_count != null) metricsCards.push({ name: '投稿数', display: result.post_count.toLocaleString(), icon: 'posts' });
    if (result.average_like_count != null) metricsCards.push({ name: '平均いいね', display: result.average_like_count.toLocaleString(), icon: 'likes' });
    if (result.average_comment_count != null) metricsCards.push({ name: '平均コメント', display: result.average_comment_count.toLocaleString(), icon: 'comments' });

    const gradeItems: { label: string; grade: string }[] = [
      { label: 'フォロワー', grade: normalizeGradeToLetter(result.follower_grade) },
      { label: '投稿数', grade: normalizeGradeToLetter(result.post_count_grade) },
      { label: '活動性', grade: normalizeGradeToLetter(result.activity_grade) },
      { label: '総合', grade: normalizeGradeToLetter(result.total_grade) },
    ];
    const hasGrades = gradeItems.some((g) => g.grade !== '—');

    const contentPieRows: { name: string; value: number }[] = [];
    if ((result.photo_rate ?? 0) > 0) contentPieRows.push({ name: '写真', value: result.photo_rate! });
    if ((result.reels_rate ?? 0) > 0) contentPieRows.push({ name: 'リール', value: result.reels_rate! });
    if ((result.carousel_rate ?? 0) > 0) contentPieRows.push({ name: 'カルーセル', value: result.carousel_rate! });
    const contentPieData = contentPieRows;

    return (
      <div
        className={`fixed inset-0 w-full h-full flex items-center justify-center p-4 z-50 overflow-hidden ${variant === 'overlay' ? 'bg-black/50 backdrop-blur-sm' : 'bg-gray-50/90'}`}
        onClick={(e) => { if (variant === 'overlay' && e.target === e.currentTarget) handleCloseResult(); }}
        data-debug-state="result"
      >
        <div
          ref={resultContainerRef}
          className="w-full max-w-[800px] flex-shrink-0 transition-transform duration-200"
          style={{
            transform: `scale(${resultFitScale})`,
            transformOrigin: 'center center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
          <div className={`rounded-xl border border-gray-200 shadow-sm p-6 md:p-6 relative md:flex md:flex-col pb-8 md:pb-8 ${variant === 'overlay' ? 'bg-design-accent-lavender-soft' : 'bg-white'}`}>
            <button
              type="button"
              onClick={handleCloseResult}
              className="absolute top-3 right-3 z-10 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
              aria-label="診断結果を閉じる"
            >
              <X className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>
            <svg aria-hidden="true" className="absolute w-0 h-0" style={{ position: 'absolute', width: 0, height: 0 }}>
              <defs>
                <linearGradient id="instagram-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#404040" />
                  <stop offset="50%" stopColor="#737373" />
                  <stop offset="100%" stopColor="#a3a3a3" />
                </linearGradient>
              </defs>
            </svg>
            {/* 診断結果タイトル（中央） */}
            <div className="w-full text-center mb-8">
              <h2 className="font-bold bg-[linear-gradient(to_top_right,#171717,#404040,#737373,#525252)] bg-clip-text text-transparent">
                診断結果
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                ※アカウントの公開設定や投稿の設定により、一部の数値が正確に反映されない場合があります。
              </p>
            </div>

            {/* 1行目（PC）: 左＝プロフィール紹介、右＝診断結果評価 */}
<div className="md:grid md:grid-cols-[55%_1fr] md:gap-6 md:items-stretch mb-6">
            {/* 左: プロフィール紹介 */}
              <div className="flex flex-col flex-shrink-0 md:min-w-0">
                <div className="flex flex-col sm:flex-row gap-4 md:items-center">
                  {result.profile_image_url && (
                    <img
                      src={result.profile_image_url}
                      alt=""
                      className="w-20 h-20 rounded-full object-cover flex-shrink-0 md:w-12 md:h-12"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    {result.full_name && (
                      <p className="text-lg font-semibold text-gray-900 md:text-base">{result.full_name}</p>
                    )}
                    {result.username && (
                      <p className="text-accent font-medium text-sm">@{result.username}</p>
                    )}
                    {result.biography && (
                      <p className="text-gray-600 mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                        {result.biography}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* 右: 診断結果評価 */}
              <div className="md:flex md:flex-col md:items-start md:min-w-0 w-full">
                {hasGrades && (
                  <div className="mb-6 md:mb-0 md:flex-1 md:flex md:flex-col md:min-h-0 w-full text-left">
                    <h4 className="font-semibold text-gray-900 mb-3 md:mb-1 text-left">評価</h4>
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 md:p-4 md:flex-1 md:min-h-0 text-left">
                      <div className="grid grid-cols-2 gap-3">
                        {gradeItems.map(({ label, grade }) => {
                          const g = grade;
                          const dotClass =
                            g === 'S' || g === 'A'
                              ? 'bg-[#059669]'
                              : g === 'B'
                                ? 'bg-[#525252]'
                                : g === 'C'
                                  ? 'bg-[#D97706]'
                                  : g === 'D'
                                    ? 'bg-[#DC2626]'
                                    : 'bg-gray-400';
                          const tagClass =
                            g === 'S' || g === 'A'
                              ? 'bg-[#D1FAE5] text-[#059669] border border-[#059669]/30'
                              : g === 'B'
                                ? 'bg-slate-100 text-slate-800 border border-slate-400/50'
                                : g === 'C'
                                  ? 'bg-[#FFEDD5] text-[#D97706] border border-[#D97706]/30'
                                  : g === 'D'
                                    ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/30'
                                    : 'bg-gray-100 text-gray-500 border border-gray-300';
                          return (
                            <div key={label} className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gray-50/50">
                              <span className="text-sm text-gray-600">{label}</span>
                              <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full flex-shrink-0 ${dotClass}`} aria-hidden />
                                <span className={`rounded-md px-2 py-0.5 text-sm font-medium border ${tagClass}`}>
                                  {g}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2行目（PC）: 左＝主要数値・投稿統計、右＝コンテンツ構成 */}
            <div className="md:grid md:grid-cols-[55%_1fr] md:gap-6 md:items-stretch mb-8">
              {/* 左カラム: 主要数値・投稿統計・グラフ */}
              <div className="md:flex md:flex-col md:gap-4 md:items-start">
            {/* 主要数値（アイコン付きカード） */}
            {(metricsCards.length > 0 || result.average_post_hour != null) && (
              <div className="mb-6 md:mb-0">
                <h4 className="font-semibold text-gray-900 mb-3 md:mb-1">主要数値</h4>
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {metricsCards.map((m) => {
                    const Icon = METRIC_ICONS[m.icon];
                    return (
                      <div
                        key={m.name}
                        className="min-w-0 w-full md:w-auto bg-white rounded-lg border border-[#E5E7EB] shadow-sm p-3 md:p-4 flex flex-col items-center text-center"
                      >
                        <Icon className="w-5 h-5 mb-1.5" stroke="#1a1a1a" strokeWidth={1.5} />
                        <p className="text-xl md:text-2xl font-semibold text-[#111827]">{m.display}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{m.name}</p>
                      </div>
                    );
                  })}
                  {result.average_post_hour != null && (
                    <div className="min-w-0 w-full md:w-auto bg-white rounded-lg border border-[#E5E7EB] shadow-sm p-3 md:p-4 flex flex-col items-center justify-center text-center">
                      <Clock className="w-5 h-5 mb-1.5" stroke="#1a1a1a" strokeWidth={1.5} />
                      <p className="text-lg md:text-xl font-semibold text-[#111827]">
                        {Math.floor(result.average_post_hour / 24)}日 {(result.average_post_hour % 24).toFixed(1)}時間
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">投稿間隔</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 投稿統計・グラフ */}
            {hasStatsData && (
              <div className="mb-6 md:mb-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-2">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 md:p-4">
                    <p className="text-xs text-gray-500 mb-1">1日あたりの投稿数</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {postsPerDaySeries.length ? dailyAvg.toFixed(1) : '—'}
                    </p>
                    {sparklineData.length > 0 && (
                      <div className="h-12 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sparklineData}>
                            <Line type="monotone" dataKey="count" stroke="#1a1a1a" strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 md:p-4">
                    <p className="text-xs text-gray-500 mb-1">週間の投稿数</p>
                    <p className="text-xl font-semibold text-gray-900">{postsPerDaySeries.length ? last7 : '—'}</p>
                    {sparklineData.length > 0 && (
                      <div className="h-12 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sparklineData}>
                            <Line type="monotone" dataKey="count" stroke="#9CA3AF" strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 md:p-4">
                    <p className="text-xs text-gray-500 mb-1">月間の投稿数</p>
                    <p className="text-xl font-semibold text-gray-900">{postsPerDaySeries.length ? last30 : '—'}</p>
                    {sparklineData.length > 0 && (
                      <div className="h-12 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sparklineData}>
                            <Line type="monotone" dataKey="count" stroke="#D1D5DB" strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-2">
                  {postsPerDaySeries.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 md:p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 md:mb-1">投稿量（Amount of Posts）</h4>
                      <div className="h-48 md:h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={postsPerDaySeries.map((x) => ({ ...x, name: x.date.slice(5) }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="count" stroke="#1a1a1a" fill="#1a1a1a" fillOpacity={0.12} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 md:p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 md:mb-1">人気の投稿時間（曜日別）</h4>
                    {weekdaySeries.some((x) => x.count > 0) ? (
                      <div className="h-48 md:h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={weekdaySeries} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-48 md:h-32 flex items-center justify-center text-gray-500 text-sm">
                        データがありません
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

              </div>
              {/* 右カラム: コンテンツ構成 */}
              <div className="w-full md:min-w-0 flex flex-col md:items-start">
                {contentPieData.length > 0 && (() => {
                  const contentPieColor = (name: string) =>
                    name === 'カルーセル' ? '#262626' : name === '写真' ? '#737373' : '#a3a3a3';
                  const total = contentPieData.reduce((s, x) => s + x.value, 0) || 1;
                  return (
                    <div className="mb-6 md:mb-0 md:flex-1 md:flex md:flex-col md:min-h-0 w-full text-left">
                      <h4 className="font-semibold text-gray-900 mb-3 md:mb-1 text-left">コンテンツ構成</h4>
                      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 md:p-4 md:flex-1 md:min-h-0 w-full">
                        <div className="h-40 md:h-[7.5rem] min-h-[6rem] flex items-center justify-center w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={contentPieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius="50%"
                                outerRadius="80%"
                                paddingAngle={2}
                                stroke="#FFFFFF"
                                strokeWidth={2}
                              >
                                {contentPieData.map((entry, i) => (
                                  <Cell key={i} fill={contentPieColor(entry.name)} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(v: number) => [`${v}%`, '割合']} contentStyle={{ borderRadius: 8 }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2 text-sm text-gray-700" aria-label="コンテンツ構成の凡例">
                          {contentPieData.map((entry, i) => {
                            const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0';
                            return (
                              <li key={i} className="flex items-center gap-1.5 min-w-0">
                                <span
                                  className="flex-shrink-0 w-3 h-3 rounded-full"
                                  style={{ backgroundColor: contentPieColor(entry.name) }}
                                  aria-hidden
                                />
                                <span className="truncate">{entry.name}</span>
                                <span className="flex-shrink-0 tabular-nums">{pct}%</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* 3行目（PC）: 中央＝最近のハッシュタグ（横長・全幅） */}
            <div className="w-full mb-8">
              {result.recent_hashtag_list && result.recent_hashtag_list.length > 0 && (() => {
                const list = (result.recent_hashtag_list ?? []).slice(0, 10);
                const counts = list.map((x) => x.count);
                const minC = Math.min(...counts);
                const maxC = Math.max(...counts);
                const range = maxC - minC || 1;
                const sizeClasses = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl'];
                const colorClasses = [
                  'text-slate-400',
                  'text-slate-500',
                  'text-slate-600',
                  'text-gray-600',
                  'text-gray-700',
                  'text-neutral-700',
                ];
                const rotations = ['-rotate-2', 'rotate-0', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-0', '-rotate-1', 'rotate-1', '-rotate-2', 'rotate-0'];
                return (
                  <div className="w-full">
                    <h4 className="font-semibold text-gray-900 mb-3 md:mb-1">最近のハッシュタグ</h4>
                    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-2 py-4 md:py-3 px-4 bg-gradient-to-br from-slate-50/90 to-gray-100/80 rounded-xl border border-slate-200/80 w-full min-h-[3.5rem]">
                      {list.map((item, i) => {
                        const t = minC === maxC ? 0.5 : (item.count - minC) / range;
                        const sizeIdx = Math.min(Math.floor(t * (sizeClasses.length - 1)), sizeClasses.length - 1);
                        const colorIdx = Math.min(Math.floor(t * (colorClasses.length - 1)), colorClasses.length - 1);
                        const sizeClass = sizeClasses[sizeIdx];
                        const colorClass = colorClasses[colorIdx];
                        const rotation = rotations[i % rotations.length];
                        const tag = item.hashtag.startsWith('#') ? item.hashtag : `#${item.hashtag}`;
                        return (
                          <span
                            key={i}
                            className={`inline-block font-medium ${sizeClass} ${colorClass} ${rotation} hover:scale-105 transition-transform cursor-default`}
                            title={`${tag} ×${item.count}`}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 4. 詳細フィードバック ＋ 5. 改善点（余白で重なり防止） */}
            <div className="md:flex md:flex-row md:gap-6 md:items-start mb-8 pb-8">
            {/* 現状のアカウントに関するフィードバック */}
            {result.feedback_message && result.feedback_message.length > 0 && (
              <div className="mb-6 md:mb-0 md:max-w-[320px] md:flex-shrink-0">
                <h4 className="font-semibold text-gray-900 mb-3 md:mb-1">現状のアカウントに関するフィードバック</h4>
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 md:p-4">
                  <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 [&_li]:marker:text-neutral-600">
                    {result.feedback_message.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 今後の運用への改善点（先頭4行は全文表示、5行目以降はモザイク＋一部公開表示） */}
            <div className="mb-6 md:mb-0 md:flex-1 md:min-w-0">
              <h4 className="font-semibold text-gray-900 mb-3 md:mb-1">今後の運用への改善点</h4>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 md:p-4">
                {(() => {
                  const improvementParagraphs =
                    result.improvement_message && result.improvement_message.length > 0
                      ? result.improvement_message
                      : [
                          'エンゲージメント率を向上させるため、投稿時間を最適化し、フォロワーが最もアクティブな時間帯に合わせた投稿スケジュールを構築することをお勧めします。',
                          'ストーリーズ機能を活用し、フォロワーとの双方向コミュニケーションを強化することで、親近感を高め、リーチの拡大につなげることができます。',
                          'リール動画の投稿頻度を増やし、トレンドに合わせたコンテンツ制作を行うことで、新規フォロワーの獲得が期待できます。',
                          'ハッシュタグ戦略を見直し、ニッチで競合が少ないタグを組み合わせることで、ターゲット層へのリーチ精度を高めることができます。',
                        ];
                  const content = (
                    <>
                      {improvementParagraphs.map((p, i) => (
                        <p key={i} className="mb-2 last:mb-0">
                          {p}
                        </p>
                      ))}
                    </>
                  );
                  return (
                    <div className="relative text-sm text-gray-700 leading-relaxed">
                      {/* 全文をぼかしたレイヤー（5行目以降に見える） */}
                      <div className="blur-[6px] select-none pointer-events-none" aria-hidden>
                        {content}
                      </div>
                      {/* 先頭4行のみ表示（5行目からモザイク） */}
                      <div
                        className="absolute left-0 right-0 top-0 line-clamp-4 bg-white pr-1"
                        style={{ height: '6.5em' }}
                      >
                        {content}
                      </div>
                      {/* 5行目以降のエリアに鍵＋一部公開のオーバーレイ */}
                      <div
                        className="absolute left-0 right-0 bottom-0 flex flex-col items-center justify-center gap-1 bg-white/60 rounded min-h-[4rem]"
                        style={{ top: '6.5em' }}
                        aria-label="一部公開"
                      >
                        <Lock className="w-6 h-6 text-gray-500 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-xs font-medium text-gray-600">一部公開</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            </div>

            {/* 5. 重要アクション: お問い合わせ誘導カード（下端に余白） */}
            <div className="flex-shrink-0 space-y-3 mb-8">
            {customer?.is_callable && customer?.message && (
              <div className="p-3 md:p-4 rounded-lg bg-slate-100 border border-slate-200">
                <p className="text-sm text-gray-800">{customer.message}</p>
              </div>
            )}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5 flex flex-col items-center gap-3 text-center">
              <Lock className="w-8 h-8 text-accent flex-shrink-0" strokeWidth={1.5} />
              <p className="text-sm font-semibold text-gray-900">
                具体的な改善案やInstagramに関するご質問を無料でご相談いたします
              </p>
              <a
                href={process.env.NEXT_PUBLIC_CONTACT_FORM_URL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-900 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-gray-800 transition-colors"
              >
                お問い合わせフォームへ
              </a>
            </div>
              <a
                href="https://www.cocomarke.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block md:hidden w-full text-center py-2.5 px-6 border border-gray-200 text-gray-700 rounded-lg font-medium hover:border-accent hover:text-accent transition-colors"
              >
                サービスページトップへ
              </a>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    );
  }

  // 2. 分析中の場合 → プログレス画面
  if (isAnalyzing) {
    const completedSteps =
      diagnosisProgress >= 100 ? 3 : diagnosisProgress >= 66 ? 2 : diagnosisProgress >= 33 ? 1 : 0;
    const stepDone = (index: number) => index < completedSteps;

    return (
      <div
        className={`fixed inset-0 z-50 min-h-screen flex flex-col items-center justify-center overflow-hidden ${variant === 'overlay' ? 'bg-black/50 backdrop-blur-sm' : 'bg-page'}`}
        data-debug-state="analyzing"
      >
        {variant === 'overlay' && (
          <button
            type="button"
            onClick={() => { handleReset(); onRequestClose?.(); }}
            className="absolute top-4 right-4 z-20 rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none"
            aria-label="診断を閉じる"
          >
            <X className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
        )}
        <svg aria-hidden="true" className="absolute w-0 h-0">
          <defs>
            <linearGradient id="diagnosis-progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#404040" />
              <stop offset="100%" stopColor="#a3a3a3" />
            </linearGradient>
          </defs>
        </svg>

        {/* 背景スケルトン（Instagram投稿風・浮遊） */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {[
            { top: '10%', left: '5%', delay: 0, duration: 8 },
            { top: '60%', left: '70%', delay: 1.5, duration: 10 },
            { top: '25%', right: '10%', left: 'auto', delay: 0.8, duration: 9 },
            { top: '70%', left: '15%', delay: 2, duration: 11 },
            { top: '15%', left: '50%', delay: 0.3, duration: 7 },
            { top: '50%', right: '5%', left: 'auto', delay: 1.2, duration: 9.5 },
          ].map((style, i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-28 rounded-lg border border-gray-300 bg-gray-200/80"
              style={{
                top: style.top,
                left: style.left,
                right: style.right,
                opacity: 0.05,
              }}
              animate={{
                y: [0, -12, 0],
                x: [0, 6, 0],
                opacity: [0.05, 0.08, 0.05],
              }}
              transition={{
                duration: style.duration,
                delay: style.delay,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <div className="p-2 space-y-2">
                <div className="w-full h-16 rounded bg-gray-300/80" />
                <div className="h-2 rounded bg-gray-300/80 w-3/4" />
                <div className="h-2 rounded bg-gray-300/80 w-1/2" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* メインコンテンツ */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4">
          {/* 円形プログレス（直径120px） */}
          <div className="relative w-[120px] h-[120px] flex items-center justify-center" aria-live="polite" aria-atomic="true">
            <svg className="w-[120px] h-[120px] -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="8"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="url(#diagnosis-progress-gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 54}
                initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - diagnosisProgress / 100) }}
                transition={{ type: 'tween', duration: 0.3 }}
              />
            </svg>
            <span className="absolute text-xl font-semibold text-gray-800 tabular-nums">
              <motion.span
                key={Math.floor(diagnosisProgress)}
                initial={{ opacity: 0.6, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
              >
                {Math.min(100, Math.floor(diagnosisProgress))}%
              </motion.span>
            </span>
          </div>

          {/* 3ステップリスト（左揃え・中央付近） */}
          <ul className="mt-8 w-full max-w-xs text-left space-y-4" aria-label="診断の進捗">
            {DIAGNOSIS_STEPS.map((label, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center" aria-hidden>
                  {stepDone(index) ? (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Check className="w-5 h-5 text-neutral-800" strokeWidth={2.5} />
                    </motion.span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </span>
                <span className={`text-sm ${stepDone(index) ? 'text-gray-600' : 'text-gray-700'}`}>
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ホワイトアウト・遷移オーバーレイ（無効化：即座表示のため） */}
      </div>
    );
  }

  // 3. デフォルト: 入力フォーム画面
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 ${variant === 'overlay' ? 'fixed inset-0 bg-black/50 backdrop-blur-sm' : 'min-h-screen py-6 md:py-10 bg-page'}`}
      data-debug-state="input"
      onClick={variant === 'overlay' ? (e) => { if (e.target === e.currentTarget) onRequestClose?.(); } : undefined}
    >
      <div className={`max-w-md w-full flex flex-col items-center ${variant === 'overlay' ? 'relative bg-design-accent-lavender-soft rounded-2xl px-6 pt-12 pb-8' : 'px-4'}`}>
        {variant === 'overlay' && (
          <button
            type="button"
            onClick={() => onRequestClose?.()}
            className="absolute top-4 right-4 z-10 rounded-lg p-2 text-violet-400 transition-colors hover:bg-violet-100 hover:text-violet-600 focus:outline-none"
            aria-label="診断を閉じる"
          >
            <X className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
        )}
        <TotalAnalysisCounter className="mb-6" />
        <h1 className="font-bold text-center mb-2">
          Instagramアカウント簡単診断
        </h1>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
          ログイン不要・完全無料で、
          <br />
          あなたのアカウントの現状を分析します。
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white rounded-xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 sm:p-8 md:p-10"
          aria-busy={isAnalyzing}
        >
          <h2 className="font-bold mb-6 text-center">
            あなたのInstagram IDを
            <br />
            教えてください
          </h2>

          <label htmlFor="instagram-id" className="sr-only">
            Instagram ID
          </label>
          <input
            id="instagram-id"
            name="instagramId"
            type="text"
            value={instagramId}
            onChange={(e) => setInstagramId(e.target.value)}
            placeholder="@your_account"
            disabled={isAnalyzing}
            autoComplete="username"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          />

          <p className="text-xs text-gray-500 mt-2 mb-4">
            ※パスワードの入力は不要です。プライバシーは完全に保護されます。
          </p>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            ※非公開アカウントやいいね数が非公開の設定の場合、正確な分析ができないことがあります。
          </p>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            ※診断のご利用は10分に1回までとなっております。
          </p>

          {errorMessage && (
            <p role="alert" className="text-red-600 text-sm mb-4 font-medium">{toDisplayError(errorMessage)}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              canSubmit
                ? 'bg-accent text-white hover:opacity-90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            診断する
          </button>
        </motion.div>
      </div>
    </div>
  );
}
