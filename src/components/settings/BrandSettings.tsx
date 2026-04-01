import { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { useStore } from '../../store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DEFAULT_BRAND } from '../../lib/defaults';
import type { BrandSettings as BS } from '../../types';

const FONTS = [
  'system-ui', 'Inter', 'Georgia', 'Arial', '"Times New Roman"',
  '"Courier New"', 'Verdana', 'Trebuchet MS',
];

export function BrandSettings() {
  const { state, dispatch } = useStore();
  const [brand, setBrand] = useState<BS>({ ...state.brand });
  const [saved, setSaved] = useState(false);

  function update(patch: Partial<BS>) { setBrand(b => ({ ...b, ...patch })); setSaved(false); }

  function save() {
    dispatch({ type: 'UPDATE_BRAND', brand });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function reset() { setBrand({ ...DEFAULT_BRAND }); setSaved(false); }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => update({ logoUrl: ev.target?.result as string });
    reader.readAsDataURL(file);
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white">Brand Settings</h1>
          <p className="text-sm text-white/40 mt-0.5">Customize colors, fonts, and logo for all overlays</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={reset}><RefreshCw size={12} /> Reset</Button>
          <Button size="sm" onClick={save} variant={saved ? 'success' : 'primary'}>
            <Save size={12} /> {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Identity */}
        <section className="bg-[#161b27] rounded-xl p-5 border border-white/5 space-y-4">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Identity</h2>
          <Input label="Company / Team Name" value={brand.companyName} onChange={e => update({ companyName: e.target.value })} placeholder="Acme Corp" />
          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Team Logo</label>
            <div className="flex items-center gap-4">
              {brand.logoUrl ? (
                <img src={brand.logoUrl} alt="Logo" className="h-12 w-auto object-contain bg-white/5 rounded-lg p-2" />
              ) : (
                <div className="h-12 w-24 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-xs text-white/30">No logo</div>
              )}
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 cursor-pointer transition-all">
                Upload Logo
                <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
              </label>
              {brand.logoUrl && (
                <button onClick={() => update({ logoUrl: '' })} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">Remove</button>
              )}
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="bg-[#161b27] rounded-xl p-5 border border-white/5 space-y-4">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Brand Colors</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'primaryColor', label: 'Primary Color' },
              { key: 'secondaryColor', label: 'Secondary Color' },
              { key: 'accentColor', label: 'Accent Color' },
              { key: 'textColor', label: 'Text Color' },
            ].map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">{label}</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-3 py-2">
                  <input
                    type="color"
                    value={brand[key as keyof BS] as string}
                    onChange={e => update({ [key]: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-sm text-white font-mono">{brand[key as keyof BS] as string}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="bg-[#161b27] rounded-xl p-5 border border-white/5 space-y-4">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Typography</h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Font Family</label>
            <select
              value={brand.fontFamily}
              onChange={e => update({ fontFamily: e.target.value })}
              className="bg-[#0d1117] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: brand.fontFamily }}
            >
              {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
            </select>
          </div>
        </section>

        {/* Preview */}
        <section className="bg-[#161b27] rounded-xl p-5 border border-white/5">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Preview</h2>
          <div className="rounded-lg overflow-hidden" style={{ background: `linear-gradient(135deg, ${brand.secondaryColor}, ${brand.primaryColor})`, fontFamily: brand.fontFamily }}>
            <div className="p-8 text-center">
              {brand.logoUrl && <img src={brand.logoUrl} alt="" className="h-8 mx-auto mb-4 object-contain" />}
              <div className="text-white font-bold text-2xl">{brand.companyName}</div>
              <div className="text-white/70 text-sm mt-1">Live Graphics Overlay</div>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: brand.accentColor }}>
                <span className="text-white text-sm font-semibold">Accent Button</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
