import { TeamPath } from "@/data/types";

export default function PathTable({ paths }: { paths: TeamPath[] }) {
  if (paths.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8">
        No path available for this position.
      </p>
    );
  }

  const singlePath = paths.length === 1;
  const allRounds = paths[0].rounds;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 font-medium text-gold">Round</th>
            {singlePath ? (
              <>
                <th className="px-4 py-3 font-medium text-gold">Venue</th>
                <th className="px-4 py-3 font-medium text-gold">vs</th>
              </>
            ) : (
              paths.map((p) => (
                <th key={p.scenario} className="px-4 py-3 font-medium text-gold">
                  {p.scenario}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {allRounds.map((round, i) => (
            <tr key={i} className="border-b border-white/5 transition-colors duration-150 hover:bg-white/5">
              <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                {round.round}
              </td>
              {singlePath ? (
                <>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                    {round.venue.name}
                    <span className="ml-1 text-xs text-gray-500">
                      ({round.venue.city})
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{round.opponent}</td>
                </>
              ) : (
                paths.map((p) => {
                  const r = p.rounds[i];
                  return (
                    <td key={p.scenario} className="px-4 py-3 text-gray-300 whitespace-nowrap">
                      {r ? (
                        <>
                          {r.venue.name}
                          <span className="ml-1 text-xs text-gray-500">
                            ({r.venue.city})
                          </span>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                  );
                })
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
