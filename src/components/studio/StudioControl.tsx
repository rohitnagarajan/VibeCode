import { useState } from 'react';
import { Radio, StopCircle, ChevronLeft, ChevronRight, ExternalLink, Tv2 } from 'lucide-react';
import { useStore } from '../../store';
import { sendMessage } from '../../lib/broadcast';
import { Button } from '../ui/Button';
import { TypeBadge } from '../ui/Badge';
import { OverlayRenderer } from '../overlays/OverlayRenderer';
import type { AgendaContent } from '../../types';

export function StudioControl() {
  const { state, dispatch } = useStore();
  const [outputConnected, setOutputConnected] = useState(false);

  const activeTemplate = state.templates.find(t => t.id === state.activeTemplateId);

  function activate(id: string) {
    const t = state.templates.find(x => x.id === id);
    if (!t) return;
    dispatch({ type: 'SET_ACTIVE', id });
    sendMessage({ type: 'ACTIVATE', template: t, brand: state.brand, agendaItem: 0 });
  }

  function deactivate() {
    dispatch({ type: 'SET_ACTIVE', id: null });
    sendMessage({ type: 'DEACTIVATE' });
  }

  function setAgendaItem(item: number) {
    dispatch({ type: 'SET_AGENDA_ITEM', item });
    sendMessage({ type: 'SET_AGENDA_ITEM', item });
  }

  function openOutput() {
    const win = window.open(
      window.location.origin + import.meta.env.BASE_URL + '#/output',
      'teamcast-output',
      'width=1280,height=720,toolbar=no,menubar=no,scrollbars=no'
    );
    setOutputConnected(!!win);
  }

  const agendaContent = activeTemplate?.type === 'agenda' ? activeTemplate.content as AgendaContent : null;

  return (
    <div className="flex h-full">
      {/* Left: Template list */}
      <div className="w-72 flex-none bg-[#161b27] border-r border-white/5 flex flex-col overflow-y-auto">
        <div className="px-4 py-4 border-b border-white/5">
          <h2 className="text-sm font-bold text-white">Templates</h2>
          <p className="text-xs text-white/40 mt-0.5">Click to go live instantly</p>
        </div>
        <div className="flex-1 p-3 space-y-2">
          {state.templates.map(t => {
            const isActive = state.activeTemplateId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => isActive ? deactivate() : activate(t.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-blue-600/20 border-blue-500/40 shadow-lg shadow-blue-500/10'
                    : 'bg-white/3 border-white/5 hover:bg-white/8 hover:border-white/15'
                }`}
              >
                <div className={`w-2 h-2 rounded-full flex-none ${isActive ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{t.name}</div>
                  <TypeBadge type={t.type} />
                </div>
                {isActive && <Radio size={14} className="text-red-400 flex-none" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Preview + controls */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${activeTemplate ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
            <span className="text-sm font-medium text-white">
              {activeTemplate ? `LIVE: ${activeTemplate.name}` : 'No Active Overlay'}
            </span>
          </div>
          <div className="flex-1" />
          {activeTemplate && (
            <Button variant="danger" size="sm" onClick={deactivate}>
              <StopCircle size={12} /> Take Off Air
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={openOutput}>
            <ExternalLink size={12} /> Output Window
          </Button>
        </div>

        {/* Preview */}
        <div className="flex-1 p-6 flex flex-col gap-4">
          <div
            className="relative bg-gray-900 rounded-xl overflow-hidden flex-1 shadow-2xl"
            style={{ aspectRatio: '16/9', maxHeight: 'calc(100vh - 280px)' }}
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
            {!activeTemplate && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                <Tv2 size={48} className="mb-3" />
                <p className="text-sm">Select a template to preview</p>
              </div>
            )}
            {activeTemplate && (
              <OverlayRenderer
                template={activeTemplate}
                brand={state.brand}
                visible={true}
                agendaItem={state.agendaItem}
              />
            )}
          </div>

          {/* Agenda controls */}
          {agendaContent && (
            <div className="bg-[#161b27] rounded-xl p-4 border border-white/5">
              <div className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Agenda Navigation</div>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary" size="sm"
                  disabled={state.agendaItem === 0}
                  onClick={() => setAgendaItem(state.agendaItem - 1)}
                >
                  <ChevronLeft size={14} /> Previous
                </Button>
                <div className="flex-1 flex items-center gap-2 overflow-x-auto">
                  {agendaContent.items.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setAgendaItem(i)}
                      className={`flex-none px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all whitespace-nowrap ${
                        i === state.agendaItem
                          ? 'bg-blue-600 text-white'
                          : i < state.agendaItem
                          ? 'bg-white/5 text-white/30 line-through'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {i + 1}. {item}
                    </button>
                  ))}
                </div>
                <Button
                  variant="secondary" size="sm"
                  disabled={state.agendaItem >= agendaContent.items.length - 1}
                  onClick={() => setAgendaItem(state.agendaItem + 1)}
                >
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}

          {/* Output window tip */}
          {!outputConnected && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-300">
              <strong>Tip:</strong> Open the Output Window and screen-share it in Zoom, Teams, Meet, or any platform.
              Your overlays will appear live for all participants.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
