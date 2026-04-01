import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Radio } from 'lucide-react';
import type { OverlayTemplate } from '../../types';
import { useStore } from '../../store';
import { TypeBadge } from '../ui/Badge';
import { sendMessage } from '../../lib/broadcast';

interface Props { template: OverlayTemplate }

const ICONS: Record<string, string> = {
  'lower-third': '🎙', 'title-card': '🖼', 'agenda': '📋',
  'qr-code': '📱', 'ticker': '📰', 'full-screen': '✨',
};

export function TemplateCard({ template }: Props) {
  const { dispatch, state } = useStore();
  const navigate = useNavigate();
  const isActive = state.activeTemplateId === template.id;

  function goLive() {
    if (isActive) {
      dispatch({ type: 'SET_ACTIVE', id: null });
      sendMessage({ type: 'DEACTIVATE' });
    } else {
      dispatch({ type: 'SET_ACTIVE', id: template.id });
      sendMessage({ type: 'ACTIVATE', template, brand: state.brand });
    }
  }

  return (
    <div className={`group relative flex flex-col bg-[#161b27] rounded-xl border transition-all ${isActive ? 'border-blue-500/60 shadow-lg shadow-blue-500/10' : 'border-white/5 hover:border-white/15'}`}>
      {/* Live indicator */}
      {isActive && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          LIVE
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-0.5">{ICONS[template.type]}</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-white truncate">{template.name}</div>
            <div className="mt-1"><TypeBadge type={template.type} /></div>
          </div>
        </div>
        <div className="mt-3 text-xs text-white/30">
          {template.duration > 0 ? `Auto-hide after ${template.duration}s` : 'Manual control'} · {template.animation}
        </div>
      </div>

      <div className="flex border-t border-white/5">
        <button
          onClick={goLive}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
            isActive ? 'text-red-400 hover:bg-red-500/10' : 'text-blue-400 hover:bg-blue-500/10'
          }`}
        >
          <Radio size={12} />
          {isActive ? 'Take Off Air' : 'Go Live'}
        </button>
        <div className="w-px bg-white/5" />
        <button
          onClick={() => navigate(`/editor/${template.id}`)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <Pencil size={12} />
        </button>
        <div className="w-px bg-white/5" />
        <button
          onClick={() => { if (confirm('Delete this template?')) { dispatch({ type: 'DELETE_TEMPLATE', id: template.id }); if (isActive) sendMessage({ type: 'DEACTIVATE' }); } }}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
