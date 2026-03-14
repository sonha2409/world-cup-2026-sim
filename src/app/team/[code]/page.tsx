"use client";

import { useState, use } from "react";
import Link from "next/link";
import { getTeamPaths } from "@/lib/pathCalculator";
import PositionTabs from "@/components/PositionTabs";
import PathTable from "@/components/PathTable";

export default function TeamPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const [position, setPosition] = useState<"1st" | "2nd" | "3rd">("1st");
  const { team, paths } = getTeamPaths(code.toUpperCase());

  if (!team) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Team not found</h1>
          <Link href="/" className="mt-4 inline-block text-gold hover:underline">
            Back to all teams
          </Link>
        </div>
      </main>
    );
  }

  const currentPaths =
    position === "1st"
      ? [paths.first]
      : position === "2nd"
        ? [paths.second]
        : paths.third;

  return (
    <main className="min-h-screen bg-navy px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-white"
        >
          &larr; All Teams
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <span className="text-4xl">{team.flag}</span>
          <div>
            <h1 className="text-3xl font-bold text-white">{team.name}</h1>
            <p className="text-sm text-gray-400">
              Group {team.group} &middot; {team.code}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-white">
            Knockout Path
          </h2>
          <PositionTabs selected={position} onChange={setPosition} />
        </div>

        <div className="rounded-xl bg-navy-light p-4 shadow-lg">
          {position === "3rd" && currentPaths.length === 0 ? (
            <p className="py-8 text-center text-gray-400">
              This team may not qualify as a 3rd-place finisher, or no valid
              bracket assignments exist.
            </p>
          ) : (
            <PathTable paths={currentPaths} />
          )}
        </div>
      </div>
    </main>
  );
}
