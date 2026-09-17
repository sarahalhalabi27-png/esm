import checkIcon from "../../assets/check.svg";

export default function CheckListItem({ children, className = "" }) {
  return (
    <span
      className={`flex items-center gap-2 text-[20px] font-normal leading-[100%] font-display text-white ${className}`}
    >
      <img src={checkIcon} alt="" width={24} height={21} className="shrink-0" />

      {children}
    </span>
  );
}
