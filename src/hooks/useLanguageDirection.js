import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RTL_LANGUAGES } from "@/i18n/i18n";

/**
 * Keeps <html lang="xx" dir="ltr|rtl"> in sync with the active language
 * so Tailwind's logical-property utilities (ps-*, me-*, text-start...)
 * and the browser's native bidi handling flip automatically.
 */
export function useLanguageDirection() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = RTL_LANGUAGES.includes(i18n.language) ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", i18n.language);
    document.documentElement.setAttribute("dir", dir);
  }, [i18n.language]);
}
