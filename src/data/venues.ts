import { Venue } from "./types";

export const venues: Record<string, Venue> = {
  sofi: { id: "sofi", name: "SoFi Stadium", city: "Inglewood, CA", country: "USA" },
  metlife: { id: "metlife", name: "MetLife Stadium", city: "East Rutherford, NJ", country: "USA" },
  att: { id: "att", name: "AT&T Stadium", city: "Arlington, TX", country: "USA" },
  hard_rock: { id: "hard_rock", name: "Hard Rock Stadium", city: "Miami Gardens, FL", country: "USA" },
  gillette: { id: "gillette", name: "Gillette Stadium", city: "Foxborough, MA", country: "USA" },
  nrg: { id: "nrg", name: "NRG Stadium", city: "Houston, TX", country: "USA" },
  mercedes: { id: "mercedes", name: "Mercedes-Benz Stadium", city: "Atlanta, GA", country: "USA" },
  lincoln: { id: "lincoln", name: "Lincoln Financial Field", city: "Philadelphia, PA", country: "USA" },
  lumen: { id: "lumen", name: "Lumen Field", city: "Seattle, WA", country: "USA" },
  levis: { id: "levis", name: "Levi's Stadium", city: "Santa Clara, CA", country: "USA" },
  arrowhead: { id: "arrowhead", name: "GEHA Field at Arrowhead Stadium", city: "Kansas City, MO", country: "USA" },
  bc_place: { id: "bc_place", name: "BC Place", city: "Vancouver", country: "Canada" },
  bmo: { id: "bmo", name: "BMO Field", city: "Toronto", country: "Canada" },
  azteca: { id: "azteca", name: "Estadio Azteca", city: "Mexico City", country: "Mexico" },
  bbva: { id: "bbva", name: "Estadio BBVA", city: "Monterrey", country: "Mexico" },
  akron: { id: "akron", name: "Estadio Akron", city: "Guadalajara", country: "Mexico" },
};
