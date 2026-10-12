import { useTranslation } from "react-i18next";
import { ADMIN_ICON_BUTTON } from "./ui.js";

// AR/EN switch. i18n.js syncs <html> dir/lang and remembers the choice.
export default function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(isEnglish ? "ar" : "en")}
      aria-label={t(isEnglish ? "nav.switchToArabic" : "nav.switchToEnglish")}
      className={`${ADMIN_ICON_BUTTON} font-display text-sm`}
    >
      {isEnglish ? "AR" : "EN"}
    </button>
  );
}
