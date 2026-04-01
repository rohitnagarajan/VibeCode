import { useEffect, useRef, useState } from 'react';
import type { BrandSettings, OverlayTemplate, AgendaContent } from '../../types';
import { LowerThird } from './LowerThird';
import { TitleCard } from './TitleCard';
import { AgendaOverlay } from './AgendaOverlay';
import { QRCodeOverlay } from './QRCodeOverlay';
import { TickerOverlay } from './TickerOverlay';
import { FullScreenOverlay } from './FullScreenOverlay';

interface Props {
  template: OverlayTemplate;
  brand: BrandSettings;
  agendaItem?: number;
  visible: boolean;
}

export function OverlayRenderer({ template, brand, agendaItem = 0, visible }: Props) {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
      if (template.duration > 0) {
        timerRef.current = setTimeout(() => setShow(false), template.duration * 1000);
      }
    } else {
      setShow(false);
      const t = setTimeout(() => setMounted(false), 600);
      return () => clearTimeout(t);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [visible, template.duration]);

  if (!mounted) return null;

  const animClass = {
    'slide-up': show
      ? 'translate-y-0 opacity-100'
      : 'translate-y-8 opacity-0',
    'slide-down': show
      ? 'translate-y-0 opacity-100'
      : '-translate-y-8 opacity-0',
    'slide-left': show
      ? 'translate-x-0 opacity-100'
      : 'translate-x-8 opacity-0',
    'fade': show
      ? 'opacity-100'
      : 'opacity-0',
  }[template.animation];

  const content = { ...template.content } as AgendaContent & { activeItem: number };
  if (template.type === 'agenda') content.activeItem = agendaItem;

  return (
    <div className={`transition-all duration-500 ease-out ${animClass}`}>
      {template.type === 'lower-third' && <LowerThird content={template.content as never} brand={brand} />}
      {template.type === 'title-card' && <TitleCard content={template.content as never} brand={brand} />}
      {template.type === 'agenda' && <AgendaOverlay content={content as never} brand={brand} />}
      {template.type === 'qr-code' && <QRCodeOverlay content={template.content as never} brand={brand} />}
      {template.type === 'ticker' && <TickerOverlay content={template.content as never} brand={brand} show={show} />}
      {template.type === 'full-screen' && <FullScreenOverlay content={template.content as never} brand={brand} />}
    </div>
  );
}
