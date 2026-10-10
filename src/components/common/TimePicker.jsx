import { useState } from "react";
import { useTranslation } from "react-i18next";
import FloatingLabel from "./FloatingLabel.jsx";

export default function TimePicker({
  value,
  onChange,
  placeholder = "Select Time",
  floatingLabelClassName,
  fieldClassName = "",
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const [isOpen, setIsOpen] = useState(false);

  const [hour, setHour] = useState("08");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  function handleConfirm() {
    const formattedTime = `${hour}:${minute} ${period}`;

    onChange({
      target: {
        name: "time",
        value: formattedTime,
      },
    });

    setIsOpen(false);
  }

  const isFloating = isOpen || !!value;

  return (
    <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Field */}
      <FloatingLabel
        text={placeholder}
        active={isFloating}
        inactiveClassName={floatingLabelClassName}
      />

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`
          w-full
          min-h-[42px]
          text-start
          bg-transparent
          border-b
          border-line
          py-2
          text-fg
          font-display
          font-semibold
          text-[18px]
          max-md:text-base
          leading-[100%]
          capitalize
          ${isRTL ? "text-right" : "text-left"}
          ${fieldClassName}
        `}
      >
        {value}
      </button>

      {/* Custom Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-page/50 max-md:px-2"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div
            className="
              w-[260px]
              max-w-full
              max-md:p-4
              rounded-[16px]
              bg-page
              border
              border-line/20
              p-[18px]
              shadow-2xl
              font-display
            "
          >
            <h3 className="text-fg text-[18px] font-semibold mb-4 text-center">
              {t("booking.selectTime")}
            </h3>

            <div className="flex justify-center items-center gap-2 max-md:gap-1.5">
              {/* Hours */}
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="
                  w-[60px]
                  h-[42px]
                  max-md:min-w-0
                  max-md:h-[44px]
                  bg-white
                  text-black
                  border
                  border-black
                  text-[16px]
                  text-center
                  rounded-[8px]
                  outline-none
                "
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const h = String(i + 1).padStart(2, "0");

                  return (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  );
                })}
              </select>

              <span className="text-fg text-[20px]">:</span>

              {/* Minutes */}
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="
                  w-[60px]
                  h-[42px]
                  max-md:min-w-0
                  max-md:h-[44px]
                  bg-white
                  text-black
                  border
                  border-black
                  text-[16px]
                  text-center
                  rounded-[8px]
                  outline-none
                "
              >
                {Array.from({ length: 60 }, (_, i) => {
                  const m = String(i).padStart(2, "0");

                  return (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  );
                })}
              </select>

              {/* AM / PM */}
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="
                  w-[60px]
                  h-[42px]
                  max-md:min-w-0
                  max-md:h-[44px]
                  bg-white
                  text-black
                  border
                  border-black
                  text-[16px]
                  text-center
                  rounded-[8px]
                  outline-none
                "
              >
                <option value="AM">{isRTL ? "ص" : "AM"}</option>

                <option value="PM">{isRTL ? "م" : "PM"}</option>
              </select>
            </div>

            {/* Cancel on the left, Done on the right in both languages */}
            <div
              dir="ltr"
              className="flex justify-center gap-4 mt-5 max-md:gap-3"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="
                  w-[90px]
                  max-md:flex-1
                  max-md:w-auto
                  h-[38px] text-[14px]
                  rounded-[8px]
                  border
                  border-line
                  text-fg
                  font-semibold
                "
              >
                {t("booking.cancel")}
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="
                  w-[90px]
                  max-md:flex-1
                  max-md:w-auto
                  h-[38px] text-[14px]
                  rounded-[8px]
                  bg-teal-accent
                  text-page
                  border
                  border-black
                  font-semibold
                "
              >
                {t("booking.done")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
