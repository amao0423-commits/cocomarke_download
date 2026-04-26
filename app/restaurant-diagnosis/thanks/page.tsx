import type { Metadata } from "next";
import { RestaurantDiagnosisThanksClient } from "./RestaurantDiagnosisThanksClient";

export const metadata: Metadata = {
  title: "送信完了 | 飲食店向け SNS集客無料診断 | COCOマーケ",
  description: "無料診断のお申し込みを受け付けました。",
};

export default function RestaurantDiagnosisThanksPage() {
  return <RestaurantDiagnosisThanksClient />;
}
