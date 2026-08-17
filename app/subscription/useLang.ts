"use client";

import { useEffect, useState } from "react";
import type { Lang } from "./subscriptionContent";

const STORAGE_KEY = "jemia_lang";

// 表示言語（海外ユーザー向け）の取得・保存。SubscriptionClient と同じ
// localStorage キー／?lang= クエリを共有するので、LP → お申し込み・相談モーダルまで
// 選択した言語が引き継がれる。
export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>("ja");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromQuery = new URLSearchParams(window.location.search).get("lang");
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const initial = fromQuery === "ko" || fromQuery === "ja" ? fromQuery : saved === "ko" || saved === "ja" ? saved : "ja";
    setLangState(initial as Lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
  };

  return [lang, setLang];
}
