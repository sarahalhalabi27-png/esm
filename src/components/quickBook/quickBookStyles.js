import { FOCUS_FILL } from "../common/formStyles.js";

// The quick-booking forms' field look, the same as the car reservation form:
// 37px underlined lines with Medium 22px labels resting on them that float up
// on focus (0.5px white/35% underline).
export const FIELD = `!min-h-0 !h-[37px] !py-0 !pb-[10px] !border-b-[0.5px] !border-white/35 ${FOCUS_FILL} !font-medium !text-[22px] !leading-[27px] max-md:!text-[17px]`;

export const LABEL =
  "top-0 text-[22px] leading-[27px] font-medium text-fg max-md:text-[17px]";

// Props for TextField
export const fieldProps = {
  inputClassName: `${FIELD} !font-display !tracking-[0%] capitalize`,
  floatingLabelClassName: LABEL,
};

// Props for DatePicker / TimePicker / the dropdowns
export const pickerProps = {
  fieldClassName: FIELD,
  floatingLabelClassName: LABEL,
};
