import { useState } from "react";
import { useTranslation } from "react-i18next";
import FloatingLabel from "./FloatingLabel.jsx";

export default function TimePicker({
  value,
  onChange,
  placeholder = "Select Time",
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
    <div
      className="relative"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Field */}
      <FloatingLabel text={placeholder} active={isFloating} />

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
          text-[22px]
          max-md:text-[17px]
          leading-[100%]
          capitalize
          ${isRTL ? "text-right" : "text-left"}
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
              w-[320px]
              max-w-full
              max-md:p-5
              rounded-[20px]
              bg-page
              border
              border-line/20
              p-[25px]
              shadow-2xl
              font-display
            "
          >
            <h3 className="text-fg text-[22px] font-semibold mb-6 text-center">
              {t("booking.selectTime")}
            </h3>

            <div className="flex justify-center items-center gap-3 max-md:gap-2">
              {/* Hours */}
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="
                  w-[75px]
                  h-[55px]
                  max-md:min-w-0
                  max-md:h-[48px]
                  bg-white
                  text-black
                  text-[20px]
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

              <span className="text-fg text-[24px]">:</span>

              {/* Minutes */}
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="
                  w-[75px]
                  h-[55px]
                  max-md:min-w-0
                  max-md:h-[48px]
                  bg-white
                  text-black
                  text-[20px]
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
                  w-[75px]
                  h-[55px]
                  max-md:min-w-0
                  max-md:h-[48px]
                  bg-white
                  text-black
                  text-[20px]
                  text-center
                  rounded-[8px]
                  outline-none
                "
              >
                <option value="AM">
                  {isRTL ? "ص" : "AM"}
                </option>

                <option value="PM">
                  {isRTL ? "م" : "PM"}
                </option>
              </select>
            </div>

            <div className="flex justify-center gap-4 mt-7 max-md:gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="
                  w-[110px]
                  max-md:flex-1
                  max-md:w-auto
                  h-[45px]
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
                  w-[110px]
                  max-md:flex-1
                  max-md:w-auto
                  h-[45px]
                  rounded-[8px]
                  bg-teal-accent
                  text-black
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