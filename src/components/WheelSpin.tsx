'use client';

import { useEffect, useRef, useState } from 'react';

const SEGMENTS = 8;
const PRIZE_SEGMENT = 0;
const SEGMENT_ANGLE = 360 / SEGMENTS;
const EXTRA_SPINS = 5;

interface WheelSpinProps {
  spinning: boolean;
  isWinner: boolean;
  onDone?: () => void;
}

export default function WheelSpin({ spinning, isWinner, onDone }: WheelSpinProps) {
  const [rotation, setRotation] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!spinning || startedRef.current) return;
    startedRef.current = true;

    const targetSegment = isWinner ? PRIZE_SEGMENT : 1 + Math.floor(Math.random() * (SEGMENTS - 1));
    const target = EXTRA_SPINS * 360 + (360 - (targetSegment * SEGMENT_ANGLE + SEGMENT_ANGLE / 2));

    const raf = requestAnimationFrame(() => setRotation(target));
    const timer = setTimeout(() => onDone?.(), 4200);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [spinning, isWinner, onDone]);

  const gradient = Array.from({ length: SEGMENTS }, (_, i) => {
    const color = i === PRIZE_SEGMENT ? '#F59E0B' : i % 2 === 0 ? '#1E293B' : '#334155';
    return `${color} ${i * SEGMENT_ANGLE}deg ${(i + 1) * SEGMENT_ANGLE}deg`;
  }).join(', ');

  return (
    <div className="relative mx-auto" style={{ width: 260, height: 260 }}>
      <div className="absolute left-1/2 -top-1 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-primary" />

      <div
        className="relative w-full h-full rounded-full border-4 border-border shadow-xl transition-transform ease-out"
        style={{
          background: `conic-gradient(${gradient})`,
          transform: `rotate(${rotation}deg)`,
          transitionDuration: '4s',
        }}
      >
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const angle = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 text-lg"
              style={{ transform: `rotate(${angle}deg) translate(0, -100px) rotate(${-angle}deg)`, marginLeft: -12, marginTop: -12 }}
            >
              {i === PRIZE_SEGMENT ? '🎁' : '✗'}
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-14 h-14 rounded-full bg-card border-4 border-border flex items-center justify-center text-2xl">🎡</div>
      </div>
    </div>
  );
}
