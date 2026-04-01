import type { QuoteLineItem, QuoteTotals, SalesforceQuote } from '../types/quote';

export function lineItemTotal(item: QuoteLineItem): number {
  return item.quantity * item.unitPrice * (1 - item.discount / 100);
}

export function lineItemDiscount(item: QuoteLineItem): number {
  return item.quantity * item.unitPrice * (item.discount / 100);
}

export function computeTotals(quote: Partial<SalesforceQuote> & { lineItems: QuoteLineItem[], taxRate: number, shippingHandling: number }): QuoteTotals {
  const lineItems = quote.lineItems ?? [];
  const subtotal = lineItems.reduce((sum, li) => sum + lineItemTotal(li), 0);
  const totalDiscount = lineItems.reduce((sum, li) => sum + lineItemDiscount(li), 0);
  const tax = subtotal * ((quote.taxRate ?? 0) / 100);
  const shippingHandling = quote.shippingHandling ?? 0;
  return {
    subtotal,
    totalDiscount,
    tax,
    shippingHandling,
    grandTotal: subtotal + tax + shippingHandling,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}
