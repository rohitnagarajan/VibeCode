import { v4 as uuidv4 } from 'uuid';
import type { QuoteLineItem, QuoteStatus, SalesforceQuote } from '../types/quote';

function isSalesforceExport(data: unknown): boolean {
  return (
    typeof data === 'object' &&
    data !== null &&
    'records' in data &&
    Array.isArray((data as Record<string, unknown>).records)
  );
}

function parseSalesforceExport(data: Record<string, unknown>): SalesforceQuote {
  const records = data.records as Record<string, unknown>[];
  if (!records || records.length === 0) throw new Error('No records found in Salesforce export');
  const rec = records[0] as Record<string, unknown>;

  const lineItems: QuoteLineItem[] = [];
  const qli = rec.QuoteLineItems as Record<string, unknown> | undefined;
  if (qli && Array.isArray(qli.records)) {
    (qli.records as Record<string, unknown>[]).forEach((li, idx) => {
      const product = li.Product2 as Record<string, unknown> | undefined;
      lineItems.push({
        id: uuidv4(),
        sortOrder: idx + 1,
        productName: (product?.Name as string) ?? '',
        productCode: (product?.ProductCode as string) ?? '',
        description: (li.Description as string) ?? '',
        quantity: Number(li.Quantity ?? 1),
        unitPrice: Number(li.UnitPrice ?? 0),
        discount: Number(li.Discount ?? 0),
      });
    });
  }

  const account = rec.Account as Record<string, unknown> | undefined;
  const opportunity = rec.Opportunity as Record<string, unknown> | undefined;
  const contact = rec.Contact as Record<string, unknown> | undefined;

  return {
    id: (rec.Id as string) ?? uuidv4(),
    name: (rec.Name as string) ?? 'Imported Quote',
    quoteNumber: (rec.QuoteNumber as string) ?? '',
    accountName: (account?.Name as string) ?? (rec.AccountId as string) ?? '',
    contactName: (contact?.Name as string) ?? (rec.ContactId as string) ?? '',
    opportunityName: (opportunity?.Name as string) ?? (rec.OpportunityId as string) ?? '',
    validUntilDate: (rec.ExpirationDate as string) ?? '',
    status: (rec.Status as QuoteStatus) ?? 'Draft',
    description: (rec.Description as string) ?? '',
    billingStreet: (rec.BillingStreet as string) ?? '',
    billingCity: (rec.BillingCity as string) ?? '',
    billingState: (rec.BillingState as string) ?? '',
    billingPostalCode: (rec.BillingPostalCode as string) ?? '',
    billingCountry: (rec.BillingCountry as string) ?? '',
    shippingHandling: Number(rec.ShippingAndHandling ?? 0),
    taxRate: Number(rec.TaxRate ?? 0),
    lineItems,
    createdDate: new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
  };
}

export function importQuoteFromJson(jsonString: string): SalesforceQuote {
  let data: unknown;
  try {
    data = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid JSON: could not parse the provided text');
  }

  if (isSalesforceExport(data)) {
    return parseSalesforceExport(data as Record<string, unknown>);
  }

  // Try treating it as the app's own SalesforceQuote format
  const obj = data as Record<string, unknown>;
  if (obj && typeof obj.name === 'string' && Array.isArray(obj.lineItems)) {
    return {
      ...obj,
      id: (obj.id as string) ?? uuidv4(),
      lastModifiedDate: new Date().toISOString(),
    } as SalesforceQuote;
  }

  throw new Error('Unrecognized format: expected a Salesforce export or a quote JSON object');
}
