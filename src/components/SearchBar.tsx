"use client";

import { useState } from "react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <div className="mx-auto max-w-md">
      <input
        type="text"
        placeholder="Search for a team..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        className="w-full rounded-lg border border-white/20 bg-navy-light px-4 py-3 text-white placeholder-gray-400 outline-none transition-colors focus:border-gold"
      />
    </div>
  );
}
