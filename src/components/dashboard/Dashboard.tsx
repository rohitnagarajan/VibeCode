import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore, newTemplate } from '../../store';
import { Button } from '../ui/Button';
import { TemplateCard } from './TemplateCard';
import type { OverlayType } from '../../types';

const TYPES: { type: OverlayType; label: string; desc: string; icon: string }[] = [
  { type: 'lower-third', label: 'Lower Third', desc: 'Speaker name & title bar', icon: '🎙' },
  { type: 'title-card', label: 'Title Card', desc: 'Full-screen session title', icon: '🖼' },
  { type: 'agenda', label: 'Agenda', desc: 'Meeting agenda with progress', icon: '📋' },
  { type: 'qr-code', label: 'QR Code', desc: 'Scannable link overlay', icon: '📱' },
  { type: 'ticker', label: 'News Ticker', desc: 'Scrolling bottom ticker', icon: '📰' },
  { type: 'full-screen', label: 'Full Screen', desc: 'Break or intro screen', icon: '✨' },
];

export function Dashboard() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);

  const filtered = state.templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  function createTemplate(type: OverlayType) {
    const t = newTemplate(type);
    dispatch({ type: 'ADD_TEMPLATE', template: t });
    navigate(`/editor/${t.id}`);
    setShowNew(false);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white">Template Library</h1>
          <p className="text-sm text-white/40 mt-0.5">{state.templates.length} overlays ready to go live</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus size={14} /> New Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Template grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <p className="text-base">No templates yet</p>
          <p className="text-sm mt-1">Create your first overlay to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      )}

      {/* New Template Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowNew(false)} />
          <div className="relative bg-[#161b27] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-base font-bold text-white mb-1">Choose Overlay Type</h2>
            <p className="text-sm text-white/40 mb-5">Select the type of graphic overlay to create</p>
            <div className="grid grid-cols-2 gap-3">
              {TYPES.map(({ type, label, desc, icon }) => (
                <button
                  key={type}
                  onClick={() => createTemplate(type)}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-left transition-all cursor-pointer"
                >
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">{label}</div>
                    <div className="text-xs text-white/40 mt-0.5">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
