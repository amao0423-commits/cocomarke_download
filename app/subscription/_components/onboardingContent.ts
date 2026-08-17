import type { Lang } from "../subscriptionContent";

// ────────────────────────────────────────────────────────────────
// OnboardingFlow（/subscription/apply, /subscription/apply-direct）と
// ContactForm（チャット相談モーダル）の多言語コンテンツ。
// id/key は常に日本語（不変）— /api/onboarding・/api/subscription-contact への
// 送信値やチェック状態の識別子として使うため。label/name だけを言語ごとに翻訳する。
// ────────────────────────────────────────────────────────────────

export type Payment = { id: string; label: string };

export const PAYMENTS: Record<Lang, Payment[]> = {
  ja: [
    { id: "paypay", label: "PayPay" },
    { id: "bank", label: "口座振込" },
    { id: "card", label: "クレジットカード" },
  ],
  ko: [
    { id: "paypay", label: "PayPay" },
    { id: "bank", label: "계좌이체" },
    { id: "card", label: "신용카드" },
  ],
};

export type AccountStatusOption = { id: "has" | "planning" | "none"; label: string };

export const ACCOUNT_STATUS_OPTIONS: Record<Lang, AccountStatusOption[]> = {
  ja: [
    { id: "has", label: "既にアカウントがある（IDを入力）" },
    { id: "planning", label: "これから作成予定" },
    { id: "none", label: "アカウントがない・未定" },
  ],
  ko: [
    { id: "has", label: "이미 계정이 있음(아이디 입력)" },
    { id: "planning", label: "앞으로 생성 예정" },
    { id: "none", label: "계정 없음・미정" },
  ],
};

export const ONBOARDING = {
  ja: {
    steps: ["内容確認", "同意", "開始日・お支払い方法", "アカウント情報", "お申し込み"],
    header: { eyebrow: "JEMIA お申し込み手続き", title: "お申し込み手続き", sub: "あと少しで運用スタートできます。上から順にお進みください（所要 約5分）。", close: "閉じる" },
    step1: {
      no: "STEP 1 / 5", title: "お申し込み内容をご確認ください", sub: "ご希望のプランをお選びください（複数選択できます）。",
      optionsHeading: "オプション（任意）", optionsNote: "※「複数アカウント割」は2つ目以降のアカウントに適用されます（上の合計には反映していません）。",
      totalLabel: "合計月額（税込）", yen: "円", perMonth: "/月",
      premiumPrefix: "プレミアムをご希望の場合は", premiumLink: "こちらからご相談", premiumSuffix: "ください。",
      cta: "この内容で進む",
    },
    step2: {
      no: "STEP 2 / 5", title: "ご利用にあたっての確認事項", sub: "運用を安心して進めるため、以下にご同意ください。",
      serviceHeading: "サービス内容について",
      serviceItems: ["・成果（フォロワー数・順位等）はアカウントや仕様により変動し、特定の数値を保証するものではありません。", "・アカウントの安全に配慮して運用しますが、Instagramの仕様変更等による影響を完全に排除するものではありません。"],
      privacyHeading: "お預かりする情報の取り扱い（秘密保持）",
      privacyItems: ["・お預かりするアカウント情報・素材・お客様情報は、運用および連絡の目的にのみ使用します。", "・お客様の許可なく第三者に開示・提供することはありません。", "・解約後は、ご要望に応じてお預かり情報を適切に削除いたします。"],
      paymentHeading: "お支払い・解約について",
      paymentItems: ["・初回のお支払い確認後、運用準備を開始します。", "・解約をご希望の場合は、ご希望月の締め日の5日前までに、ご担当者またはJEMIA運営事務局（info@cocomake-guide.com）へメールにてお申し出ください。締め日の5日前を過ぎた場合は、翌月からの解約となります。"],
      agreePrefix: "上記の注意事項、", termsLink: "利用規約", agreeMid: "および", privacyLink: "プライバシーポリシー", agreeSuffix: "・秘密保持の内容に同意します", agreeNote: "（同意いただいた日時を記録します）",
      back: "戻る", next: "同意して次へ",
    },
    step3: {
      no: "STEP 3 / 5", title: "運用開始日とお支払い方法", sub: "ご希望の運用開始日とお支払い方法をお選びください。",
      startDateLabel: "運用開始日", startDateInvalid: "土日は選択できません。最短で {min}（3日後）以降の平日をお選びください。", startDateHint: "最短で {min}（3日後）から。土日は選択できません。",
      paymentLabel: "お支払い方法", noteLabel: "補足・ご要望（任意）",
      back: "戻る", next: "次へ",
    },
    step4: {
      no: "STEP 4 / 5", title: "ご連絡先と運用アカウント", sub: "お名前・ご連絡用のメールアドレスと、運用するInstagramアカウントの状況をお知らせください。",
      lastName: "姓", firstName: "名", lastNamePh: "山田", firstNamePh: "太郎",
      email: "メールアドレス", emailPh: "example@example.com",
      statusLabel: "運用するアカウントの状況",
      accountLabelBase: "InstagramアカウントID", accountLabelSuffix: "（＠ ユーザーネーム）", accountPh: "your_account", removeAccount: "削除", removeAccountAria: "このアカウントを削除", addAccount: "＋ アカウントを追加する",
      multiInfo: "複数アカウントの運用にも対応しています。運用後に追加することも可能です。",
      noAccountInfo: "アカウントがない状態でも、ご提供できる内容をご提案することは可能です。ただし原則はアカウント作成後のご対応となり、プランによっては最短で1週間後からのスタートでのご案内となる場合があります。",
      back: "戻る", next: "次へ",
    },
    step5: {
      no: "STEP 5 / 5", title: "お申し込み内容の最終確認（仮）", sub: "以下の内容でお申し込みを承ります。内容をご確認のうえ、お進みください。",
      boxTitle: "お申し込み内容", planLabel: "プラン", optionLabel: "オプション", startDateLabel: "運用開始日（希望）", paymentLabel: "お支払い方法", totalLabel: "合計月額（税込）", yen: "円", none: "—",
      note: "※運用開始日はあくまでご希望日です。アカウントの状況や営業日の都合により、前後する場合があります。確定日は担当者よりご連絡いたします。",
      submitting: "送信中…", submit: "この内容で申し込む →", submitNote: "まだお支払いは発生しません。担当者による最終確認後に運用準備を開始します。",
      back: "戻る",
    },
    done: {
      title: "お申し込みを受け付けました", body1: "ありがとうございます。お申し込み手続きが完了しました。", body2: "運用開始までの流れは以下のとおりです。",
      timeline: [
        { icon: "📋", title: "内容確認", desc: "担当者が申込内容を確認" },
        { icon: "✉️", title: "支払方法の送付", desc: "お支払い方法をメール送付" },
        { icon: "💳", title: "ご入金の確認", desc: "ご入金を確認" },
        { icon: "🚀", title: "運用開始", desc: "運用スタート" },
      ],
      mailNote: "手続きでき次第、追ってメールでご連絡します。",
      helpPrefix: "ご不明な点があれば、いつでも", helpLink: "こちらからご相談", helpSuffix: "ください。",
      diagBoxTitle: "運用開始までに、アカウントの現状もチェック", diagBoxBody: "60秒でできる無料のアカウント診断で、いまの伸びしろを確認できます。", diagCta: "無料でアカウント診断する →",
      backHome: "JEMIAトップへ戻る",
    },
    footerHelp: { prefix: "お手続きで困ったら", link: "担当者に相談する" },
  },
  ko: {
    steps: ["신청 내용 확인", "동의", "시작일・결제 방법", "계정 정보", "신청하기"],
    header: { eyebrow: "JEMIA 신청 절차", title: "신청 절차", sub: "조금만 더 하시면 운영을 시작하실 수 있습니다. 위에서부터 순서대로 진행해 주세요(소요 시간 약 5분).", close: "닫기" },
    step1: {
      no: "STEP 1 / 5", title: "신청 내용을 확인해 주세요", sub: "원하시는 플랜을 선택해 주세요(복수 선택 가능).",
      optionsHeading: "옵션(선택)", optionsNote: "※'복수 계정 할인'은 2번째 계정부터 적용됩니다(위 합계에는 반영되어 있지 않습니다).",
      totalLabel: "합계 월 요금(세금 포함)", yen: "엔", perMonth: "/월",
      premiumPrefix: "프리미엄을 원하시는 경우 ", premiumLink: "이쪽에서 상담하기", premiumSuffix: " 부탁드립니다.",
      cta: "이 내용으로 진행",
    },
    step2: {
      no: "STEP 2 / 5", title: "이용 시 확인 사항", sub: "안심하고 운영을 진행하기 위해 아래 내용에 동의해 주세요.",
      serviceHeading: "서비스 내용에 대해",
      serviceItems: ["・성과(팔로워 수・순위 등)는 계정이나 정책에 따라 변동되며 특정 수치를 보장하지 않습니다.", "・계정의 안전을 고려하여 운영하지만, 인스타그램의 정책 변경 등에 따른 영향을 완전히 배제할 수는 없습니다."],
      privacyHeading: "제공받는 정보의 취급(비밀유지)",
      privacyItems: ["・제공받는 계정 정보・소재・고객 정보는 운영 및 연락 목적으로만 사용합니다.", "・고객님의 허락 없이 제3자에게 공개・제공하지 않습니다.", "・해지 후에는 요청에 따라 제공받은 정보를 적절히 삭제합니다."],
      paymentHeading: "결제・해지에 대해",
      paymentItems: ["・최초 결제 확인 후 운영 준비를 시작합니다.", "・해지를 원하시는 경우 희망하시는 달의 마감일 5일 전까지 담당자 또는 JEMIA 운영 사무국(info@cocomake-guide.com)으로 이메일 요청해 주세요. 마감일 5일 전을 지난 경우 다음 달부터 해지 처리됩니다."],
      agreePrefix: "위 안내 사항, ", termsLink: "이용약관", agreeMid: " 및 ", privacyLink: "개인정보처리방침", agreeSuffix: "・비밀유지 내용에 동의합니다", agreeNote: "(동의하신 일시가 기록됩니다)",
      back: "이전", next: "동의하고 다음으로",
    },
    step3: {
      no: "STEP 3 / 5", title: "운영 시작일과 결제 방법", sub: "희망하시는 운영 시작일과 결제 방법을 선택해 주세요.",
      startDateLabel: "운영 시작일", startDateInvalid: "토・일요일은 선택할 수 없습니다. 빠르면 {min}(3일 후) 이후의 평일을 선택해 주세요.", startDateHint: "빠르면 {min}(3일 후)부터 가능합니다. 토・일요일은 선택할 수 없습니다.",
      paymentLabel: "결제 방법", noteLabel: "추가 사항・요청 사항(선택)",
      back: "이전", next: "다음",
    },
    step4: {
      no: "STEP 4 / 5", title: "연락처와 운영 계정", sub: "성함・연락용 이메일 주소와 운영할 인스타그램 계정 상황을 알려주세요.",
      lastName: "성", firstName: "이름", lastNamePh: "김", firstNamePh: "민수",
      email: "이메일 주소", emailPh: "example@example.com",
      statusLabel: "운영할 계정 상황",
      accountLabelBase: "인스타그램 계정 아이디", accountLabelSuffix: "(@ 사용자명)", accountPh: "your_account", removeAccount: "삭제", removeAccountAria: "이 계정 삭제", addAccount: "＋ 계정 추가하기",
      multiInfo: "복수 계정 운영에도 대응하고 있습니다. 운영 개시 후 추가하는 것도 가능합니다.",
      noAccountInfo: "계정이 없는 상태에서도 제공 가능한 내용을 제안해 드릴 수 있습니다. 다만 원칙적으로 계정 생성 후 대응이 가능하며, 플랜에 따라 빠르면 1주일 후부터 시작을 안내드릴 수 있습니다.",
      back: "이전", next: "다음",
    },
    step5: {
      no: "STEP 5 / 5", title: "신청 내용 최종 확인(가신청)", sub: "아래 내용으로 신청을 접수합니다. 내용을 확인하신 후 진행해 주세요.",
      boxTitle: "신청 내용", planLabel: "플랜", optionLabel: "옵션", startDateLabel: "운영 시작일(희망)", paymentLabel: "결제 방법", totalLabel: "합계 월 요금(세금 포함)", yen: "엔", none: "—",
      note: "※운영 시작일은 어디까지나 희망일입니다. 계정 상황이나 영업일 사정에 따라 변경될 수 있습니다. 확정일은 담당자가 별도로 안내드립니다.",
      submitting: "전송 중…", submit: "이 내용으로 신청하기 →", submitNote: "아직 결제는 발생하지 않습니다. 담당자의 최종 확인 후 운영 준비를 시작합니다.",
      back: "이전",
    },
    done: {
      title: "신청이 접수되었습니다", body1: "감사합니다. 신청 절차가 완료되었습니다.", body2: "운영 시작까지의 흐름은 다음과 같습니다.",
      timeline: [
        { icon: "📋", title: "신청 내용 확인", desc: "담당자가 신청 내용을 확인" },
        { icon: "✉️", title: "결제 방법 안내", desc: "결제 방법을 이메일로 안내" },
        { icon: "💳", title: "입금 확인", desc: "입금을 확인" },
        { icon: "🚀", title: "운영 시작", desc: "운영을 시작합니다" },
      ],
      mailNote: "절차가 완료되는 대로 이메일로 안내드리겠습니다.",
      helpPrefix: "궁금하신 점이 있으시면 언제든지 ", helpLink: "이쪽에서 상담하기", helpSuffix: " 부탁드립니다.",
      diagBoxTitle: "운영 시작 전에 계정 현황도 체크해 보세요", diagBoxBody: "60초 만에 가능한 무료 계정 진단으로 지금의 성장 가능성을 확인할 수 있습니다.", diagCta: "무료로 계정 진단하기 →",
      backHome: "JEMIA 홈으로 돌아가기",
    },
    footerHelp: { prefix: "절차 중 어려움이 있으시면 ", link: "담당자에게 상담하기" },
  },
} satisfies Record<Lang, unknown>;

export type Topic = { id: string; label: string };

export const TOPICS: Record<Lang, Topic[]> = {
  ja: [
    { id: "service", label: "サービス内容について知りたい" },
    { id: "pricing", label: "料金・プランについて相談したい" },
    { id: "which_plan", label: "自分に合うプランが分からない" },
    { id: "apply", label: "お申し込み手続きについて" },
    { id: "existing", label: "運用中の内容について（既存のお客様）" },
    { id: "other", label: "初期・提携・その他" },
  ],
  ko: [
    { id: "service", label: "서비스 내용에 대해 알고 싶어요" },
    { id: "pricing", label: "요금・플랜에 대해 상담하고 싶어요" },
    { id: "which_plan", label: "저에게 맞는 플랜을 모르겠어요" },
    { id: "apply", label: "신청 절차에 대해" },
    { id: "existing", label: "운영 중인 내용에 대해(기존 고객)" },
    { id: "other", label: "제휴・기타 문의" },
  ],
};

export const CONTACT_FORM = {
  ja: {
    eyebrow: "お問い合わせ・ご相談", title: "お気軽にご相談ください", close: "閉じる",
    intro: "ご相談内容をお選びのうえ、必要に応じて詳細をご記入ください。担当者よりご連絡します。",
    lastName: "姓", firstName: "名", lastNamePh: "山田", firstNamePh: "太郎",
    email: "メールアドレス", topic: "ご相談内容", topicPlaceholder: "選択してください",
    message: "詳細・ご質問", messagePh: "ご質問やご相談の詳細をご記入ください。",
    submit: "この内容で送信する", sending: "送信中…",
    footerNote: "送信いただいた内容はJEMIA管理窓口が受け付け、3営業日以内に担当者よりご連絡いたします。",
    doneTitle: "お問い合わせを受け付けました", doneBody: "ご入力いただいたメールアドレスに受付確認メールをお送りしました。\n担当者より、通常1〜2営業日以内にご連絡いたします。",
    errRequired: "姓・名・メールアドレス・ご相談内容・詳細は必須です。", errEmail: "メールアドレスの形式が正しくありません。", errSend: "送信に失敗しました。",
  },
  ko: {
    eyebrow: "문의・상담", title: "편하게 상담해 보세요", close: "닫기",
    intro: "상담 내용을 선택하신 후 필요에 따라 상세 내용을 작성해 주세요. 담당자가 연락드리겠습니다.",
    lastName: "성", firstName: "이름", lastNamePh: "김", firstNamePh: "민수",
    email: "이메일 주소", topic: "상담 내용", topicPlaceholder: "선택해 주세요",
    message: "상세・문의 사항", messagePh: "문의나 상담하실 내용을 자세히 작성해 주세요.",
    submit: "이 내용으로 전송하기", sending: "전송 중…",
    footerNote: "전송하신 내용은 JEMIA 관리팀이 접수하며, 영업일 기준 3일 이내에 담당자가 연락드립니다.",
    doneTitle: "문의가 접수되었습니다", doneBody: "입력하신 이메일 주소로 접수 확인 메일을 보내드렸습니다.\n담당자가 통상 영업일 기준 1~2일 이내에 연락드립니다.",
    errRequired: "성・이름・이메일 주소・상담 내용・상세 내용은 필수입니다.", errEmail: "이메일 주소 형식이 올바르지 않습니다.", errSend: "전송에 실패했습니다.",
  },
} satisfies Record<Lang, unknown>;
