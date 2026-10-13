import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Plus,
  SearchX,
  Trash2,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Can from "../../components/Can.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import DatePicker from "../../components/DatePicker.jsx";
import ImageUpload from "../../components/ImageUpload.jsx";
import SmallIconButton from "../../components/SmallIconButton.jsx";
import Switch from "../../components/Switch.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_GHOST,
  ADMIN_CARD,
  ADMIN_FIELD_ERROR,
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "../../components/ui.js";
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetPostQuery,
  useUpdatePostMutation,
} from "../../api/blogApi.js";
import useCan from "../../hooks/useCan.js";
import { adminPath } from "../../navigation.js";
import { P } from "../../permissions.js";
import { textToWords, wordsToText } from "../../utils/blog.js";
import UnsavedChangesDialog from "../../components/UnsavedChangesDialog.jsx";
import useUnsavedChanges from "../../hooks/useUnsavedChanges.js";

const LANGUAGES = ["en", "ar"];
const today = () => new Date().toISOString().slice(0, 10);

const sectionSchema = z.object({
  heading: z.string(),
  accents: z.string(),
  body: z.string(),
});
const contentSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  accents: z.string(),
  sections: z.array(sectionSchema),
});
const postSchema = (t) =>
  z.object({
    slug: z.string(),
    published: z.boolean(),
    publishedAt: z.string(),
    author: z.string(),
    image: z.string().nullable(),
    heroImage: z.string().nullable(),
    en: contentSchema.extend({
      title: z.string().trim().min(1, t("blog.validation.titleRequired")),
    }),
    ar: contentSchema,
  });

const toContentForm = (content) => ({
  title: content?.title ?? "",
  excerpt: content?.excerpt ?? "",
  accents: wordsToText(content?.titleAccents),
  sections: (content?.sections ?? []).map((s) => ({
    heading: s.heading,
    accents: wordsToText(s.accents),
    body: s.body,
  })),
});

const toFormValues = (post) => ({
  slug: post?.id ?? "",
  published: post?.status === "published",
  publishedAt: post?.publishedAt ?? "",
  author: post?.author ?? "ESM Limo",
  image: post?.image ?? null,
  heroImage: post?.heroImage ?? null,
  en: toContentForm(post?.content?.en),
  ar: toContentForm(post?.content?.ar),
});

const toContent = (form) => ({
  title: form.title.trim(),
  excerpt: form.excerpt.trim(),
  titleAccents: textToWords(form.accents),
  sections: form.sections
    .filter((s) => s.heading.trim() || s.body.trim())
    .map((s) => ({
      heading: s.heading.trim(),
      accents: textToWords(s.accents),
      body: s.body.trim(),
    })),
});

const toPayload = (values) => ({
  status: values.published ? "published" : "draft",
  // Publishing without a date publishes today.
  publishedAt: values.published
    ? values.publishedAt || today()
    : values.publishedAt,
  author: values.author.trim(),
  image: values.image,
  heroImage: values.heroImage,
  content: { en: toContent(values.en), ar: toContent(values.ar) },
});

// /admin/blog/new and /admin/blog/:id
export default function PostEditorPage() {
  const { id } = useParams();
  const { t } = useTranslation("admin");
  const location = useLocation();
  const backTo = `${adminPath("blog")}${location.state?.listSearch ?? ""}`;
  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPostQuery(id, {
    skip: !id,
  });

  const backLink = (
    <Link
      to={backTo}
      className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors"
    >
      <ArrowLeft size={16} className="rtl:-scale-x-100" />
      {t("blog.backToList")}
    </Link>
  );

  if (!id)
    return <PostEditor post={null} backTo={backTo} backLink={backLink} />;

  if (isLoading) {
    return (
      <>
        {backLink}
        <AdminMessage icon={Loader2} spin title={t("common.loading")} />
      </>
    );
  }

  if (isError) {
    const missing = error?.status === 404;
    return (
      <>
        {backLink}
        <div className={`${ADMIN_CARD} mt-4`}>
          <AdminMessage
            icon={missing ? SearchX : AlertCircle}
            title={missing ? t("blog.notFound") : t("common.loadFailed")}
            action={
              !missing && (
                <button
                  type="button"
                  className={ADMIN_BUTTON}
                  onClick={refetch}
                >
                  {t("common.retry")}
                </button>
              )
            }
          />
        </div>
      </>
    );
  }

  return (
    <PostEditor key={post.id} post={post} backTo={backTo} backLink={backLink} />
  );
}

function PostEditor({ post, backTo, backLink }) {
  const { t } = useTranslation("admin");
  const navigate = useNavigate();
  const can = useCan();
  const isNew = !post;
  const canEdit = can(isNew ? P.blog.create : P.blog.update);

  const [lang, setLang] = useState("en");
  const [result, setResult] = useState(null); // { ok } | { error }
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(postSchema(t)),
    defaultValues: toFormValues(post),
  });
  const { blocker, allowLeave } = useUnsavedChanges(isDirty);

  const onSubmit = async (values) => {
    setResult(null);
    try {
      if (isNew) {
        const created = await createPost({
          id: values.slug.trim(),
          ...toPayload(values),
        }).unwrap();
        // Keep editing the new post at its own address.
        allowLeave();
        navigate(`${adminPath("blog")}/${created.id}`, { replace: true });
        return;
      }
      const saved = await updatePost({
        id: post.id,
        ...toPayload(values),
      }).unwrap();
      reset(toFormValues(saved));
      setResult({ ok: true });
    } catch (failure) {
      setResult({
        error: t(`blog.errors.${failure?.message}`, {
          defaultValue: t("common.actionFailed"),
        }),
      });
    }
  };

  // The only required field is the English title: show it if it's missing.
  const onInvalid = (formErrors) => {
    if (formErrors.en) setLang("en");
  };

  const remove = async () => {
    try {
      await deletePost(post.id).unwrap();
      allowLeave();
      navigate(backTo, { replace: true });
    } catch {
      setConfirmDelete(false);
      setResult({ error: t("common.actionFailed") });
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
      {backLink}

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <h2 className="text-xl font-semibold text-fg">
          {isNew
            ? t("blog.newTitle")
            : post.content.en.title.replace(/\n/g, " ")}
        </h2>
        {!isNew && (
          <div className="flex gap-2">
            {post.status === "published" && (
              <a
                href={`/blog/${post.id}`}
                target="_blank"
                rel="noreferrer"
                className={`${ADMIN_BUTTON_GHOST}`}
              >
                <ExternalLink size={16} />
                {t("blog.viewOnSite")}
              </a>
            )}
            <Can permission={P.blog.delete}>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-rose-500/30 px-4 text-sm text-rose-400 light:text-rose-700 transition-colors hover:bg-rose-500/10"
              >
                <Trash2 size={16} />
                {t("blog.deletePost")}
              </button>
            </Can>
          </div>
        )}
      </div>

      <fieldset
        disabled={!canEdit}
        className="mt-6 grid gap-4 lg:grid-cols-3 items-start min-w-0"
      >
        <div className="lg:col-span-2 flex flex-col gap-4 min-w-0">
          {/* Content, per language */}
          <section className={`${ADMIN_CARD} p-5 min-w-0`}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                {t("blog.sections.content")}
              </h3>
              <div
                role="tablist"
                className="inline-flex rounded-full border border-line/15 p-1"
              >
                {LANGUAGES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    role="tab"
                    aria-selected={lang === code}
                    onClick={() => setLang(code)}
                    className={`h-8 rounded-full px-4 text-sm transition-colors ${
                      lang === code
                        ? "bg-teal-accent text-page font-semibold"
                        : "text-fg/75 hover:text-fg"
                    }`}
                  >
                    {t(`blog.languages.${code}`)}
                  </button>
                ))}
              </div>
            </div>
            {lang === "ar" && (
              <p className="-mt-2 mb-4 text-sm text-muted">
                {t("blog.arabicHint")}
              </p>
            )}

            {/* Both languages stay mounted (hidden when not shown) so each
                keeps its own sections list. */}
            {LANGUAGES.map((code) => (
              <div key={code} hidden={lang !== code}>
                <LanguageFields
                  lang={code}
                  control={control}
                  register={register}
                  errors={errors[code]}
                  disabled={!canEdit}
                />
              </div>
            ))}
          </section>

          {/* Images: same width as the content card above it */}
          <section className={`${ADMIN_CARD} p-5`}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
              {t("blog.sections.images")}
            </h3>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <span className={ADMIN_LABEL}>{t("blog.fields.image")}</span>
                <p className="-mt-1 mb-3 text-xs text-muted">
                  {t("blog.fields.imageHint")}
                </p>
                <Controller
                  control={control}
                  name="image"
                  render={({ field: { value, onChange } }) => (
                    <ImageUpload
                      value={value}
                      onChange={onChange}
                      label={t("blog.fields.image")}
                    />
                  )}
                />
              </div>
              <div>
                <span className={ADMIN_LABEL}>
                  {t("blog.fields.heroImage")}
                </span>
                <p className="-mt-1 mb-3 text-xs text-muted">
                  {t("blog.fields.heroImageHint")}
                </p>
                <Controller
                  control={control}
                  name="heroImage"
                  render={({ field: { value, onChange } }) => (
                    <ImageUpload
                      value={value}
                      onChange={onChange}
                      label={t("blog.fields.heroImage")}
                    />
                  )}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Publishing */}
        <section className={`${ADMIN_CARD} p-5`}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            {t("blog.sections.publishing")}
          </h3>
          <Controller
            control={control}
            name="published"
            render={({ field: { value, onChange } }) => (
              <label className="flex items-start gap-3">
                <Switch
                  checked={value}
                  onChange={onChange}
                  label={t("blog.fields.published")}
                  className="mt-0.5"
                />
                <span>
                  <span className="block text-[15px] text-fg">
                    {t("blog.fields.published")}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {t("blog.fields.publishedHint")}
                  </span>
                </span>
              </label>
            )}
          />
          <div className="mt-5 flex flex-col gap-4">
            <div>
              <label htmlFor="post-date" className={ADMIN_LABEL}>
                {t("blog.fields.publishedAt")}
              </label>
              <Controller
                control={control}
                name="publishedAt"
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    id="post-date"
                    value={value}
                    onChange={onChange}
                    clearable
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="post-author" className={ADMIN_LABEL}>
                {t("blog.fields.author")}
              </label>
              <input
                id="post-author"
                dir="auto"
                {...register("author")}
                className={ADMIN_INPUT}
              />
            </div>
            <div>
              <label htmlFor="post-slug" className={ADMIN_LABEL}>
                {t("blog.fields.slug")}
              </label>
              <div
                className="flex items-center gap-1 text-sm text-muted"
                dir="ltr"
              >
                <span className="shrink-0">/blog/</span>
                <input
                  id="post-slug"
                  {...register("slug")}
                  readOnly={!isNew}
                  placeholder="my-new-post"
                  className={`${ADMIN_INPUT} read-only:opacity-60`}
                />
              </div>
              {isNew && (
                <p className="mt-1.5 text-xs text-muted">
                  {t("blog.fields.slugHint")}
                </p>
              )}
            </div>
          </div>
        </section>
      </fieldset>

      {canEdit && (
        <div className="sticky bottom-0 z-10 -mx-4 md:-mx-8 mt-6 flex flex-wrap items-center justify-end gap-4 border-t border-line/10 bg-page/90 px-4 md:px-8 py-4 backdrop-blur">
          {result?.ok && !isDirty && (
            <p
              role="status"
              className="me-auto flex items-center gap-2 text-sm text-emerald-400 light:text-emerald-700"
            >
              <CheckCircle2 size={17} />
              {t("blog.saved")}
            </p>
          )}
          {result?.error && (
            <p
              role="alert"
              className="me-auto text-sm text-red-400 light:text-red-600"
            >
              {result.error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSaving || (!isNew && !isDirty)}
            aria-busy={isSaving}
            className={`${ADMIN_BUTTON}`}
          >
            {isSaving && <Loader2 size={17} className="animate-spin" />}
            {isNew ? t("blog.create") : t("blog.save")}
          </button>
        </div>
      )}

      {!isNew && (
        <Can permission={P.blog.delete}>
          <ConfirmDialog
            open={confirmDelete}
            title={t("blog.deleteTitle")}
            body={t("blog.deleteBody")}
            confirmLabel={t("common.delete")}
            busy={isDeleting}
            onConfirm={remove}
            onClose={() => setConfirmDelete(false)}
          />
        </Can>
      )}
      <UnsavedChangesDialog blocker={blocker} />
    </form>
  );
}

// One language's title, highlighted words, summary and sections.
function LanguageFields({ lang, control, register, errors, disabled }) {
  // Labels and hints follow the dashboard's direction; the text fields take
  // the direction of the language written in them.
  const textDir = lang === "ar" ? "rtl" : "ltr";
  const { t } = useTranslation("admin");
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `${lang}.sections`,
  });
  const id = (name) => `post-${lang}-${name}`;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor={id("title")} className={ADMIN_LABEL}>
          {t("blog.fields.title")}
        </label>
        <textarea
          id={id("title")}
          rows={2}
          dir={textDir}
          {...register(`${lang}.title`)}
          aria-invalid={errors?.title ? true : undefined}
          className={`${ADMIN_INPUT} h-auto py-2.5 resize-y`}
        />
        {errors?.title ? (
          <p className={ADMIN_FIELD_ERROR}>{errors.title.message}</p>
        ) : (
          <p className="mt-1.5 text-xs text-muted">
            {t("blog.fields.titleHint")}
          </p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={id("accents")} className={ADMIN_LABEL}>
            {t("blog.fields.accents")}
          </label>
          <input
            id={id("accents")}
            dir={textDir}
            {...register(`${lang}.accents`)}
            className={ADMIN_INPUT}
          />
          <p className="mt-1.5 text-xs text-muted">
            {t("blog.fields.accentsHint")}
          </p>
        </div>
        <div>
          <label htmlFor={id("excerpt")} className={ADMIN_LABEL}>
            {t("blog.fields.excerpt")}
          </label>
          <input
            id={id("excerpt")}
            dir={textDir}
            {...register(`${lang}.excerpt`)}
            className={ADMIN_INPUT}
          />
          <p className="mt-1.5 text-xs text-muted">
            {t("blog.fields.excerptHint")}
          </p>
        </div>
      </div>

      <div className="mt-2">
        <span className={ADMIN_LABEL}>{t("blog.fields.sectionsLabel")}</span>
        <ol className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <li key={field.id} className="rounded-xl border border-line/10 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-muted">
                  {t("blog.fields.sectionNumber", { number: index + 1 })}
                </span>
                {!disabled && (
                  <div className="flex items-center gap-1">
                    <SmallIconButton
                      icon={ArrowUp}
                      label={t("blog.fields.moveUp")}
                      disabled={index === 0}
                      onClick={() => move(index, index - 1)}
                    />
                    <SmallIconButton
                      icon={ArrowDown}
                      label={t("blog.fields.moveDown")}
                      disabled={index === fields.length - 1}
                      onClick={() => move(index, index + 1)}
                    />
                    <SmallIconButton
                      icon={Trash2}
                      danger
                      label={t("blog.fields.removeSection")}
                      onClick={() => remove(index)}
                    />
                  </div>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  dir={textDir}
                  {...register(`${lang}.sections.${index}.heading`)}
                  aria-label={t("blog.fields.heading")}
                  placeholder={t("blog.fields.heading")}
                  className={ADMIN_INPUT}
                />
                <input
                  dir={textDir}
                  {...register(`${lang}.sections.${index}.accents`)}
                  aria-label={t("blog.fields.accents")}
                  placeholder={t("blog.fields.accents")}
                  className={ADMIN_INPUT}
                />
              </div>
              <textarea
                dir={textDir}
                {...register(`${lang}.sections.${index}.body`)}
                aria-label={t("blog.fields.body")}
                placeholder={t("blog.fields.body")}
                rows={5}
                className={`${ADMIN_INPUT} mt-3 h-auto py-3 leading-7 resize-y`}
              />
            </li>
          ))}
        </ol>
        {!disabled && (
          <button
            type="button"
            onClick={() => append({ heading: "", accents: "", body: "" })}
            className={`${ADMIN_BUTTON_GHOST} mt-3`}
          >
            <Plus size={16} />
            {t("blog.fields.addSection")}
          </button>
        )}
      </div>
    </div>
  );
}
