import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Clock, Info, Loader2 } from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_CARD,
  ADMIN_CARD_RICH,
} from "../../components/ui.js";
import {
  useGetContentQuery,
  useSaveContentMutation,
} from "../../api/contentApi.js";
import useCan from "../../hooks/useCan.js";
import { P } from "../../permissions.js";
import { formatDateTime } from "../../utils/format.js";
import UnsavedChangesDialog from "../../components/UnsavedChangesDialog.jsx";
import useUnsavedChanges from "../../hooks/useUnsavedChanges.js";

// Loads one content block, lets `children` edit it and saves it whole.
// `children` is a function getting the react-hook-form methods (control,
// register, errors, ...) and `canEdit`. Without content.update the form is
// read-only.
export default function ContentForm({ contentKey, schema, hint, children }) {
  const { t } = useTranslation("admin");
  const { data, isLoading, isError, refetch } = useGetContentQuery(contentKey);

  if (isLoading) {
    return <AdminMessage icon={Loader2} spin title={t("common.loading")} />;
  }
  if (isError) {
    return (
      <div className={ADMIN_CARD}>
        <AdminMessage
          icon={AlertCircle}
          title={t("common.loadFailed")}
          action={
            <button type="button" className={ADMIN_BUTTON} onClick={refetch}>
              {t("common.retry")}
            </button>
          }
        />
      </div>
    );
  }

  return (
    <EditForm
      key={contentKey}
      contentKey={contentKey}
      data={data}
      schema={schema}
      hint={hint}
    >
      {children}
    </EditForm>
  );
}

const withoutMeta = ({ updatedAt, ...value }) => value;

function EditForm({ contentKey, data, schema, hint, children }) {
  const { t, i18n } = useTranslation("admin");
  const can = useCan();
  const canEdit = can(P.content.update);
  const [saveContent, { isLoading: isSaving }] = useSaveContentMutation();
  const [result, setResult] = useState(null); // "saved" | "failed"

  const form = useForm({
    resolver: zodResolver(schema(t)),
    defaultValues: withoutMeta(data),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form;
  const { blocker } = useUnsavedChanges(isDirty);

  const onSubmit = async (values) => {
    setResult(null);
    try {
      const saved = await saveContent({
        key: contentKey,
        value: values,
      }).unwrap();
      reset(withoutMeta(saved));
      setResult("saved");
    } catch {
      setResult("failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div
        className={`${ADMIN_CARD_RICH} mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-4 text-sm text-muted`}
      >
        <p className="flex min-w-0 items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sky-400/15 text-sky-300 light:bg-sky-500/15 light:text-sky-700">
            <Info size={16} />
          </span>
          {hint}
        </p>
        <p className="flex items-center gap-1.5">
          <Clock size={14} className="shrink-0" />
          {t("content.lastUpdated", {
            date: formatDateTime(data.updatedAt, i18n.language),
          })}
        </p>
      </div>

      <fieldset disabled={!canEdit} className="flex flex-col gap-4 min-w-0">
        {children({ ...form, errors, canEdit })}
      </fieldset>

      {canEdit && (
        <div className="sticky bottom-0 z-10 -mx-4 md:-mx-8 mt-6 flex flex-wrap items-center justify-end gap-4 border-t border-line/10 bg-page/90 px-4 md:px-8 py-4 backdrop-blur">
          {result === "saved" && !isDirty && (
            <p
              role="status"
              className="me-auto flex items-center gap-2 text-sm text-emerald-400 light:text-emerald-700"
            >
              <CheckCircle2 size={17} />
              {t("content.saved")}
            </p>
          )}
          {result === "failed" && (
            <p
              role="alert"
              className="me-auto text-sm text-red-400 light:text-red-600"
            >
              {t("common.actionFailed")}
            </p>
          )}
          <button
            type="submit"
            disabled={isSaving || !isDirty}
            aria-busy={isSaving}
            className={`${ADMIN_BUTTON}`}
          >
            {isSaving && <Loader2 size={17} className="animate-spin" />}
            {t("content.save")}
          </button>
        </div>
      )}
      <UnsavedChangesDialog blocker={blocker} />
    </form>
  );
}
