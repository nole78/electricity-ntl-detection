import type { VoltageLevel } from "@/domain/types/VoltageLevel";

const legendItems: Array<{
  type: VoltageLevel;
  label: string;
  symbolClass: string;
}> = [
  {
    type: "TS",
    label: "Visokonaponske",
    symbolClass:
      "h-[18px] w-[18px] rounded-full bg-red-600 border-2 border-white ring-2 ring-red-900"
  },
  {
    type: "SS",
    label: "Srednjenaponske",
    symbolClass:
      "h-4 w-4 rounded-[4px] bg-blue-600 border-2 border-white ring-2 ring-blue-900"
  },
  {
    type: "DT",
    label: "Niskonaponske",
    symbolClass:
      "h-[14px] w-[14px] rotate-45 bg-green-600 border-2 border-white ring-2 ring-green-900"
  }
];

export function Legend() {
  return (
    <div className="flex flex-wrap gap-6 text-sm font-medium">
      {legendItems.map((item) => (
        <div key={item.type} className="flex items-center gap-2">
          <div className={item.symbolClass} />
          {item.label}
        </div>
      ))}
    </div>
  );
}