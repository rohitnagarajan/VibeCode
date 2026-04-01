import type { BrandSettings, TitleCardContent } from '../../types';

interface Props {
  content: TitleCardContent;
  brand: BrandSettings;
}

export function TitleCard({ content, brand }: Props) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-16"
      style={{ background: `linear-gradient(135deg, ${brand.secondaryColor} 0%, ${brand.primaryColor} 100%)`, fontFamily: brand.fontFamily }}
    >
      {/* Decorative line */}
      <div className="w-16 h-1 rounded-full mb-6" style={{ background: brand.accentColor }} />
      <h1 className="text-5xl font-bold text-white leading-tight mb-3">{content.title}</h1>
      {content.subtitle && (
        <p className="text-2xl font-light text-white/80 mb-4">{content.subtitle}</p>
      )}
      {content.description && (
        <p className="text-base text-white/60 max-w-lg">{content.description}</p>
      )}
      <div className="w-16 h-1 rounded-full mt-6" style={{ background: brand.accentColor }} />
    </div>
  );
}
