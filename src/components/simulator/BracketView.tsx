"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { BracketSides, BracketSlot } from "@/lib/simulatorState";
import BracketMatchBox from "./BracketMatchBox";
import BracketConnectors from "./BracketConnectors";

// Layout mapping: each match gets a grid column and row
// Left side reads left-to-right (R32 → SF), right side right-to-left (R32 → SF)
// Columns: 0=L-R32, 1=L-R16, 2=L-QF, 3=L-SF, 4=Final, 5=R-SF, 6=R-QF, 7=R-R16, 8=R-R32

const LEFT_R32_ORDER = [73, 74, 75, 77, 83, 84, 81, 82];
const LEFT_R16_ORDER = [89, 90, 93, 94];
const LEFT_QF_ORDER = [97, 98];
const LEFT_SF_ORDER = [101];

const RIGHT_R32_ORDER = [76, 78, 79, 80, 86, 88, 85, 87];
const RIGHT_R16_ORDER = [91, 92, 95, 96];
const RIGHT_QF_ORDER = [99, 100];
const RIGHT_SF_ORDER = [102];

const ROUND_LABELS = ["R32", "R16", "QF", "SF", "Final / 3rd", "SF", "QF", "R16", "R32"];

const COL_WIDTH = 200;
const BOX_WIDTH = 190;
const TOTAL_COLS = 9;
const TOTAL_ROWS = 16;
const ROW_HEIGHT = 72;
const BRACKET_WIDTH = TOTAL_COLS * COL_WIDTH;
const BRACKET_HEIGHT = TOTAL_ROWS * ROW_HEIGHT;

function getRowsForRound(count: number, totalRows: number): number[] {
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
  const bracketRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [, setMeasureTick] = useState(0);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const pinchStart = useRef({ dist: 0, scale: 0 });

  // Compute initial scale to fit bracket in viewport
  useEffect(() => {
    function fitToView() {
      if (!viewportRef.current) return;
      const vw = viewportRef.current.clientWidth;
      const vh = viewportRef.current.clientHeight;
      // Include extra height for 3rd place match below final
      const contentHeight = BRACKET_HEIGHT + ROW_HEIGHT * 3;
      const scaleX = vw / BRACKET_WIDTH;
      const scaleY = vh / contentHeight;
      const fitScale = Math.min(scaleX, scaleY, 1); // never zoom beyond 1
      setScale(fitScale);
      // Center horizontally
      const scaledWidth = BRACKET_WIDTH * fitScale;
      setTranslate({ x: (vw - scaledWidth) / 2, y: 0 });
    }
    fitToView();
    window.addEventListener("resize", fitToView);
    return () => window.removeEventListener("resize", fitToView);
  }, []);

  // Trigger re-render after mount so connectors can measure
  useEffect(() => {
    const timer = setTimeout(() => setMeasureTick(1), 200);
    return () => clearTimeout(timer);
  }, []);

  // Wheel zoom — use native listener with { passive: false } to prevent page scroll
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      const rect = el!.getBoundingClientRect();

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setScale((prev) => {
        const newScale = Math.min(Math.max(prev * zoomFactor, 0.15), 1.5);
        setTranslate((t) => ({
          x: mouseX - (mouseX - t.x) * (newScale / prev),
          y: mouseY - (mouseY - t.y) * (newScale / prev),
        }));
        return newScale;
      });
    }

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Mouse drag to pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Don't initiate drag on match boxes
    if ((e.target as HTMLElement).closest("[data-match]")) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, tx: translate.x, ty: translate.y };
  }, [translate]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setTranslate({
      x: dragStart.current.tx + (e.clientX - dragStart.current.x),
      y: dragStart.current.ty + (e.clientY - dragStart.current.y),
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch pan & pinch zoom
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragStart.current = { x: touch.clientX, y: touch.clientY, tx: translate.x, ty: translate.y };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStart.current = { dist: Math.hypot(dx, dy), scale };
    }
  }, [translate, scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setTranslate({
        x: dragStart.current.tx + (touch.clientX - dragStart.current.x),
        y: dragStart.current.ty + (touch.clientY - dragStart.current.y),
      });
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const newScale = Math.min(Math.max(pinchStart.current.scale * (dist / pinchStart.current.dist), 0.15), 1.5);
      setScale(newScale);
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Zoom controls
  const zoomIn = () => {
    setScale((s) => Math.min(s * 1.3, 1.5));
  };
  const zoomOut = () => {
    setScale((s) => Math.max(s * 0.7, 0.15));
  };
  const resetView = () => {
    if (!viewportRef.current) return;
    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight;
    const contentHeight = BRACKET_HEIGHT + ROW_HEIGHT * 3;
    const scaleX = vw / BRACKET_WIDTH;
    const scaleY = vh / contentHeight;
    const fitScale = Math.min(scaleX, scaleY, 1);
    setScale(fitScale);
    const scaledWidth = BRACKET_WIDTH * fitScale;
    setTranslate({ x: (vw - scaledWidth) / 2, y: 0 });
  };

  const slotMap = new Map<number, BracketSlot>();
  for (const s of bracketSides.left) slotMap.set(s.matchNumber, s);
  for (const s of bracketSides.right) slotMap.set(s.matchNumber, s);
  if (bracketSides.thirdPlace) slotMap.set(bracketSides.thirdPlace.matchNumber, bracketSides.thirdPlace);
  if (bracketSides.final) slotMap.set(bracketSides.final.matchNumber, bracketSides.final);

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
          className="absolute z-10"
          style={{
            left: `${col * COL_WIDTH}px`,
            top: `${rows[i] * ROW_HEIGHT}px`,
            width: `${BOX_WIDTH}px`,
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

  return (
    <div className="relative">
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-20 flex gap-1">
        <button
          onClick={zoomIn}
          className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 text-white text-lg flex items-center justify-center transition-colors"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 text-white text-lg flex items-center justify-center transition-colors"
          title="Zoom out"
        >
          −
        </button>
        <button
          onClick={resetView}
          className="h-8 px-2 rounded bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center transition-colors"
          title="Fit to view"
        >
          Fit
        </button>
      </div>

      {/* Zoom level indicator */}
      <div className="absolute top-2 left-2 z-20 text-[10px] text-gray-500">
        {Math.round(scale * 100)}%
      </div>

      {/* Viewport */}
      <div
        ref={viewportRef}
        className={`overflow-hidden border border-white/5 rounded-lg bg-navy/50 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ height: "70vh", touchAction: "none" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Scaled bracket content */}
        <div
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            width: `${BRACKET_WIDTH}px`,
          }}
        >
          {/* Round labels */}
          <div className="flex mb-2" style={{ width: `${BRACKET_WIDTH}px` }}>
            {ROUND_LABELS.map((label, i) => (
              <div
                key={`${label}-${i}`}
                className="text-xs text-gray-400 font-bold text-center uppercase"
                style={{ width: `${COL_WIDTH}px` }}
              >
                {label}
              </div>
            ))}
          </div>

          <div
            ref={bracketRef}
            className="relative"
            style={{ width: `${BRACKET_WIDTH}px`, height: `${BRACKET_HEIGHT + ROW_HEIGHT * 3}px` }}
          >
            {/* Left side */}
            {renderColumn(LEFT_R32_ORDER, leftR32Rows, 0)}
            {renderColumn(LEFT_R16_ORDER, leftR16Rows, 1)}
            {renderColumn(LEFT_QF_ORDER, leftQFRows, 2)}
            {renderColumn(LEFT_SF_ORDER, leftSFRows, 3)}

            {/* Final */}
            {renderColumn([104], finalRows, 4)}

            {/* 3rd-place match — below the final */}
            {slotMap.has(103) && (
              <div
                className="absolute z-10"
                style={{
                  left: `${4 * COL_WIDTH}px`,
                  top: `${finalRows[0] * ROW_HEIGHT + ROW_HEIGHT * 2.5}px`,
                  width: `${BOX_WIDTH}px`,
                }}
              >
                <div className="text-[9px] text-gray-400 text-center mb-1 uppercase font-bold">3rd Place</div>
                <BracketMatchBox
                  slot={slotMap.get(103)!}
                  highlighted={highlightedMatches.has(103)}
                  compact
                />
              </div>
            )}

            {/* Right side */}
            {renderColumn(RIGHT_SF_ORDER, rightSFRows, 5)}
            {renderColumn(RIGHT_QF_ORDER, rightQFRows, 6)}
            {renderColumn(RIGHT_R16_ORDER, rightR16Rows, 7)}
            {renderColumn(RIGHT_R32_ORDER, rightR32Rows, 8)}

            {/* SVG Connectors */}
            <BracketConnectors
              containerRef={bracketRef}
              highlightedMatches={highlightedMatches}
            />
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-500 mt-1 text-center">
        Scroll to zoom · Drag to pan · Pinch on mobile
      </p>
    </div>
  );
}
