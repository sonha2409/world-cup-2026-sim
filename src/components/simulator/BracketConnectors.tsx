"use client";

import { useEffect, useState, RefObject } from "react";
import { bracketFeeds } from "@/data/bracket";

type Line = {
  key: string;
  path: string;
  highlighted: boolean;
};

function getElementCenter(el: HTMLElement, container: HTMLElement) {
  // Walk up offsetParent chain to get position relative to the container
  let x = 0;
  let y = 0;
  let current: HTMLElement | null = el;
  while (current && current !== container) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return {
    left: x,
    right: x + el.offsetWidth,
    centerY: y + el.offsetHeight / 2,
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

function computeLines(
  container: HTMLElement,
  highlightedMatches: Set<number>,
): Line[] {
  const lines: Line[] = [];

  for (const [matchNumStr, feed] of Object.entries(bracketFeeds)) {
    const matchNum = parseInt(matchNumStr);
    // Skip 3rd-place match lines — it sits below the Final and is self-evident
    if (matchNum === 103) continue;
    const targetEl = container.querySelector(`[data-match="${matchNum}"]`) as HTMLElement | null;
    const homeEl = container.querySelector(`[data-match="${feed.homeFrom}"]`) as HTMLElement | null;
    const awayEl = container.querySelector(`[data-match="${feed.awayFrom}"]`) as HTMLElement | null;

    if (!targetEl || !homeEl || !awayEl) continue;

    const target = getElementCenter(targetEl, container);
    const home = getElementCenter(homeEl, container);
    const away = getElementCenter(awayEl, container);

    // Determine direction: if source is to the left, connect right edge to left edge
    const homeIsLeft = home.left < target.left;

    const tX = homeIsLeft ? target.left : target.right;
    const tY = target.centerY;

    // Home feed line
    const hX = homeIsLeft ? home.right : home.left;
    const hY = home.centerY;
    const midXH = (hX + tX) / 2;

    lines.push({
      key: `${feed.homeFrom}-${matchNum}`,
      path: `M${hX},${hY} L${midXH},${hY} L${midXH},${tY} L${tX},${tY}`,
      highlighted:
        highlightedMatches.has(feed.homeFrom) && highlightedMatches.has(matchNum),
    });

    // Away feed line
    const aX = homeIsLeft ? away.right : away.left;
    const aY = away.centerY;
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
      className="absolute inset-0 pointer-events-none z-0"
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
