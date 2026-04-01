import type { BrandSettings, LowerThirdContent } from '../../types';

const ROLE_COLORS: Record<string, string> = {
  Speaker: 'bg-blue-500',
  Moderator: 'bg-purple-500',
  Host: 'bg-emerald-500',
  Guest: 'bg-amber-500',
  Panelist: 'bg-cyan-500',
  Expert: 'bg-red-500',
};

interface Props {
  content: LowerThirdContent;
  brand: BrandSettings;
}

export function LowerThird({ content, brand }: Props) {
  return (
    <div className="absolute bottom-16 left-10 flex items-end gap-0">
      {/* Accent bar */}
      <div className="w-1.5 h-full min-h-[56px] rounded-l-sm" style={{ background: brand.accentColor }} />
      <div
        className="px-5 py-3 min-w-[280px]"
        style={{ background: brand.primaryColor, fontFamily: brand.fontFamily }}
      >
        <div className="flex items-center gap-2 mb-0.5">
          {content.role && (
            <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${ROLE_COLORS[content.role] ?? 'bg-gray-500'} text-white`}>
              {content.role}
            </span>
          )}
        </div>
        <div className="text-white font-bold text-xl leading-tight">{content.name}</div>
        <div className="text-white/80 text-sm font-medium mt-0.5">{content.title}</div>
        {content.subtitle && <div className="text-white/60 text-xs mt-0.5">{content.subtitle}</div>}
      </div>
      {/* Right edge detail */}
      <div className="w-2 h-full min-h-[56px]" style={{ background: brand.secondaryColor }} />
    </div>
  );
}
