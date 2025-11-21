// components/molecules/DisplayMenu.tsx
'use client';

import React from 'react';
import { Sun } from 'lucide-react';

type SortKey = 'mc' | 'volume' | 'price' | 'age';

interface DisplayMenuProps {
  isOpen: boolean;
  toggleOpen: () => void;
  sortBy: SortKey;
  setSortBy: (s: SortKey) => void;
  // optional: if using an external button in parent, you can render only panel by passing `trigger={false}`
  trigger?: boolean;
}

/**
 * DisplayMenu - improved, accessible, and pixel-tight version.
 * - Handles click-outside + Escape internally.
 * - Fixed dimensions, scroll area, and footer actions stay pinned.
 */
const DisplayMenu: React.FC<DisplayMenuProps> = ({
  isOpen,
  toggleOpen,
  sortBy,
  setSortBy,
  trigger = true,
}) => {
  const [activeTab, setActiveTab] = React.useState<'layout' | 'metrics' | 'row' | 'extras'>('layout');

  // local ui state
  const [metricSize, setMetricSize] = React.useState<'small' | 'large'>('small');
  const [quickBuy, setQuickBuy] = React.useState<'small' | 'large' | 'mega' | 'ultra'>('small');
  const [themeGrey, setThemeGrey] = React.useState(true);

  const [showSearch, setShowSearch] = React.useState(true);
  const [noDecimals, setNoDecimals] = React.useState(false);
  const [showHidden, setShowHidden] = React.useState(false);
  const [unhideMigrated, setUnhideMigrated] = React.useState(false);
  const [circleImages, setCircleImages] = React.useState(false);

  const panelRef = React.useRef<HTMLDivElement | null>(null);

  // close on outside click
  React.useEffect(() => {
    if (!isOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (panelRef.current && !panelRef.current.contains(target)) {
        toggleOpen();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleOpen();
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, toggleOpen]);

  // small helper for toggle switch visual
  const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex items-center h-5 w-10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
        checked ? 'bg-gray-600' : 'bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="relative" aria-haspopup="menu">
      {/* optional internal trigger if you prefer */}
      {trigger && (
        <button
          onClick={toggleOpen}
          aria-expanded={isOpen}
          className="flex items-center gap-2 px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-700/50 rounded-full text-sm transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span className="text-white font-medium">Display</span>
          <svg className={`w-3.5 h-3.5 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Display settings"
          className="absolute right-0 top-full mt-2 z-50"
        >
          {/* container */}
          <div
            className="w-[420px] max-h-[68vh] bg-[#0f1012] border border-gray-800 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.7)] overflow-hidden"
            style={{ minWidth: 320 }}
          >
            {/* scroll area */}
            <div className="px-4 py-3 overflow-y-auto" style={{ maxHeight: 'calc(68vh - 72px)' }}>
              {/* top row: metrics + quick buy */}
              <div className="grid grid-cols-2 gap-3">
                {/* Metrics */}
                <div>
                  <div className="text-xs text-gray-400 font-semibold mb-2">Metrics</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setMetricSize('small')}
                      className={`py-3 px-3 rounded-lg text-sm text-center transition ${
                        metricSize === 'small' ? 'bg-gray-700 text-white' : 'bg-[#0a0a0a] text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <div className="text-xs text-gray-300 tracking-tight">MC 77K</div>
                      <div className="font-semibold mt-1">Small</div>
                    </button>

                    <button
                      onClick={() => setMetricSize('large')}
                      className={`py-3 px-3 rounded-lg text-sm text-center transition ${
                        metricSize === 'large' ? 'bg-gray-700 text-white' : 'bg-[#0a0a0a] text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <div className="text-xs text-gray-300 tracking-tight">MC 77K</div>
                      <div className="font-semibold mt-1">Large</div>
                    </button>
                  </div>
                </div>

                {/* Quick Buy */}
                <div>
                  <div className="text-xs text-gray-400 font-semibold mb-2">Quick Buy</div>
                  <div className="grid grid-cols-4 gap-2">
                    {(['small', 'large', 'mega', 'ultra'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuickBuy(s)}
                        className={`py-2 px-2 rounded-md text-xs text-center transition ${
                          quickBuy === s ? 'bg-indigo-600 text-white' : 'bg-[#0a0a0a] text-gray-300 hover:bg-gray-800'
                        }`}
                        title={s}
                      >
                        <div className="text-xxs">⚡7</div>
                        <div className="font-medium">{s[0].toUpperCase() + s.slice(1)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* theme row */}
              <div className="mt-4 border-t border-gray-800/50 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sun className="w-4 h-4 text-yellow-400" />
                  <div>
                    <div className="text-sm text-white font-medium">Grey</div>
                    <div className="text-xs text-gray-400">Theme</div>
                  </div>
                </div>
                <Switch checked={themeGrey} onChange={() => setThemeGrey(!themeGrey)} />
              </div>

              {/* Tabs */}
              <div className="mt-4">
                <div className="flex items-center gap-3 border-b border-gray-800/50 pb-3">
                  <Tab label="Layout" active={activeTab === 'layout'} onClick={() => setActiveTab('layout')} />
                  <Tab label="Metrics" active={activeTab === 'metrics'} onClick={() => setActiveTab('metrics')} />
                  <Tab label="Row" active={activeTab === 'row'} onClick={() => setActiveTab('row')} />
                  <Tab label="Extras" active={activeTab === 'extras'} onClick={() => setActiveTab('extras')} />
                </div>

                {/* content */}
                <div className="mt-3">
                  {activeTab === 'layout' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <button className="px-3 py-2 rounded-md bg-gray-700 text-white flex-1">Layout</button>
                        <button className="px-3 py-2 rounded-md bg-[#0a0a0a] text-gray-300">Metrics</button>
                        <button className="px-3 py-2 rounded-md bg-[#0a0a0a] text-gray-300">Row</button>
                        <button className="px-3 py-2 rounded-md bg-[#0a0a0a] text-gray-300">Extras</button>
                      </div>

                      <div className="grid gap-2">
                        <ToggleRow label="Show Search Bar" sub="Toggle the top search box" checked={showSearch} onChange={() => setShowSearch(!showSearch)} />
                        <ToggleRow label="No Decimals" sub="Round numbers" checked={noDecimals} onChange={() => setNoDecimals(!noDecimals)} />
                        <ToggleRow label="Show Hidden Tokens" sub="Reveal hidden tokens" checked={showHidden} onChange={() => setShowHidden(!showHidden)} />
                        <ToggleRow label="Unhide on Migrated" sub="Auto unhide migrated tokens" checked={unhideMigrated} onChange={() => setUnhideMigrated(!unhideMigrated)} />
                        <ToggleRow label="Circle Images" sub="Use circular token icons" checked={circleImages} onChange={() => setCircleImages(!circleImages)} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'metrics' && (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-300">Visible Metrics</div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <LabelCard title="Market Cap" />
                        <LabelCard title="Volume (24h)" />
                        <LabelCard title="Price" />
                        <LabelCard title="Liquidity" />
                      </div>
                    </div>
                  )}

                  {activeTab === 'row' && (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-300">Row Options</div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <SmallButton>Compact</SmallButton>
                        <SmallButton>Comfort</SmallButton>
                        <SmallButton>Detailed</SmallButton>
                        <SmallButton>Full</SmallButton>
                      </div>
                    </div>
                  )}

                  {activeTab === 'extras' && (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-300">Extra Controls</div>
                      <div className="mt-2">
                        <ToggleRow label="Enable advanced analytics" checked={false} onChange={() => {}} />
                        <ToggleRow label="Show developer metrics" checked={false} onChange={() => {}} className="mt-2" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* footer actions (pinned) */}
            <div className="px-4 py-3 border-t border-gray-800/50 flex items-center gap-2 bg-[#0f1012]">
              <button
                onClick={() => { setSortBy('mc'); toggleOpen(); }}
                className={`flex-1 px-3 py-2 rounded-md transition ${sortBy === 'mc' ? 'bg-blue-600 text-white' : 'bg-[#0a0a0a] text-gray-300 hover:bg-gray-800'}`}
              >
                Sort: Market Cap
              </button>

              <button
                onClick={toggleOpen}
                className="px-3 py-2 rounded-md bg-transparent border border-gray-700/40 text-gray-300 hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayMenu;

/* ----------------- small UI helpers below ----------------- */

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm transition ${active ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800/50'}`}
    >
      {label}
    </button>
  );
}

function ToggleRow({ label, sub, checked, onChange, className = '' }: any) {
  return (
    <label className={`flex items-center justify-between px-2 py-2 rounded-md bg-[#0b0b0b] ${className}`}>
      <div>
        <div className="text-sm text-white">{label}</div>
        {sub && <div className="text-xs text-gray-400">{sub}</div>}
      </div>
      <div>
        {/* the switch visual used above */}
        <button onClick={onChange} className="focus:outline-none" aria-pressed={checked}>
          <div className={`w-10 h-5 rounded-full ${checked ? 'bg-gray-600' : 'bg-gray-700'} relative`}>
            <span className={`absolute top-0.5 left-1 h-4 w-4 rounded-full bg-white transform transition ${checked ? 'translate-x-5' : ''}`}></span>
          </div>
        </button>
      </div>
    </label>
  );
}

function LabelCard({ title }: { title: string }) {
  return (
    <div className="px-3 py-3 rounded-md bg-[#0a0a0a] text-gray-300 text-sm">
      {title}
    </div>
  );
}

function SmallButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-3 py-3 rounded-md bg-[#0a0a0a] text-gray-300 text-sm hover:bg-gray-800 transition">{children}</button>
  );
}
