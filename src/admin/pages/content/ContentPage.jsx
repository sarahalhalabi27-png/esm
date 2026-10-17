import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CircleHelp,
  FileText,
  Handshake,
  Scale,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { adminPath } from "../../navigation.js";
import { LEGAL_PAGES } from "../../api/mockContent.js";
import {
  FaqEditor,
  LegalEditor,
  PartnersEditor,
  PromoEditor,
} from "./editors.jsx";

const TABS = ["faq", "promo", "partners", ...LEGAL_PAGES];

// An icon per tab, in front of its name.
const TAB_ICONS = {
  faq: CircleHelp,
  promo: Tag,
  partners: Handshake,
  terms: FileText,
  privacy: ShieldCheck,
  disclaimer: Scale,
};

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
              `inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm transition-colors ${
                isActive
                  ? "bg-teal-accent text-page font-semibold"
                  : "border border-line/15 text-fg/75 hover:text-fg hover:bg-surface/[0.05]"
              }`
            }
          >
            <TabIcon tab={tab} />
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

function TabIcon({ tab }) {
  const Icon = TAB_ICONS[tab];
  return Icon ? <Icon size={16} className="shrink-0" /> : null;
}
