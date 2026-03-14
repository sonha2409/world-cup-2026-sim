"use client";

import { groups } from "@/data/groups";

export default function ThirdPlaceSelector({
  selectedGroups,
  onToggle,
  onRandomize,
}: {
  selectedGroups: string[];
  onToggle: (group: string) => void;
  onRandomize: () => void;
}) {
  return (
    <div className="rounded-xl bg-navy-light p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold tracking-wider text-gold uppercase">
          3rd-Place Qualifiers
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onRandomize}
            className="px-2 py-1 rounded text-xs bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
          >
            Randomize
          </button>
          <span className="text-xs text-gray-400">
            {selectedGroups.length}/8 selected
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {groups.map((group) => {
          const isSelected = selectedGroups.includes(group);
          const isDisabled = !isSelected && selectedGroups.length >= 8;
          return (
            <button
              key={group}
              onClick={() => onToggle(group)}
              disabled={isDisabled}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-150 ${
                isSelected
                  ? "bg-gold text-navy shadow-md shadow-gold/20"
                  : isDisabled
                    ? "bg-white/5 text-gray-600 cursor-not-allowed"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {group}
            </button>
          );
        })}
      </div>
    </div>
  );
}
