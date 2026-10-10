import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Mail } from "lucide-react";
import DrawnCheck from "../common/DrawnCheck.jsx";
import useFormReveal from "../common/useFormReveal.js";
import {
  BOOKING_CARD,
  BOOKING_FIELDS,
  BOOKING_THREE_COLUMNS,
  BOOKING_TITLE,
  BookingCheckbox,
  BookingHairline,
  BookingInput,
  BookingTextArea,
  BookingButton,
} from "../common/BookingFields.jsx";
import ControlledField from "../common/ControlledField.jsx";
import { commentSchema } from "../../schemas/formSchemas.js";
import { sanitizeName } from "../../utils/validators.js";
import {
  submitComment,
  resetCommentStatus,
  selectCommentStatus,
} from "../../store/commentSlice.js";
import {
  saveAuthor,
  clearAuthor,
  selectRememberedAuthor,
} from "../../store/authorSlice.js";
import { SUBMIT_STATUS } from "../../store/constants.js";

const SENT_FLASH_MS = 1800;

// "Leave A Reply": the booking-card look shared with the other forms
// (common/BookingFields.jsx), at most 880px wide and centred - name, email and
// website in a row, the comment box (112px tall), the "remember me" tick box
// and "Post Comment".
export default function CommentForm({ postId }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const status = useSelector(selectCommentStatus);
  const remembered = useSelector(selectRememberedAuthor);
  const cardRef = useFormReveal(i18n.dir() === "rtl", { replay: true });
  // Briefly show a drawn tick in the button once a comment is posted (as in
  // the car reservation form).
  const [sentFlash, setSentFlash] = useState(false);
  useEffect(() => {
    if (!sentFlash) return undefined;
    const timer = setTimeout(() => setSentFlash(false), SENT_FLASH_MS);
    return () => clearTimeout(timer);
  }, [sentFlash]);

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(commentSchema(t)),
    // Pre-fill identity fields from the persisted "Remember Me" data.
    defaultValues: {
      name: remembered.name,
      email: remembered.email,
      website: remembered.website,
      comment: "",
      rememberMe: remembered.remember,
    },
  });

  // Reset any leftover status when the form mounts.
  useEffect(() => {
    dispatch(resetCommentStatus());
  }, [dispatch]);

  const onSubmit = async (values) => {
    try {
      await dispatch(submitComment({ postId, payload: values })).unwrap();

      // Persist or forget the commenter's identity based on the checkbox.
      if (values.rememberMe) {
        dispatch(
          saveAuthor({
            name: values.name,
            email: values.email,
            website: values.website,
          })
        );
      } else {
        dispatch(clearAuthor());
      }

      // Keep identity fields when remembered; always clear the comment body.
      reset({
        name: values.rememberMe ? values.name : "",
        email: values.rememberMe ? values.email : "",
        website: values.rememberMe ? values.website : "",
        comment: "",
        rememberMe: values.rememberMe,
      });
      setSentFlash(true);
    } catch {
      // status is set to "error" by the slice
    }
  };

  return (
    <section className="font-display px-6 md:px-10 lg:px-[50px] mt-[138px] mb-[120px] max-md:mt-14 max-md:mb-16">
      <div
        ref={cardRef}
        className={`${BOOKING_CARD} [--area-h:7rem] mx-auto max-w-[880px] lg:px-10`}
      >
        <h2 className={BOOKING_TITLE}>{t("blogPost.comment.title")}</h2>
        <BookingHairline />

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={BOOKING_FIELDS}
        >
          <div className={BOOKING_THREE_COLUMNS}>
            <ControlledField
              control={control}
              name="name"
              as={BookingInput}
              transform={sanitizeName}
              label={t("blogPost.comment.name")}
              placeholder={t("booking.namePlaceholder")}
              autoComplete="name"
              required
            />
            <ControlledField
              control={control}
              name="email"
              as={BookingInput}
              type="email"
              icon={Mail}
              label={t("blogPost.comment.email")}
              placeholder={t("formPlaceholders.email")}
              autoComplete="email"
              required
            />
            <ControlledField
              control={control}
              name="website"
              as={BookingInput}
              type="url"
              icon={Globe}
              label={t("blogPost.comment.website")}
              placeholder={t("formPlaceholders.website")}
              autoComplete="url"
            />
          </div>

          <ControlledField
            control={control}
            name="comment"
            as={BookingTextArea}
            label={t("blogPost.comment.comment")}
            placeholder={t("formPlaceholders.comment")}
            required
          />

          <ControlledField
            control={control}
            name="rememberMe"
            as={BookingCheckbox}
            label={t("blogPost.comment.remember")}
          />

          {/* The success note hangs below the button, outside the flow, so it
              doesn't change the card's height. */}
          <div className="relative flex justify-center">
            <BookingButton
              type="submit"
              className="px-12 max-md:w-full"
              disabled={status === SUBMIT_STATUS.SUBMITTING}
            >
              {/* The label keeps the button's size while the tick shows */}
              <span className={sentFlash ? "invisible" : undefined}>
                {status === SUBMIT_STATUS.SUBMITTING
                  ? t("blogPost.comment.posting")
                  : t("blogPost.comment.submit")}
              </span>
              {sentFlash && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <DrawnCheck />
                </span>
              )}
            </BookingButton>
            {status === SUBMIT_STATUS.SUCCESS ? (
              <p
                className="absolute top-full mt-3 text-sm text-[#24B9A5]"
                role="status"
              >
                {t("blogPost.comment.success")}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
