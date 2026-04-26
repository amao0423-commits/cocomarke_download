import type { Metadata } from "next";
import { RestaurantDiagnosisClient } from "./RestaurantDiagnosisClient";

export const metadata: Metadata = {
  title: "飲食店向け SNS集客無料診断 | COCOマーケ",
  description:
    "飲食店オーナー向け。Instagram集客の課題を可視化する無料診断。100店舗以上の支援実績。",
};

export default function RestaurantDiagnosisPage() {
  return <RestaurantDiagnosisClient />;
}
