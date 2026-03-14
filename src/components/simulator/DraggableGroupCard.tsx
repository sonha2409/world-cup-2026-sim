"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Team } from "@/data/types";

const POSITION_LABELS = ["1st", "2nd", "3rd", "4th"];

function SortableTeamItem({
  team,
  index,
  isSelected,
  onSelect,
}: {
  team: Team;
  index: number;
  isSelected: boolean;
  onSelect: (code: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: team.code });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 cursor-grab active:cursor-grabbing transition-colors duration-150 ${
        isSelected
          ? "bg-gold/20 ring-1 ring-gold"
          : "hover:bg-white/10"
      }`}
      onClick={(e) => {
        // Don't select when dragging
        if (!isDragging) {
          e.stopPropagation();
          onSelect(team.code);
        }
      }}
      {...attributes}
      {...listeners}
    >
      <span className="w-8 text-xs text-gray-400 font-mono">
        {POSITION_LABELS[index]}
      </span>
      <span className="text-lg">{team.flag}</span>
      <span className="text-sm font-medium text-white truncate">
        {team.name}
      </span>
    </div>
  );
}

export default function DraggableGroupCard({
  group,
  teams,
  selectedTeam,
  onSelectTeam,
}: {
  group: string;
  teams: Team[];
  selectedTeam: string | null;
  onSelectTeam: (code: string) => void;
}) {
  return (
    <div className="rounded-xl bg-navy-light p-3 shadow-lg">
      <h3 className="mb-2 text-center text-sm font-bold tracking-wider text-gold uppercase">
        Group {group}
      </h3>
      <SortableContext
        items={teams.map((t) => t.code)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-0.5">
          {teams.map((team, i) => (
            <SortableTeamItem
              key={team.code}
              team={team}
              index={i}
              isSelected={selectedTeam === team.code}
              onSelect={onSelectTeam}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
