import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Radio } from 'lucide-react';
import { useStore } from '../../store';
import { sendMessage } from '../../lib/broadcast';
import { Button } from '../ui/Button';
import { Input, TextArea, Select } from '../ui/Input';
import { TypeBadge } from '../ui/Badge';
import { OverlayRenderer } from '../overlays/OverlayRenderer';
import type { OverlayTemplate, LowerThirdContent, TitleCardContent, AgendaContent, QRCodeContent, TickerContent, FullScreenContent } from '../../types';

export function TemplateEditor() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const original = state.templates.find(t => t.id === id);
  const [template, setTemplate] = useState<OverlayTemplate | null>(original ?? null);
  const [preview, setPreview] = useState(false);

  useEffect(() => { if (original) setTemplate({ ...original }); }, [id]);

  if (!template) return <div className="p-8 text-white/40">Template not found.</div>;

  function update(patch: Partial<OverlayTemplate>) {
    setTemplate(t => t ? { ...t, ...patch } : t);
  }
  function updateContent(patch: Partial<OverlayTemplate['content']>) {
    setTemplate(t => t ? { ...t, content: { ...t.content, ...patch } } : t);
  }

  function save() {
    if (!template) return;
    const updated = { ...template, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_TEMPLATE', template: updated });
    if (state.activeTemplateId === template.id) {
      sendMessage({ type: 'ACTIVATE', template: updated, brand: state.brand });
    }
    navigate('/');
  }

  const c = template.content;

  return (
    <div className="flex h-full">
      {/* Editor panel */}
      <div className="w-80 flex-none bg-[#161b27] border-r border-white/5 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
          <button onClick={() => navigate('/')} className="text-white/40 hover:text-white cursor-pointer transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{template.name}</div>
            <TypeBadge type={template.type} />
          </div>
        </div>

        <div className="flex-1 p-4 space-y-5">
          {/* Meta */}
          <div className="space-y-3">
            <Input label="Template Name" value={template.name} onChange={e => update({ name: e.target.value })} />
            <Select
              label="Animation"
              value={template.animation}
              onChange={e => update({ animation: e.target.value as OverlayTemplate['animation'] })}
              options={[
                { value: 'slide-up', label: 'Slide Up' },
                { value: 'slide-down', label: 'Slide Down' },
                { value: 'slide-left', label: 'Slide from Right' },
                { value: 'fade', label: 'Fade In' },
              ]}
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                Auto-hide (seconds, 0 = manual)
              </label>
              <input
                type="number" min={0} max={60}
                value={template.duration}
                onChange={e => update({ duration: Number(e.target.value) })}
                className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-t border-white/5 pt-4">
            <div className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Content</div>
            <div className="space-y-3">
              {template.type === 'lower-third' && <LowerThirdFields content={c as LowerThirdContent} update={updateContent} />}
              {template.type === 'title-card' && <TitleCardFields content={c as TitleCardContent} update={updateContent} />}
              {template.type === 'agenda' && <AgendaFields content={c as AgendaContent} update={updateContent} />}
              {template.type === 'qr-code' && <QRCodeFields content={c as QRCodeContent} update={updateContent} />}
              {template.type === 'ticker' && <TickerFields content={c as TickerContent} update={updateContent} />}
              {template.type === 'full-screen' && <FullScreenFields content={c as FullScreenContent} update={updateContent} />}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-white/5 flex gap-2">
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => setPreview(p => !p)}>
            <Radio size={12} /> {preview ? 'Hide' : 'Preview'}
          </Button>
          <Button size="sm" className="flex-1" onClick={save}>
            <Save size={12} /> Save
          </Button>
        </div>
      </div>

      {/* Preview canvas */}
      <div className="flex-1 bg-[#0d1117] relative overflow-hidden flex items-center justify-center">
        <div
          className="relative bg-gray-800 rounded-lg overflow-hidden shadow-2xl"
          style={{ width: 'min(100%, calc(100vh * 16/9))', aspectRatio: '16/9' }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/20 text-sm font-medium">Preview Canvas — 16:9</span>
          </div>
          <OverlayRenderer template={template} brand={state.brand} visible={preview} agendaItem={0} />
        </div>
      </div>
    </div>
  );
}

// Content field components for each type
function LowerThirdFields({ content, update }: { content: LowerThirdContent; update: (p: Partial<LowerThirdContent>) => void }) {
  return <>
    <Input label="Name" value={content.name} onChange={e => update({ name: e.target.value })} placeholder="Jane Smith" />
    <Input label="Title / Role" value={content.title} onChange={e => update({ title: e.target.value })} placeholder="VP of Product" />
    <Input label="Company / Subtitle" value={content.subtitle} onChange={e => update({ subtitle: e.target.value })} placeholder="Acme Corp" />
    <Select label="Role Badge" value={content.role} onChange={e => update({ role: e.target.value as LowerThirdContent['role'] })}
      options={[
        { value: '', label: 'None' },
        ...['Speaker', 'Moderator', 'Host', 'Guest', 'Panelist', 'Expert'].map(r => ({ value: r, label: r }))
      ]}
    />
  </>;
}

function TitleCardFields({ content, update }: { content: TitleCardContent; update: (p: Partial<TitleCardContent>) => void }) {
  return <>
    <Input label="Title" value={content.title} onChange={e => update({ title: e.target.value })} placeholder="Q2 All-Hands" />
    <Input label="Subtitle" value={content.subtitle} onChange={e => update({ subtitle: e.target.value })} placeholder="April 2026" />
    <TextArea label="Description" value={content.description} onChange={e => update({ description: e.target.value })} rows={3} placeholder="Session description..." />
  </>;
}

function AgendaFields({ content, update }: { content: AgendaContent; update: (p: Partial<AgendaContent>) => void }) {
  return <>
    <Input label="Title" value={content.title} onChange={e => update({ title: e.target.value })} />
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Items (one per line)</label>
      <TextArea
        rows={6}
        value={content.items.join('\n')}
        onChange={e => update({ items: e.target.value.split('\n').filter(Boolean) })}
        placeholder="Welcome&#10;Q1 Results&#10;Roadmap&#10;Q&A"
      />
    </div>
  </>;
}

function QRCodeFields({ content, update }: { content: QRCodeContent; update: (p: Partial<QRCodeContent>) => void }) {
  return <>
    <Input label="URL" value={content.url} onChange={e => update({ url: e.target.value })} placeholder="https://example.com" />
    <Input label="Label" value={content.label} onChange={e => update({ label: e.target.value })} placeholder="Scan for resources" />
    <Input label="Description" value={content.description} onChange={e => update({ description: e.target.value })} placeholder="Meeting slides" />
  </>;
}

function TickerFields({ content, update }: { content: TickerContent; update: (p: Partial<TickerContent>) => void }) {
  return <>
    <Input label="Ticker Label" value={content.label} onChange={e => update({ label: e.target.value })} placeholder="LIVE" />
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Items (one per line)</label>
      <TextArea rows={5} value={content.items.join('\n')} onChange={e => update({ items: e.target.value.split('\n').filter(Boolean) })} placeholder="Item 1&#10;Item 2&#10;Item 3" />
    </div>
    <Select label="Speed" value={content.speed} onChange={e => update({ speed: e.target.value as TickerContent['speed'] })}
      options={[{ value: 'slow', label: 'Slow' }, { value: 'medium', label: 'Medium' }, { value: 'fast', label: 'Fast' }]}
    />
  </>;
}

function FullScreenFields({ content, update }: { content: FullScreenContent; update: (p: Partial<FullScreenContent>) => void }) {
  return <>
    <Input label="Title" value={content.title} onChange={e => update({ title: e.target.value })} />
    <Input label="Subtitle" value={content.subtitle} onChange={e => update({ subtitle: e.target.value })} />
    <Select label="Style" value={content.style} onChange={e => update({ style: e.target.value as FullScreenContent['style'] })}
      options={[{ value: 'brand', label: 'Brand Gradient' }, { value: 'dark', label: 'Dark' }, { value: 'minimal', label: 'Minimal Light' }]}
    />
  </>;
}
