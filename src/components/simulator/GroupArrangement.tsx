"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { groups } from "@/data/groups";
import { Team } from "@/data/types";
import { GroupStandings } from "@/lib/simulatorState";
import DraggableGroupCard from "./DraggableGroupCard";
import ThirdPlaceSelector from "./ThirdPlaceSelector";

export default function GroupArrangement({
  standings,
  thirdPlaceGroups,
  selectedTeam,
  onReorderGroup,
  onToggleThirdPlace,
  onSelectTeam,
  onReset,
  onRandomize,
  onRandomizeThirdPlace,
}: {
  standings: GroupStandings;
  thirdPlaceGroups: string[];
  selectedTeam: string | null;
  onReorderGroup: (group: string, newOrder: Team[]) => void;
  onToggleThirdPlace: (group: string) => void;
  onSelectTeam: (code: string) => void;
  onReset: () => void;
  onRandomize: () => void;
  onRandomizeThirdPlace: () => void;
}) {
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Find which group this team belongs to
    for (const g of groups) {
      const groupTeams = standings[g];
      const activeIdx = groupTeams.findIndex((t) => t.code === active.id);
      const overIdx = groupTeams.findIndex((t) => t.code === over.id);

      if (activeIdx !== -1 && overIdx !== -1) {
        const newOrder = arrayMove(groupTeams, activeIdx, overIdx);
        onReorderGroup(g, newOrder);
        break;
      }
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Group Standings</h2>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onRandomize}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gold/20 text-gold hover:bg-gold/30 transition-colors"
          >
            Randomize
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {groups.map((g) => (
            <DraggableGroupCard
              key={g}
              group={g}
              teams={standings[g]}
              selectedTeam={selectedTeam}
              onSelectTeam={onSelectTeam}
            />
          ))}
        </div>
      </DndContext>

      <div className="mt-4">
        <ThirdPlaceSelector
          selectedGroups={thirdPlaceGroups}
          onToggle={onToggleThirdPlace}
          onRandomize={onRandomizeThirdPlace}
        />
      </div>
    </div>
  );
}
