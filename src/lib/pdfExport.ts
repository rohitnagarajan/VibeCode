import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { SalesforceQuote } from '../types/quote';
import { computeTotals, formatCurrency, lineItemTotal } from './quoteCalculations';

const SF_BLUE = '#0070D2';
const SF_LIGHT = '#F4F6F9';
const SF_LABEL = '#54698D';

export function exportQuoteToPDF(quote: SalesforceQuote): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(SF_BLUE);
  doc.rect(0, 0, pageW, 28, 'F');

  // "QUOTE" title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor('#FFFFFF');
  doc.text('QUOTE', pageW - 14, 18, { align: 'right' });

  // Company / quote name
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(quote.name, 14, 18);

  // Quote metadata section
  let y = 36;
  const col1 = 14;
  const col2 = pageW / 2 + 4;

  const metaLeft: [string, string][] = [
    ['Quote Number', quote.quoteNumber || '—'],
    ['Account', quote.accountName || '—'],
    ['Contact', quote.contactName || '—'],
    ['Opportunity', quote.opportunityName || '—'],
  ];
  const metaRight: [string, string][] = [
    ['Status', quote.status],
    ['Valid Until', quote.validUntilDate || '—'],
    ['Created', new Date(quote.createdDate).toLocaleDateString()],
    ['Tax Rate', `${quote.taxRate ?? 0}%`],
  ];

  doc.setFontSize(8);
  metaLeft.forEach(([label, value]) => {
    doc.setTextColor(SF_LABEL);
    doc.setFont('helvetica', 'normal');
    doc.text(label.toUpperCase(), col1, y);
    doc.setTextColor('#181818');
    doc.setFont('helvetica', 'bold');
    doc.text(value, col1, y + 4);
    y += 11;
  });

  y = 36;
  metaRight.forEach(([label, value]) => {
    doc.setTextColor(SF_LABEL);
    doc.setFont('helvetica', 'normal');
    doc.text(label.toUpperCase(), col2, y);
    doc.setTextColor('#181818');
    doc.setFont('helvetica', 'bold');
    doc.text(value, col2, y + 4);
    y += 11;
  });

  y = Math.max(y, 36 + 4 * 11) + 4;

  // Description
  if (quote.description) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(SF_LABEL);
    doc.text('DESCRIPTION', col1, y);
    doc.setTextColor('#181818');
    const wrapped = doc.splitTextToSize(quote.description, pageW - 28);
    doc.text(wrapped, col1, y + 4);
    y += 4 + wrapped.length * 4 + 6;
  }

  // Billing address
  const hasAddress = quote.billingStreet || quote.billingCity || quote.billingCountry;
  if (hasAddress) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(SF_LABEL);
    doc.text('BILLING ADDRESS', col1, y);
    doc.setTextColor('#181818');
    const addr = [
      quote.billingStreet,
      [quote.billingCity, quote.billingState, quote.billingPostalCode].filter(Boolean).join(', '),
      quote.billingCountry,
    ].filter(Boolean).join('\n');
    doc.text(addr, col1, y + 4);
    y += 4 + addr.split('\n').length * 4 + 6;
  }

  y += 2;

  // Line items table
  const tableBody = quote.lineItems.map((li, i) => [
    String(i + 1),
    li.productName,
    li.productCode || '',
    li.description || '',
    String(li.quantity),
    formatCurrency(li.unitPrice),
    `${li.discount}%`,
    formatCurrency(lineItemTotal(li)),
  ]);

  autoTable(doc, {
    startY: y,
    head: [['#', 'Product', 'Code', 'Description', 'Qty', 'Unit Price', 'Discount', 'Total']],
    body: tableBody,
    headStyles: {
      fillColor: SF_LIGHT,
      textColor: SF_LABEL,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: '#FAFAFA' },
    columnStyles: {
      0: { cellWidth: 8 },
      4: { halign: 'right', cellWidth: 12 },
      5: { halign: 'right', cellWidth: 24 },
      6: { halign: 'right', cellWidth: 18 },
      7: { halign: 'right', cellWidth: 24 },
    },
    margin: { left: 14, right: 14 },
    theme: 'plain',
    styles: { lineColor: '#E0E0E0', lineWidth: 0.1 },
  });

  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y + 20;

  // Totals block
  const totals = computeTotals(quote);
  const totalsX = pageW - 14;
  let ty = finalY + 8;

  const totalsRows: [string, string, boolean][] = [
    ['Subtotal', formatCurrency(totals.subtotal), false],
    ['Discount', `-${formatCurrency(totals.totalDiscount)}`, false],
    ['Tax', formatCurrency(totals.tax), false],
    ['Shipping & Handling', formatCurrency(totals.shippingHandling), false],
  ];

  doc.setFontSize(9);
  totalsRows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(SF_LABEL);
    doc.text(label, totalsX - 50, ty, { align: 'left' });
    doc.setTextColor('#181818');
    doc.text(value, totalsX, ty, { align: 'right' });
    ty += 6;
  });

  // Grand total line
  doc.setDrawColor(SF_BLUE);
  doc.setLineWidth(0.5);
  doc.line(totalsX - 50, ty - 1, totalsX, ty - 1);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor('#181818');
  doc.text('Grand Total', totalsX - 50, ty + 5, { align: 'left' });
  doc.setTextColor(SF_BLUE);
  doc.text(formatCurrency(totals.grandTotal), totalsX, ty + 5, { align: 'right' });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#999999');
    doc.text('Thank you for your business', pageW / 2, 287, { align: 'center' });
    doc.text(`Page ${i} of ${pageCount}`, pageW - 14, 287, { align: 'right' });
  }

  const filename = (quote.quoteNumber || quote.name || 'quote').replace(/[^a-z0-9]/gi, '-').toLowerCase();
  doc.save(`${filename}.pdf`);
}
