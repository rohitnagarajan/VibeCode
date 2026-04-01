import { QuoteProvider, useQuoteStore } from './store/quoteStore';
import { AppShell } from './components/layout/AppShell';
import { QuoteList } from './components/quote/QuoteList';
import { QuoteEditor } from './components/quote/QuoteEditor';

function AppContent() {
  const { state } = useQuoteStore();
  const activeQuote = state.quotes.find(q => q.id === state.activeQuoteId);

  return (
    <AppShell>
      {activeQuote ? <QuoteEditor key={activeQuote.id} quote={activeQuote} /> : <QuoteList />}
    </AppShell>
  );
}

export default function App() {
  return (
    <QuoteProvider>
      <AppContent />
    </QuoteProvider>
  );
}
