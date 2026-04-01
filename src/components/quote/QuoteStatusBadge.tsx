import type { QuoteStatus } from '../../types/quote';

const STATUS_STYLES: Record<QuoteStatus, string> = {
  'Draft': 'bg-[#ecebea] text-[#3e3e3c]',
  'In Review': 'bg-[#fff3cd] text-[#856404]',
  'Approved': 'bg-[#d4edda] text-[#155724]',
  'Denied': 'bg-[#f8d7da] text-[#721c24]',
  'Presented': 'bg-[#cce5ff] text-[#004085]',
};

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}
