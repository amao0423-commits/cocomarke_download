/** クライアントでも import 可（サーバー専用モジュールを引かない） */
export const ENTERED_ID_STATUSES = ['未対応', 'リタ中', 'NG', '契約'] as const;
export type EnteredIdStatus = (typeof ENTERED_ID_STATUSES)[number];

export type EnteredIdEntry = {
  id: string;
  timestamp: string;
  status?: EnteredIdStatus;
  result?: Record<string, unknown>;
};
