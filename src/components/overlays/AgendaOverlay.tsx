import type { BrandSettings, AgendaContent } from '../../types';
import { Check } from 'lucide-react';

interface Props {
  content: AgendaContent;
  brand: BrandSettings;
}

export function AgendaOverlay({ content, brand }: Props) {
  return (
    <div
      className="absolute top-10 right-10 w-72 rounded-xl overflow-hidden shadow-2xl"
      style={{ fontFamily: brand.fontFamily }}
    >
      {/* Header */}
      <div className="px-5 py-3" style={{ background: brand.primaryColor }}>
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-0.5">Agenda</div>
        <div className="text-white font-bold text-base">{content.title}</div>
      </div>
      {/* Items */}
      <div className="bg-black/80 backdrop-blur-sm divide-y divide-white/5">
        {content.items.map((item, i) => {
          const done = i < content.activeItem;
          const active = i === content.activeItem;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-2.5 transition-all ${active ? 'bg-white/10' : ''}`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-none text-xs font-bold transition-colors ${
                  done ? 'text-white' : active ? 'text-white' : 'bg-white/10 text-white/40'
                }`}
                style={done ? { background: brand.accentColor } : active ? { background: brand.primaryColor } : {}}
              >
                {done ? <Check size={10} strokeWidth={3} /> : i + 1}
              </div>
              <span className={`text-sm ${active ? 'text-white font-semibold' : done ? 'text-white/40 line-through' : 'text-white/60'}`}>
                {item}
              </span>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: brand.accentColor }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
