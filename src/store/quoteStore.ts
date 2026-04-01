import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { SalesforceQuote } from '../types/quote';

interface AppState {
  quotes: SalesforceQuote[];
  activeQuoteId: string | null;
}

type Action =
  | { type: 'CREATE_QUOTE'; quote: SalesforceQuote }
  | { type: 'UPDATE_QUOTE'; quote: SalesforceQuote }
  | { type: 'DELETE_QUOTE'; id: string }
  | { type: 'SET_ACTIVE_QUOTE'; id: string | null }
  | { type: 'IMPORT_QUOTE'; quote: SalesforceQuote };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'CREATE_QUOTE':
      return { ...state, quotes: [action.quote, ...state.quotes], activeQuoteId: action.quote.id };
    case 'UPDATE_QUOTE':
      return {
        ...state,
        quotes: state.quotes.map(q => q.id === action.quote.id ? action.quote : q),
      };
    case 'DELETE_QUOTE':
      return {
        ...state,
        quotes: state.quotes.filter(q => q.id !== action.id),
        activeQuoteId: state.activeQuoteId === action.id ? null : state.activeQuoteId,
      };
    case 'SET_ACTIVE_QUOTE':
      return { ...state, activeQuoteId: action.id };
    case 'IMPORT_QUOTE':
      return { ...state, quotes: [action.quote, ...state.quotes], activeQuoteId: action.quote.id };
    default:
      return state;
  }
}

function loadState(): AppState {
  try {
    const saved = localStorage.getItem('sf-quote-editor');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { quotes: [], activeQuoteId: null };
}

const QuoteContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  createNewQuote: () => void;
} | null>(null);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem('sf-quote-editor', JSON.stringify(state));
  }, [state]);

  function createNewQuote() {
    const now = new Date().toISOString();
    const quote: SalesforceQuote = {
      id: uuidv4(),
      name: 'New Quote',
      quoteNumber: `Q-${Date.now().toString().slice(-6)}`,
      accountName: '',
      contactName: '',
      opportunityName: '',
      validUntilDate: '',
      status: 'Draft',
      description: '',
      billingStreet: '',
      billingCity: '',
      billingState: '',
      billingPostalCode: '',
      billingCountry: '',
      shippingHandling: 0,
      taxRate: 0,
      lineItems: [],
      createdDate: now,
      lastModifiedDate: now,
    };
    dispatch({ type: 'CREATE_QUOTE', quote });
  }

  return React.createElement(QuoteContext.Provider, { value: { state, dispatch, createNewQuote } }, children);
}

export function useQuoteStore() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error('useQuoteStore must be used within QuoteProvider');
  return ctx;
}
