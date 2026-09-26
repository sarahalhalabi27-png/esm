import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import FloatingLabel from "./FloatingLabel.jsx";

export default function TextField({
  label,
  labelClassName,
  name,
  type = "text",
  required,
  className = "",
  inputClassName = "",
  placeholder,
  value,
  onChange,
  ...rest
}) {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const isDateOrTime = type === "date" || type === "time";
  const showCustomPlaceholder = isDateOrTime && !value && !isFocused;
  const isFloating = isFocused || !!value;

  function handlePlaceholderClick() {
    setIsFocused(true);
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  }

  function handleFocus(event) {
    setIsFocused(true);
    rest.onFocus?.(event);
  }

  function handleBlur(event) {
    setIsFocused(false);
    rest.onBlur?.(event);
  }

  return (
    <label className={`block relative ${className}`}>
      {/* Floating label for regular text fields */}
      {!isDateOrTime && placeholder && (
        <FloatingLabel
          text={placeholder}
          active={isFloating}
          className={isRTL ? "text-right" : "text-left"}
        />
      )}

      {/* Custom placeholder for date/time fields */}
      {showCustomPlaceholder && (
        <span
          onClick={handlePlaceholderClick}
          className={`
            absolute
            ${isRTL ? "right-0" : "left-0"}
            top-0
            z-10
            cursor-pointer
            text-fg
            font-display
            font-semibold
            text-[22px]
            leading-[100%]
            capitalize
            ${isRTL ? "text-right" : "text-left"}
          `}
        >
          {placeholder}
        </span>
      )}

      <input
        ref={inputRef}
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={undefined}
        dir={isRTL ? "rtl" : "ltr"}
        className={`
          w-full
          bg-transparent
          border-b
          border-line/15
          focus:border-teal-accent
          outline-none
          py-2
          text-sm
          text-fg
          placeholder:text-fg
          transition-colors
          ${isRTL ? "text-right" : "text-left"}

          ${
            isDateOrTime && !value && !isFocused
              ? "[&::-webkit-datetime-edit]:text-transparent"
              : "[&::-webkit-datetime-edit]:text-fg"
          }

          ${inputClassName}
        `}
        {...rest}
      />
    </label>
  );
}