export type QuoteStatus = 'Draft' | 'In Review' | 'Approved' | 'Denied' | 'Presented';

export interface QuoteLineItem {
  id: string;
  sortOrder: number;
  productName: string;
  productCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number; // percent 0-100
}

export interface SalesforceQuote {
  id: string;
  name: string;
  quoteNumber: string;
  accountName: string;
  contactName: string;
  opportunityName: string;
  validUntilDate: string; // YYYY-MM-DD
  status: QuoteStatus;
  description: string;
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingPostalCode: string;
  billingCountry: string;
  shippingHandling: number;
  taxRate: number; // percent
  lineItems: QuoteLineItem[];
  createdDate: string;
  lastModifiedDate: string;
}

export interface QuoteTotals {
  subtotal: number;
  totalDiscount: number;
  tax: number;
  shippingHandling: number;
  grandTotal: number;
}
