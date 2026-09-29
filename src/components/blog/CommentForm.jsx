import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../common/TextField.jsx";
import OutlineButton from "../common/OutlineButton.jsx";
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
// button), with the Figma's smaller 18px labels: name / email, website /
// comment in two columns, a "remember me" checkbox, then "Post Comment".
const FIELD =
  "!min-h-0 !h-[33px] !py-0 !pb-[8px] !border-b-[0.5px] !border-white/60 light:!border-[#072E2A]/40 bg-no-repeat [background-image:linear-gradient(rgb(var(--accent)),rgb(var(--accent)))] [background-size:0%_1.5px] [background-position:left_bottom] rtl:[background-position:right_bottom] !transition-[background-size] !duration-500 !ease-out focus:[background-size:100%_1.5px] !font-display !font-medium !text-[18px] !leading-[25px] !tracking-[0%] max-md:!text-[16px]";
const LABEL =
  "top-0 text-[18px] leading-[25px] font-medium text-fg max-md:text-[16px]";
const fieldProps = {
  inputClassName: FIELD,
  floatingLabelClassName: LABEL,
};

export default function CommentForm({ postId }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const status = useSelector(selectCommentStatus);
  const remembered = useSelector(selectRememberedAuthor);

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
    } catch {
      // status is set to "error" by the slice
    }
  };

  return (
    <section className="font-display px-[47px] mt-[138px] mb-[120px] max-md:px-6 max-md:mt-14 max-md:mb-16">
      <div className="rounded-[25px] border border-white/60 light:border-[#072E2A]/25 bg-[#24B9A5]/10 ps-[74px] pe-[72px] pt-[41px] pb-[48px] max-lg:px-10 max-md:rounded-[20px] max-md:px-5 max-md:pt-8 max-md:pb-10">
        <h2 className="text-center text-[25px] font-medium leading-[30px] tracking-[0.07em] capitalize text-fg light:text-[#072E2A] max-md:text-lg max-md:tracking-[0.04em]">
          {t("blogPost.comment.title")}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-[49px] max-md:mt-10"
        >
          <div className="grid grid-cols-2 gap-x-[252px] gap-y-[55px] max-lg:gap-x-12 max-md:grid-cols-1 max-md:gap-y-[36px]">
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

          <label className="mt-[30px] flex items-center gap-3 text-[15px] leading-[20px] capitalize text-fg/80 cursor-pointer max-md:items-start max-md:text-[14px]">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="w-4 h-4 shrink-0 accent-[#24B9A5] light:accent-[#072E2A] max-md:mt-0.5"
            />
            {t("blogPost.comment.remember")}
          </label>

          <div className="relative mt-[70px] flex justify-center max-md:mt-10">
            <OutlineButton
              type="submit"
              className="!relative !px-[47px] !py-[13px] !border-line !bg-transparent !backdrop-blur-none !text-fg hover:!bg-white hover:!text-[#072E2A] light:!border-[#072E2A] light:!text-[#072E2A] light:hover:!bg-[#072E2A] light:hover:!text-white !font-semibold !text-[20px] !leading-[27px] max-md:!px-8 max-md:!py-3 max-md:!text-[18px]"
              disabled={status === SUBMIT_STATUS.SUBMITTING}
            >
              {status === SUBMIT_STATUS.SUBMITTING
                ? t("blogPost.comment.posting")
                : t("blogPost.comment.submit")}
            </OutlineButton>
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
