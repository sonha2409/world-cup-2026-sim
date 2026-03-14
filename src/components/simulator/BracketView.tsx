"use client";

import { useRef, useEffect, useState } from "react";
import { BracketSides, BracketSlot } from "@/lib/simulatorState";
import BracketMatchBox from "./BracketMatchBox";
import BracketConnectors from "./BracketConnectors";

// Layout mapping: each match gets a grid column and row
// Left side reads left-to-right (R32 → SF), right side right-to-left (R32 → SF)
// Columns: 0=L-R32, 1=L-R16, 2=L-QF, 3=L-SF, 4=Final, 5=R-SF, 6=R-QF, 7=R-R16, 8=R-R32

// Left R32 order: 73,74,75,77 (top quad), 83,84,81,82 (bottom quad)
const LEFT_R32_ORDER = [73, 74, 75, 77, 83, 84, 81, 82];
// Left R16 order: 89,90 (feed from top quad), 93,94 (feed from bottom quad)
const LEFT_R16_ORDER = [89, 90, 93, 94];
const LEFT_QF_ORDER = [97, 98];
const LEFT_SF_ORDER = [101];

// Right R32 order: 76,78,79,80 (top quad), 86,88,85,87 (bottom quad)
const RIGHT_R32_ORDER = [76, 78, 79, 80, 86, 88, 85, 87];
const RIGHT_R16_ORDER = [91, 92, 95, 96];
const RIGHT_QF_ORDER = [99, 100];
const RIGHT_SF_ORDER = [102];

const ROUND_LABELS = ["R32", "R16", "QF", "SF", "Final", "SF", "QF", "R16", "R32"];

function getRowsForRound(count: number, totalRows: number): number[] {
  // Distribute matches evenly across the total rows
  if (count === 1) return [Math.floor(totalRows / 2)];
  const spacing = totalRows / count;
  return Array.from({ length: count }, (_, i) =>
    Math.floor(spacing / 2 + i * spacing),
  );
}

export default function BracketView({
  bracketSides,
  highlightedMatches,
}: {
  bracketSides: BracketSides;
  highlightedMatches: Set<number>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setMeasureTick] = useState(0);

  // Trigger re-render after mount so connectors can measure
  useEffect(() => {
    const timer = setTimeout(() => setMeasureTick(1), 100);
    return () => clearTimeout(timer);
  }, []);

  const slotMap = new Map<number, BracketSlot>();
  for (const s of bracketSides.left) slotMap.set(s.matchNumber, s);
  for (const s of bracketSides.right) slotMap.set(s.matchNumber, s);
  if (bracketSides.final) slotMap.set(bracketSides.final.matchNumber, bracketSides.final);

  const TOTAL_ROWS = 16; // 8 R32 matches per side
  const ROW_HEIGHT = 72; // px per row

  const leftR32Rows = getRowsForRound(8, TOTAL_ROWS);
  const leftR16Rows = getRowsForRound(4, TOTAL_ROWS);
  const leftQFRows = getRowsForRound(2, TOTAL_ROWS);
  const leftSFRows = getRowsForRound(1, TOTAL_ROWS);

  const rightR32Rows = getRowsForRound(8, TOTAL_ROWS);
  const rightR16Rows = getRowsForRound(4, TOTAL_ROWS);
  const rightQFRows = getRowsForRound(2, TOTAL_ROWS);
  const rightSFRows = getRowsForRound(1, TOTAL_ROWS);

  const finalRows = getRowsForRound(1, TOTAL_ROWS);

  function renderColumn(
    matchNums: number[],
    rows: number[],
    col: number,
  ) {
    return matchNums.map((mn, i) => {
      const slot = slotMap.get(mn);
      if (!slot) return null;
      return (
        <div
          key={mn}
          className="absolute"
          style={{
            left: `${col * 140}px`,
            top: `${rows[i] * ROW_HEIGHT}px`,
            width: "130px",
          }}
        >
          <BracketMatchBox
            slot={slot}
            highlighted={highlightedMatches.has(mn)}
            compact
          />
        </div>
      );
    });
  }

  const totalWidth = 9 * 140;
  const totalHeight = TOTAL_ROWS * ROW_HEIGHT;

  return (
    <div>
      {/* Round labels */}
      <div className="flex mb-2" style={{ width: `${totalWidth}px` }}>
        {ROUND_LABELS.map((label, i) => (
          <div
            key={`${label}-${i}`}
            className="text-xs text-gray-400 font-bold text-center uppercase"
            style={{ width: "140px" }}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="overflow-x-auto pb-4">
        <div
          ref={containerRef}
          className="relative"
          style={{ width: `${totalWidth}px`, height: `${totalHeight}px` }}
        >
          {/* Left side */}
          {renderColumn(LEFT_R32_ORDER, leftR32Rows, 0)}
          {renderColumn(LEFT_R16_ORDER, leftR16Rows, 1)}
          {renderColumn(LEFT_QF_ORDER, leftQFRows, 2)}
          {renderColumn(LEFT_SF_ORDER, leftSFRows, 3)}

          {/* Final */}
          {renderColumn([104], finalRows, 4)}

          {/* Right side */}
          {renderColumn(RIGHT_SF_ORDER, rightSFRows, 5)}
          {renderColumn(RIGHT_QF_ORDER, rightQFRows, 6)}
          {renderColumn(RIGHT_R16_ORDER, rightR16Rows, 7)}
          {renderColumn(RIGHT_R32_ORDER, rightR32Rows, 8)}

          {/* SVG Connectors */}
          <BracketConnectors
            containerRef={containerRef}
            highlightedMatches={highlightedMatches}
          />
        </div>
      </div>
    </div>
  );
}
