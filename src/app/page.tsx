"use client";

import { useState } from "react";
import { groups } from "@/data/groups";
import { teams } from "@/data/groups";
import GroupCard from "@/components/GroupCard";
import SearchBar from "@/components/SearchBar";
import TeamBadge from "@/components/TeamBadge";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = searchQuery.trim()
    ? teams.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <main className="min-h-screen bg-navy px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-center text-4xl font-bold text-white">
          World Cup 2026 Path Tracker
        </h1>
        <p className="mt-2 text-center text-lg text-gray-400">
          Pick a team to see every possible venue-by-venue journey to the final.
        </p>

        <div className="mt-8">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        {filteredTeams ? (
          <div className="mt-8 mx-auto max-w-md">
            <div className="rounded-xl bg-navy-light p-4 shadow-lg">
              {filteredTeams.length === 0 ? (
                <p className="text-center text-gray-400">No teams found.</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {filteredTeams.map((team) => (
                    <TeamBadge key={team.code} team={team} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {groups.map((group) => (
              <GroupCard key={group} group={group} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
