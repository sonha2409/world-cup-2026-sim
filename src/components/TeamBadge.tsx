import Link from "next/link";
import { Team } from "@/data/types";

export default function TeamBadge({ team }: { team: Team }) {
  return (
    <Link
      href={`/team/${team.code}`}
      className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-white/10"
    >
      <span className="text-xl">{team.flag}</span>
      <span className="text-sm font-medium text-white">{team.name}</span>
    </Link>
  );
}
