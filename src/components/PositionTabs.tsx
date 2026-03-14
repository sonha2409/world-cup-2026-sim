"use client";

const positions = ["1st", "2nd", "3rd"] as const;

export default function PositionTabs({
  selected,
  onChange,
}: {
  selected: "1st" | "2nd" | "3rd";
  onChange: (position: "1st" | "2nd" | "3rd") => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg bg-navy p-1">
      {positions.map((pos) => (
        <button
          key={pos}
          onClick={() => onChange(pos)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            selected === pos
              ? "bg-gold text-navy"
              : "text-gray-400 hover:text-white"
          }`}
        >
          If {pos}
        </button>
      ))}
    </div>
  );
}
