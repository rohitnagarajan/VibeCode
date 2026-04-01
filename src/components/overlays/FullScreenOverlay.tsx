import type { BrandSettings, FullScreenContent } from '../../types';

interface Props {
  content: FullScreenContent;
  brand: BrandSettings;
}

export function FullScreenOverlay({ content, brand }: Props) {
  const backgrounds: Record<string, string> = {
    brand: `linear-gradient(135deg, ${brand.secondaryColor} 0%, ${brand.primaryColor} 60%, ${brand.accentColor} 100%)`,
    dark: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    minimal: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  };
  const textStyles: Record<string, string> = {
    brand: 'text-white',
    dark: 'text-white',
    minimal: 'text-gray-900',
  };

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-20"
      style={{ background: backgrounds[content.style] ?? backgrounds.brand, fontFamily: brand.fontFamily }}
    >
      {brand.logoUrl && (
        <img src={brand.logoUrl} alt="Logo" className="h-12 mb-8 object-contain" />
      )}
      <h1 className={`text-6xl font-black leading-tight mb-4 ${textStyles[content.style]}`}>
        {content.title}
      </h1>
      {content.subtitle && (
        <p className={`text-2xl font-light ${textStyles[content.style]} opacity-70`}>
          {content.subtitle}
        </p>
      )}
    </div>
  );
}
