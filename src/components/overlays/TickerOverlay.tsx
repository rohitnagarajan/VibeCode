import { useEffect, useRef, useState } from 'react';
import type { BrandSettings, TickerContent } from '../../types';

interface Props {
  content: TickerContent;
  brand: BrandSettings;
  show: boolean;
}

const SPEED = { slow: 40, medium: 80, fast: 140 };

export function TickerOverlay({ content, brand, show }: Props) {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const text = content.items.join('   •   ') + '   •   ';
  const speed = SPEED[content.speed] ?? 80;

  useEffect(() => {
    if (!show) return;
    let last = 0;
    const tick = (time: number) => {
      if (last) {
        const delta = time - last;
        offsetRef.current = (offsetRef.current + (speed * delta) / 1000);
        const textWidth = textRef.current?.scrollWidth ?? 0;
        if (textWidth > 0 && offsetRef.current > textWidth / 2) {
          offsetRef.current -= textWidth / 2;
        }
        setOffset(offsetRef.current);
      }
      last = time;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [show, speed]);

  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-stretch overflow-hidden" style={{ fontFamily: brand.fontFamily }}>
      {/* Label */}
      <div
        className="flex-none flex items-center px-4 text-white text-xs font-black uppercase tracking-widest z-10"
        style={{ background: brand.accentColor, minWidth: 64 }}
      >
        {content.label || 'LIVE'}
      </div>
      {/* Ticker tape */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden py-2.5"
        style={{ background: `${brand.primaryColor}ee` }}
      >
        <div
          ref={textRef}
          className="whitespace-nowrap text-sm font-medium text-white"
          style={{ transform: `translateX(-${offset}px)`, willChange: 'transform' }}
        >
          {text}{text}
        </div>
      </div>
    </div>
  );
}
