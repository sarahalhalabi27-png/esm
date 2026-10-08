import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../common/TextField.jsx";
import HollowButton from "../common/HollowButton.jsx";
import DrawnCheck from "../common/DrawnCheck.jsx";
import useFormReveal from "../common/useFormReveal.js";
import {
  FOCUS_FILL,
  FORM_CARD,
  FORM_CARD_DARK_IN_LIGHT,
  FORM_TITLE,
} from "../common/formStyles.js";
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

// Same look as the car reservation form (card, underlined fields, hollow
// button), with the Figma's 22px labels: name / email, website /
// comment in two columns, a "remember me" checkbox, then "Post Comment".
// Light mode draws the form on the same dark #072E2A card as the car
// reservation (FORM_CARD_DARK_IN_LIGHT).
// Same field metrics and 0.5px white/35% underline as the car reservation form.
const UNDERLINE = "!border-b-[0.5px] !border-white/35";
const FIELD = `!min-h-0 !h-[37px] !py-0 !pb-[10px] ${UNDERLINE} ${FOCUS_FILL} !font-display !font-medium !text-[22px] !leading-[27px] !tracking-[0%] max-md:!text-[16px]`;
const LABEL =
  "top-0 text-[22px] leading-[27px] font-medium text-fg max-md:text-[16px]";
// Remember-me box (Figma: 20 x 20, radius 3, 0.5px white/80% border); filled
// with the accent and a check when ticked (white fill in light mode, where
// the card is dark).
const SENT_FLASH_MS = 1800;

const CHECKBOX = `appearance-none w-5 h-5 shrink-0 rounded-[3px] border-[0.5px] border-white/80 bg-transparent bg-center bg-no-repeat cursor-pointer checked:bg-[#24B9A5] checked:[background-image:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2020%2020'%20fill='none'%20stroke='white'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Cpath%20d='M5%2010.5l3.5%203.5L15%206.5'/%3E%3C/svg%3E")] light:checked:bg-white light:checked:[background-image:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2020%2020'%20fill='none'%20stroke='%23072E2A'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Cpath%20d='M5%2010.5l3.5%203.5L15%206.5'/%3E%3C/svg%3E")] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 max-md:mt-0.5`;
const fieldProps = {
  inputClassName: FIELD,
  floatingLabelClassName: LABEL,
};

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

  const { control, register, handleSubmit, reset } = useForm({
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
    <section className="font-display px-[47px] mt-[138px] mb-[120px] max-md:px-6 max-md:mt-14 max-md:mb-16">
      <div
        ref={cardRef}
        className={`${FORM_CARD} ${FORM_CARD_DARK_IN_LIGHT} md:!pt-[28px] pb-[41px]`}
      >
        <h2 className={`${FORM_TITLE} light:!text-white`}>
          {t("blogPost.comment.title")}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-[28px] max-md:mt-10"
        >
          <div className="grid grid-cols-2 gap-x-[252px] gap-y-[62px] max-lg:gap-x-12 max-md:grid-cols-1 max-md:gap-y-[36px]">
            <ControlledField
              control={control}
              name="name"
              as={TextField}
              transform={sanitizeName}
              placeholder={t("blogPost.comment.name")}
              autoComplete="name"
              {...fieldProps}
              inputClassName={`${FIELD} capitalize`}
            />
            <ControlledField
              control={control}
              name="email"
              as={TextField}
              type="email"
              placeholder={t("blogPost.comment.email")}
              autoComplete="email"
              {...fieldProps}
            />
            <ControlledField
              control={control}
              name="website"
              as={TextField}
              type="url"
              placeholder={t("blogPost.comment.website")}
              autoComplete="url"
              {...fieldProps}
            />
            <ControlledField
              control={control}
              name="comment"
              as={TextField}
              placeholder={t("blogPost.comment.comment")}
              {...fieldProps}
            />
          </div>

          <label className="mt-[35px] flex items-start gap-4 text-start text-[20px] font-normal leading-[1.7] capitalize text-white/80 cursor-pointer max-md:gap-3 max-md:text-[14px] max-md:leading-[1.8]">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className={`${CHECKBOX} mt-[7px] max-md:mt-[4px]`}
            />
            {t("blogPost.comment.remember")}
          </label>

          <div className="relative mt-[123px] flex justify-center max-md:mt-10">
            <HollowButton
              onDark
              type="submit"
              className="!relative !w-[266px] !border !border-white !px-[47px] !py-[13px] !text-[22px] !leading-[27px] max-md:!w-auto max-md:!px-8 max-md:!py-3 max-md:!text-[18px]"
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
            </HollowButton>
            {status === SUBMIT_STATUS.SUCCESS ? (
              <p
                className="absolute top-full mt-3 text-sm text-teal-accent"
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
