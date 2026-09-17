import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../common/TextField.jsx";
import TextAreaField from "../common/TextAreaField.jsx";
import PrimaryButton from "../common/PrimaryButton.jsx";
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

export default function CommentForm({ postId }) {
  const dispatch = useDispatch();
  const status = useSelector(selectCommentStatus);
  const remembered = useSelector(selectRememberedAuthor);

  const { control, register, handleSubmit, reset } = useForm({
    resolver: zodResolver(commentSchema),
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
    <section className="border-b border-white/5">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h2 className="text-center text-lg font-medium text-teal-accent mb-8">
          Leave A Reply
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <ControlledField
              control={control}
              name="name"
              as={TextField}
              transform={sanitizeName}
              label="Name"
            />
            <ControlledField
              control={control}
              name="email"
              as={TextField}
              label="Email"
              type="email"
            />
          </div>
          <ControlledField
            control={control}
            name="website"
            as={TextField}
            label="Website"
          />
          <ControlledField
            control={control}
            name="comment"
            as={TextAreaField}
            label="Comment"
          />
          <label className="flex items-center gap-2 text-xs text-gray-500">
            <input type="checkbox" {...register("rememberMe")} />
            Save My Name, Email, And Website In This Browser For The Next Time I
            Comment.
          </label>
          <PrimaryButton
            type="submit"
            disabled={status === SUBMIT_STATUS.SUBMITTING}
          >
            {status === SUBMIT_STATUS.SUBMITTING
              ? "Posting..."
              : "Post Comment"}
          </PrimaryButton>
          {status === SUBMIT_STATUS.SUCCESS ? (
            <p className="text-xs text-teal-accent">Comment posted.</p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
