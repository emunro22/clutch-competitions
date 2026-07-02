'use client';

import { useState, useEffect } from 'react';
import { percentSold } from '@/lib/utils';

interface ProgressBarProps {
  sold: number;
  total: number;
  showLabel?: boolean;
  threshold?: number;
}

export default function ProgressBar({ sold, total, showLabel = true, threshold }: ProgressBarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const percent = percentSold(sold, total);
  const isHot = percent >= 80;
  const isWarm = percent >= 50;
  const thresholdMet = threshold ? percent >= threshold : true;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted font-medium">
            {sold.toLocaleString()} / {total.toLocaleString()} sold
          </span>
          <span className={`text-xs font-bold ${isHot ? 'text-danger' : isWarm ? 'text-primary' : 'text-success'}`}>
            {percent}%
          </span>
        </div>
      )}
      <div className="relative w-full h-2.5 bg-background rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-out ${
            isHot
              ? 'bg-gradient-to-r from-primary to-danger'
              : isWarm
              ? 'bg-gradient-to-r from-success to-primary'
              : 'bg-gradient-to-r from-accent to-success'
          }`}
          style={{ width: mounted ? `${percent}%` : '0%' }}
        />
        {threshold && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary/60"
            style={{ left: `${threshold}%` }}
            title={`${threshold}% threshold required`}
          />
        )}
      </div>
      {isHot && (
        <p className="text-[10px] text-danger font-bold mt-1 pulse-live">
          Selling fast, only {total - sold} tickets remaining!
        </p>
      )}
      {threshold && !thresholdMet && (
        <p className="text-[10px] text-primary font-semibold mt-1">
          {threshold}% must sell, auto-extends if not met
        </p>
      )}
    </div>
  );
}
