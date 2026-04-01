import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { ArrowLeft, Save, FileDown, Download } from 'lucide-react';
import type { SalesforceQuote, QuoteStatus } from '../../types/quote';
import { useQuoteStore } from '../../store/quoteStore';
import { exportQuoteToPDF } from '../../lib/pdfExport';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { QuoteStatusBadge } from './QuoteStatusBadge';
import { LineItemTable } from './LineItemTable';
import { LineItemTotals } from './LineItemTotals';

const STATUS_OPTIONS: { value: QuoteStatus; label: string }[] = [
  { value: 'Draft', label: 'Draft' },
  { value: 'In Review', label: 'In Review' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Denied', label: 'Denied' },
  { value: 'Presented', label: 'Presented' },
];

interface QuoteEditorProps {
  quote: SalesforceQuote;
}

export function QuoteEditor({ quote }: QuoteEditorProps) {
  const { dispatch } = useQuoteStore();

  const { register, handleSubmit, control, formState: { errors, isDirty } } = useForm<SalesforceQuote>({
    defaultValues: quote,
  });

  const { fields, append, remove, move } = useFieldArray({ control, name: 'lineItems', keyName: 'fieldId' });

  const watchedLineItems = useWatch({ control, name: 'lineItems' }) ?? [];
  const watchedTaxRate = useWatch({ control, name: 'taxRate' }) ?? 0;
  const watchedShipping = useWatch({ control, name: 'shippingHandling' }) ?? 0;
  const watchedStatus = useWatch({ control, name: 'status' }) ?? quote.status;

  function onSubmit(data: SalesforceQuote) {
    dispatch({
      type: 'UPDATE_QUOTE',
      quote: { ...data, lastModifiedDate: new Date().toISOString() },
    });
  }

  function handleExportPDF(data: SalesforceQuote) {
    exportQuoteToPDF({ ...data, lastModifiedDate: new Date().toISOString() });
  }

  function handleExportJSON() {
    const data = quote;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quote.quoteNumber || quote.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_ACTIVE_QUOTE', id: null })}
            className="text-[#706e6b] hover:text-[#181818] cursor-pointer transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#706e6b]">Quotes /</span>
              <h1 className="text-lg font-semibold text-[#181818]">{quote.name}</h1>
              <QuoteStatusBadge status={watchedStatus as QuoteStatus} />
            </div>
            <p className="text-xs text-[#706e6b] mt-0.5">
              {quote.quoteNumber} · Last modified {new Date(quote.lastModifiedDate).toLocaleDateString()}
              {isDirty && <span className="ml-2 text-[#c23934]">· Unsaved changes</span>}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={handleExportJSON}>
            <Download size={13} /> Export JSON
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={handleSubmit(handleExportPDF)}>
            <FileDown size={13} /> Export PDF
          </Button>
          <Button type="submit" size="sm">
            <Save size={13} /> Save
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        {/* Quote Details Card */}
        <div className="bg-white rounded-lg border border-[#dddbda] p-5">
          <h2 className="text-sm font-semibold text-[#181818] mb-4">Quote Details</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
            <Input
              label="Quote Name"
              {...register('name', { required: 'Required' })}
              error={errors.name?.message}
            />
            <Input
              label="Quote Number"
              {...register('quoteNumber')}
            />
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              {...register('status')}
            />
            <Input
              label="Account Name"
              {...register('accountName')}
              placeholder="Acme Corporation"
            />
            <Input
              label="Contact Name"
              {...register('contactName')}
              placeholder="Jane Doe"
            />
            <Input
              label="Opportunity Name"
              {...register('opportunityName')}
              placeholder="Acme Renewal 2024"
            />
            <Input
              label="Valid Until"
              type="date"
              {...register('validUntilDate')}
            />
            <Input
              label="Tax Rate (%)"
              type="number"
              min="0"
              max="100"
              step="0.01"
              {...register('taxRate', { valueAsNumber: true })}
              placeholder="0"
            />
            <Input
              label="Shipping & Handling ($)"
              type="number"
              min="0"
              step="0.01"
              {...register('shippingHandling', { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-[#3e3e3c] uppercase tracking-wide mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={2}
              className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0070D2] resize-none"
              placeholder="Quote description or notes..."
            />
          </div>
        </div>

        {/* Billing Address Card */}
        <div className="bg-white rounded-lg border border-[#dddbda] p-5">
          <h2 className="text-sm font-semibold text-[#181818] mb-4">Billing Address</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
            <div className="md:col-span-3">
              <Input label="Street" {...register('billingStreet')} placeholder="123 Main St" />
            </div>
            <Input label="City" {...register('billingCity')} placeholder="San Francisco" />
            <Input label="State" {...register('billingState')} placeholder="CA" />
            <Input label="Postal Code" {...register('billingPostalCode')} placeholder="94105" />
            <Input label="Country" {...register('billingCountry')} placeholder="United States" />
          </div>
        </div>

        {/* Line Items */}
        <LineItemTable
          fields={fields as { id: string }[]}
          register={register}
          errors={errors}
          onRemove={remove}
          onMove={move}
          onAppend={append}
          watchedItems={watchedLineItems as SalesforceQuote['lineItems']}
        />

        {/* Totals */}
        <LineItemTotals
          quote={{
            lineItems: watchedLineItems as SalesforceQuote['lineItems'],
            taxRate: Number(watchedTaxRate),
            shippingHandling: Number(watchedShipping),
          }}
        />
      </div>
    </form>
  );
}
