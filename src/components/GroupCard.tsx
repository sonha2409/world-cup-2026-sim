import { getTeamsByGroup } from "@/data/groups";
import TeamBadge from "./TeamBadge";

export default function GroupCard({ group }: { group: string }) {
  const teams = getTeamsByGroup(group);

  return (
    <div className="rounded-xl bg-navy-light p-4 shadow-lg transition-shadow hover:shadow-xl">
      <h3 className="mb-3 text-center text-sm font-bold tracking-wider text-gold uppercase">
        Group {group}
      </h3>
      <div className="flex flex-col gap-1">
        {teams.map((team) => (
          <TeamBadge key={team.code} team={team} />
        ))}
      </div>
    </div>
  );
}
