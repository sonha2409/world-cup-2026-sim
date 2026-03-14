"use client";

import { useEffect, useState, RefObject } from "react";
import { bracketFeeds } from "@/data/bracket";

type Line = {
  key: string;
  path: string;
  highlighted: boolean;
};

function computeLines(
  container: HTMLElement,
  highlightedMatches: Set<number>,
): Line[] {
  const lines: Line[] = [];
  const containerRect = container.getBoundingClientRect();

  for (const [matchNumStr, feed] of Object.entries(bracketFeeds)) {
    const matchNum = parseInt(matchNumStr);
    const targetEl = container.querySelector(`[data-match="${matchNum}"]`);
    const homeEl = container.querySelector(`[data-match="${feed.homeFrom}"]`);
    const awayEl = container.querySelector(`[data-match="${feed.awayFrom}"]`);

    if (!targetEl || !homeEl || !awayEl) continue;

    const targetRect = targetEl.getBoundingClientRect();
    const homeRect = homeEl.getBoundingClientRect();
    const awayRect = awayEl.getBoundingClientRect();

    // Determine direction: if source is to the left, connect right edge to left edge
    const homeIsLeft = homeRect.left < targetRect.left;

    const tX = homeIsLeft
      ? targetRect.left - containerRect.left
      : targetRect.right - containerRect.left;
    const tY = targetRect.top - containerRect.top + targetRect.height / 2;

    // Home feed line
    const hX = homeIsLeft
      ? homeRect.right - containerRect.left
      : homeRect.left - containerRect.left;
    const hY = homeRect.top - containerRect.top + homeRect.height / 2;
    const midXH = (hX + tX) / 2;

    lines.push({
      key: `${feed.homeFrom}-${matchNum}`,
      path: `M${hX},${hY} L${midXH},${hY} L${midXH},${tY} L${tX},${tY}`,
      highlighted:
        highlightedMatches.has(feed.homeFrom) && highlightedMatches.has(matchNum),
    });

    // Away feed line
    const aX = homeIsLeft
      ? awayRect.right - containerRect.left
      : awayRect.left - containerRect.left;
    const aY = awayRect.top - containerRect.top + awayRect.height / 2;
    const midXA = (aX + tX) / 2;

    lines.push({
      key: `${feed.awayFrom}-${matchNum}`,
      path: `M${aX},${aY} L${midXA},${aY} L${midXA},${tY} L${tX},${tY}`,
      highlighted:
        highlightedMatches.has(feed.awayFrom) && highlightedMatches.has(matchNum),
    });
  }

  return lines;
}

export default function BracketConnectors({
  containerRef,
  highlightedMatches,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  highlightedMatches: Set<number>;
}) {
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function update() {
      if (container) {
        setLines(computeLines(container, highlightedMatches));
      }
    }

    // Initial compute after a tick to let elements settle
    const timer = setTimeout(update, 50);

    const observer = new ResizeObserver(update);
    observer.observe(container);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [containerRef, highlightedMatches]);

  if (lines.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    >
      {lines.map((line) => (
        <path
          key={line.key}
          d={line.path}
          fill="none"
          stroke={line.highlighted ? "#f59e0b" : "rgba(255,255,255,0.15)"}
          strokeWidth={line.highlighted ? 2 : 1}
          style={
            line.highlighted
              ? { filter: "drop-shadow(0 0 4px #f59e0b)" }
              : undefined
          }
        />
      ))}
    </svg>
  );
}
