import React, { useState } from 'react';
import { Plus, Upload, FileText, Trash2 } from 'lucide-react';
import { useQuoteStore } from '../../store/quoteStore';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { QuoteStatusBadge } from './QuoteStatusBadge';
import { importQuoteFromJson } from '../../lib/jsonImport';
import { formatCurrency, computeTotals } from '../../lib/quoteCalculations';

export function QuoteList() {
  const { state, dispatch, createNewQuote } = useQuoteStore();
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleImport() {
    try {
      const quote = importQuoteFromJson(importText);
      dispatch({ type: 'IMPORT_QUOTE', quote });
      setImportOpen(false);
      setImportText('');
      setImportError('');
    } catch (e) {
      setImportError((e as Error).message);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImportText(ev.target?.result as string);
    reader.readAsText(file);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#181818]">Quotes</h1>
          <p className="text-sm text-[#706e6b] mt-0.5">{state.quotes.length} quote{state.quotes.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setImportOpen(true)}>
            <Upload size={14} /> Import JSON
          </Button>
          <Button onClick={createNewQuote}>
            <Plus size={14} /> New Quote
          </Button>
        </div>
      </div>

      {state.quotes.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#dddbda] p-16 text-center">
          <FileText size={48} className="mx-auto text-[#dddbda] mb-4" />
          <h2 className="text-base font-semibold text-[#3e3e3c] mb-2">No quotes yet</h2>
          <p className="text-sm text-[#706e6b] mb-6">Create a new quote or import an existing Salesforce quote.</p>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setImportOpen(true)}>
              <Upload size={14} /> Import JSON
            </Button>
            <Button onClick={createNewQuote}>
              <Plus size={14} /> New Quote
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#dddbda] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#dddbda] bg-[#f4f6f9]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#706e6b] uppercase tracking-wide">Quote Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#706e6b] uppercase tracking-wide">Quote #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#706e6b] uppercase tracking-wide">Account</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#706e6b] uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#706e6b] uppercase tracking-wide">Valid Until</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#706e6b] uppercase tracking-wide">Total</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {state.quotes.map((quote, i) => {
                const totals = computeTotals(quote);
                return (
                  <tr
                    key={quote.id}
                    className={`border-b border-[#f3f2f2] hover:bg-[#f4f6f9] cursor-pointer transition-colors ${i % 2 === 0 ? '' : 'bg-[#fafaf9]'}`}
                    onClick={() => dispatch({ type: 'SET_ACTIVE_QUOTE', id: quote.id })}
                  >
                    <td className="px-4 py-3 font-medium text-[#0070D2]">{quote.name}</td>
                    <td className="px-4 py-3 text-[#3e3e3c]">{quote.quoteNumber}</td>
                    <td className="px-4 py-3 text-[#3e3e3c]">{quote.accountName || '—'}</td>
                    <td className="px-4 py-3"><QuoteStatusBadge status={quote.status} /></td>
                    <td className="px-4 py-3 text-[#3e3e3c]">{quote.validUntilDate || '—'}</td>
                    <td className="px-4 py-3 text-right font-medium text-[#181818]">{formatCurrency(totals.grandTotal)}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <button
                        className="text-[#706e6b] hover:text-[#c23934] cursor-pointer transition-colors p-1"
                        onClick={() => setDeleteId(quote.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Import Modal */}
      <Modal
        open={importOpen}
        onClose={() => { setImportOpen(false); setImportError(''); }}
        title="Import Quote from JSON"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setImportOpen(false); setImportError(''); }}>Cancel</Button>
            <Button onClick={handleImport} disabled={!importText.trim()}>Import</Button>
          </>
        }
        width="max-w-2xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#3e3e3c] uppercase tracking-wide mb-1.5">
              Upload JSON File
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-[#706e6b] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-[#dddbda] file:text-xs file:font-medium file:bg-white file:text-[#0070D2] file:cursor-pointer hover:file:bg-[#f4f6f9]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#3e3e3c] uppercase tracking-wide mb-1.5">
              Or Paste JSON
            </label>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              className="w-full h-48 border border-[#dddbda] rounded px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0070D2] resize-none"
              placeholder='{ "records": [...] } or paste a quote JSON object'
            />
          </div>
          {importError && (
            <div className="bg-[#fef0ef] border border-[#c23934]/30 rounded px-3 py-2 text-sm text-[#c23934]">
              {importError}
            </div>
          )}
          <div className="bg-[#f4f6f9] rounded p-3 text-xs text-[#706e6b]">
            <strong className="text-[#3e3e3c]">Supported formats:</strong> Salesforce Data Export (SOQL query result with <code className="bg-white px-1 rounded">records</code> array) or a previously exported quote JSON.
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Quote"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { dispatch({ type: 'DELETE_QUOTE', id: deleteId! }); setDeleteId(null); }}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-[#3e3e3c]">Are you sure you want to delete this quote? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
