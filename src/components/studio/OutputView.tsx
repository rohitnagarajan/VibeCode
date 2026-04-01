import { useEffect, useState } from 'react';
import { onMessage } from '../../lib/broadcast';
import { OverlayRenderer } from '../overlays/OverlayRenderer';
import type { BrandSettings, OverlayTemplate } from '../../types';
import { DEFAULT_BRAND } from '../../lib/defaults';

export function OutputView() {
  const [active, setActive] = useState<{ template: OverlayTemplate; brand: BrandSettings } | null>(null);
  const [agendaItem, setAgendaItem] = useState(0);

  useEffect(() => {
    // Load persisted state on mount
    try {
      const saved = localStorage.getItem('teamcast-state');
      if (saved) {
        const s = JSON.parse(saved);
        if (s.activeTemplateId) {
          const t = s.templates?.find((x: OverlayTemplate) => x.id === s.activeTemplateId);
          if (t) setActive({ template: t, brand: s.brand ?? DEFAULT_BRAND });
          setAgendaItem(s.agendaItem ?? 0);
        }
      }
    } catch {}

    return onMessage(msg => {
      if (msg.type === 'ACTIVATE') {
        setActive({ template: msg.template, brand: msg.brand });
        setAgendaItem(msg.agendaItem ?? 0);
      } else if (msg.type === 'DEACTIVATE') {
        setActive(null);
      } else if (msg.type === 'SET_AGENDA_ITEM') {
        setAgendaItem(msg.item);
      }
    });
  }, []);

  return (
    <div className="w-screen h-screen bg-transparent relative overflow-hidden" style={{ background: 'transparent' }}>
      {active && (
        <OverlayRenderer
          template={active.template}
          brand={active.brand}
          agendaItem={agendaItem}
          visible={true}
        />
      )}
    </div>
  );
}
