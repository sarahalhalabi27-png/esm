import { useState } from "react";
import FloatingLabel from "./FloatingLabel.jsx";

export default function TimePicker({
  value,
  onChange,
  placeholder = "Select Time",
}) {
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
    <div className="relative">
      {/* Field */}
      <FloatingLabel text={placeholder} active={isFloating} />
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="
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
          leading-[100%]
          capitalize
        "
      >
        {value}
      </button>

      {/* Custom Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-page/50">
          <div
            className="
              w-[320px]
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
              Select Time
            </h3>

            <div className="flex justify-center items-center gap-3">
              {/* Hours */}
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="
                  w-[75px]
                  h-[55px]
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
                  bg-white
                  text-black
                  text-[20px]
                  text-center
                  rounded-[8px]
                  outline-none
                "
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>

            <div className="flex justify-center gap-4 mt-7">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="
                  w-[110px]
                  h-[45px]
                  rounded-[8px]
                  border
                  border-line
                  text-fg
                  font-semibold
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="
                  w-[110px]
                  h-[45px]
                  rounded-[8px]
                  bg-teal-accent
                  text-black
                  font-semibold
                "
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
