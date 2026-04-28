'use client';

import { useState } from 'react';

type DragMode = 'time' | 'price' | 'stretch' | null;

export function useChartInteraction(totalCandles: number) {
  const [visibleCount, setVisibleCount] = useState(120);
  const [offset, setOffset] = useState(0);
  const [priceZoom, setPriceZoom] = useState(1);
  const [priceOffset, setPriceOffset] = useState(0);
  const [volumeScale, setVolumeScale] = useState(1);
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [crosshair, setCrosshair] = useState<{ x: number; y: number } | null>(null);

  const maxOffset = Math.max(0, totalCandles - visibleCount);

  function resetView() {
    setVisibleCount(120);
    setOffset(0);
    setPriceZoom(1);
    setPriceOffset(0);
    setVolumeScale(1);
  }

  function onWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();

    const zone = (event.target as HTMLElement).dataset.zone;

    if (zone === 'price-scale' || event.shiftKey) {
      setPriceZoom((prev) => {
        const next = event.deltaY > 0 ? prev * 0.96 : prev * 1.04;
        return Math.max(0.75, Math.min(1.8, next));
      });
      return;
    }

    if (zone === 'volume-scale' || event.altKey) {
      setVolumeScale((prev) => {
        const next = event.deltaY > 0 ? prev * 0.94 : prev * 1.06;
        return Math.max(0.45, Math.min(2.2, next));
      });
      return;
    }

    setVisibleCount((prev) => {
      const next = event.deltaY > 0 ? prev + 6 : prev - 6;
      return Math.max(55, Math.min(220, next));
    });
  }

  function onMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0) return;

    const zone = (event.target as HTMLElement).dataset.zone;

    if (zone === 'price-scale') setDragMode('price');
    else if (zone === 'time-scale') setDragMode('stretch');
    else setDragMode('time');

    setDragStart({ x: event.clientX, y: event.clientY });
  }

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    setCrosshair({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });

    if (!dragStart || !dragMode) return;

    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;

    if (dragMode === 'time' && Math.abs(dx) > 12) {
      const move = Math.round(dx / 14);

      setOffset((prev) => {
        const next = prev + move;
        return Math.max(0, Math.min(maxOffset, next));
      });

      setDragStart({ x: event.clientX, y: event.clientY });
    }

    if (dragMode === 'stretch' && Math.abs(dx) > 8) {
      setVisibleCount((prev) => {
        const next = dx > 0 ? prev - 4 : prev + 4;
        return Math.max(55, Math.min(240, next));
      });

      setDragStart({ x: event.clientX, y: event.clientY });
    }

    if (dragMode === 'price' && Math.abs(dy) > 2) {
      setPriceOffset((prev) => {
        const next = prev + dy * 0.001;
        return Math.max(-0.35, Math.min(0.35, next));
      });

      setDragStart({ x: event.clientX, y: event.clientY });
    }
  }

  function onMouseUp() {
    setDragMode(null);
    setDragStart(null);
  }

  function onMouseLeave() {
    setDragMode(null);
    setDragStart(null);
    setCrosshair(null);
  }

  return {
    visibleCount,
    offset,
    priceZoom,
    priceOffset,
    volumeScale,
    crosshair,
    resetView,
    onWheel,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
  };
}