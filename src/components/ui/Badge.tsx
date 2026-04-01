import type { OverlayType } from '../../types';

const TYPE_LABELS: Record<OverlayType, string> = {
  'lower-third': 'Lower Third',
  'title-card': 'Title Card',
  'agenda': 'Agenda',
  'qr-code': 'QR Code',
  'ticker': 'Ticker',
  'full-screen': 'Full Screen',
};

const TYPE_COLORS: Record<OverlayType, string> = {
  'lower-third': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'title-card': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'agenda': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'qr-code': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'ticker': 'bg-red-500/20 text-red-300 border-red-500/30',
  'full-screen': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
};

export function TypeBadge({ type }: { type: OverlayType }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${TYPE_COLORS[type]}`}>
      {TYPE_LABELS[type]}
    </span>
  );
}
