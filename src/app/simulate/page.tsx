"use client";

import Link from "next/link";
import { useSimulatorState } from "@/lib/simulatorState";
import GroupArrangement from "@/components/simulator/GroupArrangement";
import BracketView from "@/components/simulator/BracketView";
import RouteSummary from "@/components/simulator/RouteSummary";

export default function SimulatePage() {
  const {
    standings,
    thirdPlaceGroups,
    selectedTeam,
    bracketSides,
    selectedTeamRoute,
    highlightedMatches,
    reorderGroup,
    toggleThirdPlaceGroup,
    setSelectedTeam,
    reset,
    randomize,
  } = useSimulatorState();

  return (
    <main className="min-h-screen bg-navy px-4 py-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            &larr; Back to Path Tracker
          </Link>
        </div>

        <h1 className="text-center text-3xl font-bold text-white">
          Bracket Simulator
        </h1>
        <p className="mt-2 text-center text-sm text-gray-400 mb-8">
          Drag teams to set group standings, select 8 third-place qualifiers,
          then click any team to trace their route.
        </p>

        {/* Group Arrangement */}
        <GroupArrangement
          standings={standings}
          thirdPlaceGroups={thirdPlaceGroups}
          selectedTeam={selectedTeam}
          onReorderGroup={reorderGroup}
          onToggleThirdPlace={toggleThirdPlaceGroup}
          onSelectTeam={(code) =>
            setSelectedTeam(code === selectedTeam ? null : code)
          }
          onReset={reset}
          onRandomize={randomize}
        />

        {/* Route Summary */}
        {selectedTeam && selectedTeamRoute.length > 0 && (
          <div className="mt-6">
            <RouteSummary
              teamCode={selectedTeam}
              route={selectedTeamRoute}
            />
          </div>
        )}

        {/* Bracket */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-white mb-4">
            Knockout Bracket
          </h2>
          <p className="text-xs text-gray-500 mb-2 sm:hidden">
            Scroll horizontally to see full bracket &rarr;
          </p>
          <BracketView
            bracketSides={bracketSides}
            highlightedMatches={highlightedMatches}
          />
        </div>
      </div>
    </main>
  );
}
