export type Venue = {
  id: string;
  name: string;
  city: string;
  country: "USA" | "Canada" | "Mexico";
};

export type Team = {
  name: string;
  code: string;
  flag: string;
  group: string;
};

export type Match = {
  matchNumber: number;
  group?: string;
  round: "Group MD1" | "Group MD2" | "Group MD3" | "R32" | "R16" | "QF" | "SF" | "3rd Place" | "Final";
  homeTeam: string;
  awayTeam: string;
  venueId: string;
  date: string;
};

export type TeamPath = {
  finishPosition: "1st" | "2nd" | "3rd";
  scenario?: string;
  rounds: {
    round: "Group MD1" | "Group MD2" | "Group MD3" | "R32" | "R16" | "QF" | "SF" | "Final";
    matchNumber: number;
    venue: Venue;
    opponent: string;
  }[];
};
