import { useRef, useState } from "react";
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
        <FloatingLabel text={placeholder} active={isFloating} />
      )}

      {/* Custom placeholder */}
      {showCustomPlaceholder && (
        <span
          onClick={handlePlaceholderClick}
          className="
            absolute
            left-0
            top-0
            z-10
            cursor-pointer
            text-fg
            font-display
            font-semibold
            text-[22px]
            leading-[100%]
            capitalize
          "
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
