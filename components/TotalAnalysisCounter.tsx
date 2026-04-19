'use client';

import { useState, useEffect, useRef } from 'react';

const DEFAULT_TARGET = 25144619;
const TOTAL_DURATION_MS = 3800;
const PHASE1_END_RATIO = 25100000 / DEFAULT_TARGET;
const PHASE1_DURATION_MS = 2200;
const PHASE2_DURATION_MS = TOTAL_DURATION_MS - PHASE1_DURATION_MS;
const REST_AFTER_COMPLETE_MS = 2500;
const LIVE_INCREMENT_MIN_MS = 3000;
const LIVE_INCREMENT_MAX_MS = 5000;
const LIVE_ADD_MIN = 1;
const LIVE_ADD_MAX = 3;

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

type TotalAnalysisCounterProps = {
  targetNumber?: number;
  label?: string;
  className?: string;
};

export default function TotalAnalysisCounter({
  targetNumber = DEFAULT_TARGET,
  label = '累計診断数',
  className = '',
}: TotalAnalysisCounterProps) {
  const [currentValue, setCurrentValue] = useState(0);
  const [isCountingUp, setIsCountingUp] = useState(true);
  const [canStartLiveIncrement, setCanStartLiveIncrement] = useState(false);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const phase1EndValue = Math.floor(targetNumber * PHASE1_END_RATIO);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      let value: number;

      if (elapsed >= TOTAL_DURATION_MS) {
        value = targetNumber;
        setCurrentValue(value);
        setIsCountingUp(false);
        return;
      }

      if (elapsed < PHASE1_DURATION_MS) {
        const t = elapsed / PHASE1_DURATION_MS;
        const eased = easeOutExpo(t);
        value = Math.floor(eased * phase1EndValue);
      } else {
        const phase2Elapsed = elapsed - PHASE1_DURATION_MS;
        const t = Math.min(phase2Elapsed / PHASE2_DURATION_MS, 1);
        const eased = easeOutCubic(t);
        const range = targetNumber - phase1EndValue;
        value = Math.floor(phase1EndValue + eased * range);
      }

      setCurrentValue(Math.min(value, targetNumber));

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetNumber, phase1EndValue]);

  useEffect(() => {
    if (!isCountingUp) return;
    setCanStartLiveIncrement(false);
  }, [isCountingUp]);

  useEffect(() => {
    if (isCountingUp) return;

    const restTimer = setTimeout(() => {
      setCanStartLiveIncrement(true);
    }, REST_AFTER_COMPLETE_MS);

    return () => clearTimeout(restTimer);
  }, [isCountingUp]);

  useEffect(() => {
    if (!canStartLiveIncrement) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const add = LIVE_ADD_MIN + Math.floor(Math.random() * (LIVE_ADD_MAX - LIVE_ADD_MIN + 1));
      setCurrentValue((v) => v + add);
      const delay = LIVE_INCREMENT_MIN_MS + Math.floor(Math.random() * (LIVE_INCREMENT_MAX_MS - LIVE_INCREMENT_MIN_MS + 1));
      timeoutId = setTimeout(scheduleNext, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [canStartLiveIncrement]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <p className="text-sm sm:text-base font-bold text-gray-500 mb-1.5">{label}</p>
      <div
        className="text-4xl sm:text-5xl font-bold text-gray-900 transition-[filter] duration-300"
        style={{
          fontVariantNumeric: 'tabular-nums',
          filter: isCountingUp ? 'blur(0.4px)' : 'blur(0px)',
        }}
        aria-live="polite"
        aria-label={`${label}: ${currentValue.toLocaleString()}`}
      >
        {currentValue.toLocaleString()}
      </div>
    </div>
  );
}
