import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import Can from "../../components/Can.jsx";
import { ADMIN_BUTTON, ADMIN_INPUT } from "../../components/ui.js";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../api/fleetApi.js";
import { P } from "../../permissions.js";

const SMALL_INPUT = `${ADMIN_INPUT} h-10 text-sm`;

// Add, rename (English + Arabic) and delete car categories. A category with
// cars can't be deleted (the backend answers 409 CATEGORY_NOT_EMPTY).
export default function CategoriesDialog({ open, onClose }) {
  const { t } = useTranslation("admin");
  const dialogRef = useRef(null);
  const { data: categories = [] } = useGetCategoriesQuery();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="categories-title"
      className="w-[min(640px,calc(100vw-32px))] max-h-[calc(100vh-64px)] rounded-2xl border border-line/10 bg-page p-0 text-fg shadow-2xl backdrop:bg-black/60"
    >
      <div className="flex items-center justify-between border-b border-line/10 px-6 py-4">
        <h2 id="categories-title" className="text-lg font-semibold">
          {t("fleet.categories.title")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("fleet.categories.close")}
          className="text-fg/70 hover:text-fg"
        >
          <X size={22} />
        </button>
      </div>

      <div className="px-6 py-5">
        <div className="hidden sm:grid grid-cols-[1fr_1fr_auto] gap-3 mb-2 text-xs text-muted">
          <span>{t("fleet.categories.nameEn")}</span>
          <span>{t("fleet.categories.nameAr")}</span>
          <span className="w-[132px]" />
        </div>
        <ul className="flex flex-col gap-3">
          {categories.map((category) => (
            <CategoryRow
              key={`${category.id}:${category.name.en}:${category.name.ar}`}
              category={category}
            />
          ))}
        </ul>
        <Can permission={P.fleet.create}>
          <NewCategoryRow />
        </Can>
      </div>
    </dialog>
  );
}

function NameInputs({ en, ar, setEn, setAr }) {
  const { t } = useTranslation("admin");
  return (
    <>
      <input
        value={en}
        onChange={(event) => setEn(event.target.value)}
        aria-label={t("fleet.categories.nameEn")}
        placeholder={t("fleet.categories.nameEn")}
        dir="ltr"
        className={SMALL_INPUT}
      />
      <input
        value={ar}
        onChange={(event) => setAr(event.target.value)}
        aria-label={t("fleet.categories.nameAr")}
        placeholder={t("fleet.categories.nameAr")}
        dir="rtl"
        className={SMALL_INPUT}
      />
    </>
  );
}

function CategoryRow({ category }) {
  const { t } = useTranslation("admin");
  const [en, setEn] = useState(category.name.en);
  const [ar, setAr] = useState(category.name.ar);
  const [error, setError] = useState("");
  const [updateCategory, { isLoading: isSaving }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const changed =
    en.trim() !== category.name.en || ar.trim() !== category.name.ar;
  const hasCars = category.carCount > 0;

  const save = async () => {
    setError("");
    try {
      await updateCategory({
        id: category.id,
        name: { en: en.trim(), ar: ar.trim() },
      }).unwrap();
    } catch {
      setError(t("common.actionFailed"));
    }
  };

  const remove = async () => {
    setError("");
    try {
      await deleteCategory(category.id).unwrap();
    } catch (failure) {
      setError(
        failure?.status === 409
          ? t("fleet.categories.notEmpty")
          : t("common.actionFailed")
      );
    }
  };

  return (
    <li>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-center">
        <NameInputs en={en} ar={ar} setEn={setEn} setAr={setAr} />
        <div className="flex items-center justify-end gap-2 sm:w-[132px]">
          <span className="me-auto text-xs text-muted whitespace-nowrap">
            {t("fleet.categories.carCount", { count: category.carCount })}
          </span>
          {changed && (
            <button
              type="button"
              onClick={save}
              disabled={isSaving || !en.trim()}
              className="h-9 px-3 rounded-lg bg-teal-accent text-page text-sm font-semibold disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                t("fleet.categories.save")
              )}
            </button>
          )}
          <Can permission={P.fleet.delete}>
            <button
              type="button"
              onClick={remove}
              disabled={hasCars || isDeleting}
              aria-label={`${t("fleet.categories.delete")}: ${category.name.en}`}
              title={
                hasCars
                  ? t("fleet.categories.notEmpty")
                  : t("fleet.categories.delete")
              }
              className="grid h-9 w-9 place-items-center rounded-lg text-rose-400 light:text-rose-700 hover:bg-rose-500/10 disabled:opacity-35 disabled:hover:bg-transparent disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
            </button>
          </Can>
        </div>
      </div>
      {error && (
        <p
          role="alert"
          className="mt-1.5 text-sm text-red-400 light:text-red-600"
        >
          {error}
        </p>
      )}
    </li>
  );
}

function NewCategoryRow() {
  const { t } = useTranslation("admin");
  const [en, setEn] = useState("");
  const [ar, setAr] = useState("");
  const [failed, setFailed] = useState(false);
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const add = async (event) => {
    event.preventDefault();
    setFailed(false);
    try {
      await createCategory({ name: { en: en.trim(), ar: ar.trim() } }).unwrap();
      setEn("");
      setAr("");
    } catch {
      setFailed(true);
    }
  };

  return (
    <form onSubmit={add} className="mt-5 border-t border-line/10 pt-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-center">
        <NameInputs en={en} ar={ar} setEn={setEn} setAr={setAr} />
        <button
          type="submit"
          disabled={!en.trim() || isLoading}
          className={`${ADMIN_BUTTON} h-10 text-sm sm:w-[132px] disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          {t("fleet.categories.add")}
        </button>
      </div>
      {failed && (
        <p
          role="alert"
          className="mt-1.5 text-sm text-red-400 light:text-red-600"
        >
          {t("common.actionFailed")}
        </p>
      )}
    </form>
  );
}
