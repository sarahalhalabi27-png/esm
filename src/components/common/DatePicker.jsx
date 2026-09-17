import { useState } from "react";

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select Date",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date();

  const [month, setMonth] = useState(
    String(today.getMonth() + 1).padStart(2, "0")
  );
  const [day, setDay] = useState(String(today.getDate()).padStart(2, "0"));
  const [year, setYear] = useState(String(today.getFullYear()));

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
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

  return (
    <div className="relative">
      {/* Field */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="
          w-full
          text-left
          bg-transparent
          border-b
          border-white
          py-2
          text-white
          font-display
          font-semibold
          text-[22px]
          leading-[100%]
          capitalize
        "
      >
        {value || placeholder}
      </button>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div
            className="
              w-[380px]
              rounded-[20px]
              bg-black
              border
              border-white/20
              p-[25px]
              shadow-2xl
              font-display
            "
          >
            <h3 className="text-white text-[22px] font-semibold mb-6 text-center">
              Select Date
            </h3>

            <div className="flex justify-center items-center gap-3">
              {/* Month */}
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="
                  w-[125px]
                  h-[55px]
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

            <div className="flex justify-center gap-4 mt-7">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="
                  w-[110px]
                  h-[45px]
                  rounded-[8px]
                  border
                  border-white
                  text-white
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
