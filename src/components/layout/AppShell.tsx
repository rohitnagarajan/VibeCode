import React from 'react';
import { FileText } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f2f2]">
      <header className="bg-[#0070D2] text-white shadow-sm flex-none">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded p-1">
              <FileText size={16} />
            </div>
            <span className="font-semibold text-sm tracking-wide">Salesforce Quote Editor</span>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
