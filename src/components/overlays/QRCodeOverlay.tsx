import { QRCodeSVG } from 'qrcode.react';
import type { BrandSettings, QRCodeContent } from '../../types';

interface Props {
  content: QRCodeContent;
  brand: BrandSettings;
}

export function QRCodeOverlay({ content, brand }: Props) {
  return (
    <div
      className="absolute bottom-10 right-10 rounded-xl overflow-hidden shadow-2xl"
      style={{ fontFamily: brand.fontFamily }}
    >
      <div className="px-4 py-3 text-center" style={{ background: brand.primaryColor }}>
        <div className="text-white font-bold text-sm">{content.label}</div>
        {content.description && <div className="text-white/70 text-xs mt-0.5">{content.description}</div>}
      </div>
      <div className="bg-white p-4 flex justify-center">
        <QRCodeSVG value={content.url || 'https://example.com'} size={120} />
      </div>
    </div>
  );
}
