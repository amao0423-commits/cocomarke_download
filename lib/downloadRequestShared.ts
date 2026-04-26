import type { EmailStatus } from '@/types/database.types';

/** クライアントでも import 可（サーバー専用モジュールを引かない） */
export const DOWNLOAD_REQUEST_STATUSES = ['送付済', 'リタ中', '契約'] as const;
export type DownloadRequestStatus = (typeof DOWNLOAD_REQUEST_STATUSES)[number];

/** 旧ステータスを一覧の選択肢に合わせて表示する（保存は PATCH 時に新ラベルへ更新） */
const LEGACY_STATUS_TO_UI: Record<string, DownloadRequestStatus> = {
  未対応: '送付済',
  商談中: 'リタ中',
  NG: '契約',
};

export function normalizeDownloadRequestStatusForUi(
  raw: string | undefined | null
): DownloadRequestStatus {
  const v = (raw ?? '').trim();
  if (DOWNLOAD_REQUEST_STATUSES.includes(v as DownloadRequestStatus)) {
    return v as DownloadRequestStatus;
  }
  return LEGACY_STATUS_TO_UI[v] ?? '送付済';
}

/** 資料請求フォーム「目的」選択肢（API と同一） */
export const DOWNLOAD_REQUEST_PURPOSE_OPTIONS = [
  '運用改善したい',
  '外注を検討中',
  '情報収集',
] as const;

/** 資料請求フォーム「役職」選択肢（DB 列名は department のまま保存）（API と同一） */
export const DOWNLOAD_REQUEST_JOB_TITLE_OPTIONS = [
  '経営者',
  '役員',
  '本部長・部長',
  '課長・主任クラス',
  'マネージャー・リーダー',
  '一般社員',
  'その他',
] as const;

export type DownloadRequestEntry = {
  id: string;
  /** 表示・メールテンプレ用の氏名（姓＋名） */
  name: string;
  lastName?: string;
  firstName?: string;
  email: string;
  company: string;
  /** 役職（必須・選択肢は DOWNLOAD_REQUEST_JOB_TITLE_OPTIONS） */
  department?: string;
  /** 未入力可（任意） */
  phone: string;
  /** 資料請求の目的（選択ラベル） */
  requestPurpose?: string;
  /** ご質問・ご要望 */
  questions?: string;
  /** 同意済み申請では true */
  privacyConsent?: boolean;
  timestamp: string;
  status?: DownloadRequestStatus;
  /** DB 連携時のみ（メール送受信状態） */
  emailStatus?: EmailStatus;
  /** 申請時に指定されたメールテンプレ（DB 連携時） */
  templateId?: string | null;
  /** 送信に使われたテンプレの件名（一覧表示用） */
  templateSubject?: string | null;
  /** 資料請求の対象資料（DB 連携時） */
  documentId?: string | null;
  /** 希望資料の表示名（申請時スナップショット。DB の requested_document_title と対応） */
  documentTitle?: string | null;
};
