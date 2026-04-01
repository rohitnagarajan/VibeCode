import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { BrandSettings, OverlayTemplate } from '../types';
import { DEFAULT_BRAND, DEFAULT_TEMPLATES } from '../lib/defaults';

interface AppState {
  templates: OverlayTemplate[];
  brand: BrandSettings;
  activeTemplateId: string | null;
  agendaItem: number;
}

type Action =
  | { type: 'ADD_TEMPLATE'; template: OverlayTemplate }
  | { type: 'UPDATE_TEMPLATE'; template: OverlayTemplate }
  | { type: 'DELETE_TEMPLATE'; id: string }
  | { type: 'UPDATE_BRAND'; brand: BrandSettings }
  | { type: 'SET_ACTIVE'; id: string | null }
  | { type: 'SET_AGENDA_ITEM'; item: number };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.template] };
    case 'UPDATE_TEMPLATE':
      return { ...state, templates: state.templates.map(t => t.id === action.template.id ? action.template : t) };
    case 'DELETE_TEMPLATE':
      return { ...state, templates: state.templates.filter(t => t.id !== action.id) };
    case 'UPDATE_BRAND':
      return { ...state, brand: action.brand };
    case 'SET_ACTIVE':
      return { ...state, activeTemplateId: action.id, agendaItem: 0 };
    case 'SET_AGENDA_ITEM':
      return { ...state, agendaItem: action.item };
    default:
      return state;
  }
}

function loadState(): AppState {
  try {
    const saved = localStorage.getItem('teamcast-state');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { templates: DEFAULT_TEMPLATES, brand: DEFAULT_BRAND, activeTemplateId: null, agendaItem: 0 };
}

const StoreContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem('teamcast-state', JSON.stringify(state));
  }, [state]);

  return React.createElement(StoreContext.Provider, { value: { state, dispatch } }, children);
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function newTemplate(type: OverlayTemplate['type']): OverlayTemplate {
  const now = new Date().toISOString();
  const defaults: Record<OverlayTemplate['type'], OverlayTemplate['content']> = {
    'lower-third': { name: 'New Speaker', title: 'Job Title', subtitle: '', role: 'Speaker' },
    'title-card': { title: 'New Title', subtitle: '', description: '' },
    'agenda': { title: 'Agenda', items: ['Item 1', 'Item 2'], activeItem: 0 },
    'qr-code': { url: 'https://example.com', label: 'Scan Here', description: '' },
    'ticker': { label: 'LIVE', items: ['Breaking news item'], speed: 'medium' },
    'full-screen': { title: 'Title', subtitle: '', style: 'brand' },
  };
  const names: Record<OverlayTemplate['type'], string> = {
    'lower-third': 'New Lower Third',
    'title-card': 'New Title Card',
    'agenda': 'New Agenda',
    'qr-code': 'New QR Code',
    'ticker': 'New Ticker',
    'full-screen': 'New Full Screen',
  };
  return {
    id: uuidv4(),
    name: names[type],
    type,
    content: defaults[type],
    animation: 'slide-up',
    duration: 0,
    createdAt: now,
    updatedAt: now,
  };
}
