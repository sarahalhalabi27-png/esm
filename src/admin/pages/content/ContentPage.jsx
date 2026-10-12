import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { adminPath } from "../../navigation.js";
import { LEGAL_PAGES } from "../../api/mockContent.js";
import {
  FaqEditor,
  LegalEditor,
  PartnersEditor,
  PromoEditor,
} from "./editors.jsx";

const TABS = ["faq", "promo", "partners", ...LEGAL_PAGES];

// /admin/content/<faq | promo | partners | terms | privacy | disclaimer>:
// one editor per block of website text, under a row of sub-tabs.
export default function ContentPage() {
  const { t } = useTranslation("admin");
  return (
    <>
      <nav className="mb-6 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        {TABS.map((tab) => (
          <NavLink
            key={tab}
            to={`${adminPath("content")}/${tab}`}
            className={({ isActive }) =>
              `inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm transition-colors ${
                isActive
                  ? "bg-teal-accent text-page font-semibold"
                  : "border border-line/15 text-fg/75 hover:text-fg hover:bg-surface/[0.05]"
              }`
            }
          >
            {t(`content.tabs.${tab}`)}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route index element={<Navigate to="faq" replace />} />
        <Route path="faq" element={<FaqEditor />} />
        <Route path="promo" element={<PromoEditor />} />
        <Route path="partners" element={<PartnersEditor />} />
        {LEGAL_PAGES.map((page) => (
          <Route
            key={page}
            path={page}
            element={<LegalEditor key={page} page={page} />}
          />
        ))}
        <Route path="*" element={<Navigate to="faq" replace />} />
      </Routes>
    </>
  );
}
