import { useState } from "react";
import { useTranslation } from "react-i18next";
import FloatingLabel from "./FloatingLabel.jsx";

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select Date",
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const [isOpen, setIsOpen] = useState(false);

  const today = new Date();

  const [month, setMonth] = useState(
    String(today.getMonth() + 1).padStart(2, "0")
  );
  const [day, setDay] = useState(String(today.getDate()).padStart(2, "0"));
  const [year, setYear] = useState(String(today.getFullYear()));

  const months = [
    { value: "01", label: t("booking.months.january") },
    { value: "02", label: t("booking.months.february") },
    { value: "03", label: t("booking.months.march") },
    { value: "04", label: t("booking.months.april") },
    { value: "05", label: t("booking.months.may") },
    { value: "06", label: t("booking.months.june") },
    { value: "07", label: t("booking.months.july") },
    { value: "08", label: t("booking.months.august") },
    { value: "09", label: t("booking.months.september") },
    { value: "10", label: t("booking.months.october") },
    { value: "11", label: t("booking.months.november") },
    { value: "12", label: t("booking.months.december") },
  ];

  const years = Array.from(
    { length: 11 },
    (_, index) => today.getFullYear() + index
  );

  const days = Array.from({ length: 31 }, (_, index) =>
    String(index + 1).padStart(2, "0")
  );

  function handleConfirm() {
    const formattedDate = `${month}/${day}/${year}`;

    onChange({
      target: {
        name: "date",
        value: formattedDate,
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
      <FloatingLabel
        text={placeholder}
        active={isFloating}
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
          text-[22px]
          max-md:text-[17px]
          leading-[100%]
          capitalize
          ${isRTL ? "text-right" : "text-left"}
        `}
      >
        {value}
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-page/50 max-md:px-2"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div
            className="
              w-[380px]
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
              {t("booking.selectDate")}
            </h3>

            <div className="flex justify-center items-center gap-3 max-md:gap-2">
              {/* Month */}
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="
                  w-[125px]
                  h-[55px]
                  max-md:min-w-0
                  max-md:h-[48px]
                  bg-white
                  text-black
                  text-[16px]
                  text-center
                  rounded-[8px]
                  outline-none
                "
              >
                {months.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              {/* Day */}
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
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
                {days.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* Year */}
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="
                  w-[95px]
                  h-[55px]
                  max-md:min-w-0
                  max-md:h-[48px]
                  bg-white
                  text-black
                  text-[18px]
                  text-center
                  rounded-[8px]
                  outline-none
                "
              >
                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
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