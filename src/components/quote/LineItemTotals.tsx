import type { SalesforceQuote } from '../../types/quote';
import { computeTotals, formatCurrency } from '../../lib/quoteCalculations';

interface LineItemTotalsProps {
  quote: Partial<SalesforceQuote> & { lineItems: SalesforceQuote['lineItems']; taxRate: number; shippingHandling: number };
}

export function LineItemTotals({ quote }: LineItemTotalsProps) {
  const totals = computeTotals(quote);

  const rows: [string, string, string?][] = [
    ['Subtotal', formatCurrency(totals.subtotal)],
    ['Discount', `-${formatCurrency(totals.totalDiscount)}`],
    ['Tax', formatCurrency(totals.tax)],
    ['Shipping & Handling', formatCurrency(totals.shippingHandling)],
  ];

  return (
    <div className="flex justify-end">
      <div className="bg-white rounded-lg border border-[#dddbda] p-4 w-72">
        <div className="space-y-2">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-[#706e6b]">{label}</span>
              <span className="text-[#3e3e3c] font-medium">{value}</span>
            </div>
          ))}
          <div className="border-t border-[#0070D2] pt-2 mt-2 flex justify-between">
            <span className="font-semibold text-[#181818]">Grand Total</span>
            <span className="font-bold text-[#0070D2] text-base">{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
