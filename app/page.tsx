'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTokens } from '@/lib/api';

import { TokenCardGrid, ErrorBoundary } from '@/components/organisms';
import type { TokenPair } from '@/types';

export default function Home() {
  const [displayOpen, setDisplayOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'mc' | 'volume' | 'price' | 'age'>('mc');
  const [mobileTab, setMobileTab] = React.useState<'new' | 'final-stretch' | 'migrated'>('new');

  
  const [metricSize, setMetricSize] = React.useState<'small' | 'large'>('small');
  const [quickBuy, setQuickBuy] = React.useState<'small' | 'large' | 'mega' | 'ultra'>('small');
  const [themeGrey, setThemeGrey] = React.useState<boolean>(false);

  const [showSearch, setShowSearch] = React.useState<boolean>(true);
  const [noDecimals, setNoDecimals] = React.useState<boolean>(false);
  const [showHidden, setShowHidden] = React.useState<boolean>(false);
  const [unhideMigrated, setUnhideMigrated] = React.useState<boolean>(false);
  const [circleImages, setCircleImages] = React.useState<boolean>(false);

  // Hydrate from localStorage on client after mount to avoid hydration mismatch
  React.useEffect(() => {
    try {
      const ms = localStorage.getItem('ui.metricSize');
      if (ms === 'small' || ms === 'large') setMetricSize(ms);
      const qb = localStorage.getItem('ui.quickBuy');
      if (qb === 'small' || qb === 'large' || qb === 'mega' || qb === 'ultra') setQuickBuy(qb as any);
      const tg = localStorage.getItem('ui.themeGrey');
      if (tg !== null) setThemeGrey(tg === '1');

      const ss = localStorage.getItem('ui.showSearch');
      if (ss !== null) setShowSearch(ss === '1');
      const nd = localStorage.getItem('ui.noDecimals');
      if (nd !== null) setNoDecimals(nd === '1');
      const sh = localStorage.getItem('ui.showHidden');
      if (sh !== null) setShowHidden(sh === '1');
      const um = localStorage.getItem('ui.unhideMigrated');
      if (um !== null) setUnhideMigrated(um === '1');
      const ci = localStorage.getItem('ui.circleImages');
      if (ci !== null) setCircleImages(ci === '1');
    } catch (e) {
      // ignore - defensive
    }
  }, []);

  // persist settings
  React.useEffect(() => {
    try {
      localStorage.setItem('ui.metricSize', metricSize);
      localStorage.setItem('ui.quickBuy', quickBuy);
      localStorage.setItem('ui.themeGrey', themeGrey ? '1' : '0');
      localStorage.setItem('ui.showSearch', showSearch ? '1' : '0');
      localStorage.setItem('ui.noDecimals', noDecimals ? '1' : '0');
      localStorage.setItem('ui.showHidden', showHidden ? '1' : '0');
      localStorage.setItem('ui.unhideMigrated', unhideMigrated ? '1' : '0');
      localStorage.setItem('ui.circleImages', circleImages ? '1' : '0');
    } catch (e) {}
  }, [metricSize, quickBuy, themeGrey, showSearch, noDecimals, showHidden, unhideMigrated, circleImages]);

  // Fetch initial token data
  const { data: tokens = [], isLoading, error } = useQuery<TokenPair[]>({
    queryKey: ['tokens', sortBy, showHidden],
    queryFn: () => fetchTokens({ sortBy, includeHidden: showHidden, unhideMigrated }),
  });

  // Disable WebSocket initially for better performance
  const [wsEnabled, setWsEnabled] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setWsEnabled(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // dynamically import the client-only websocket helper to avoid SSR/import errors
  React.useEffect(() => {
    if (!wsEnabled) return;
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const mod = await import('@/hooks/useWebSocketMock');
        const init = (mod as any).useWebSocketMock || (mod as any).default;
        if (typeof init === 'function') {
          try {
            const maybeCleanup = init(true);
            if (typeof maybeCleanup === 'function') cleanup = maybeCleanup;
          } catch (err) {
            console.warn('Loaded websocket module; it may export a hook instead of an init function.', err);
          }
        }
      } catch (err) {
        console.error('Failed to load websocket helper:', err);
      }
    })();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [wsEnabled]);

  // improved click-outside + ESC handling for display panel 
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!displayOpen) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!dropdownRef.current || !target) return;
      if (!dropdownRef.current.contains(target)) setDisplayOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDisplayOpen(false);
    };

    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [displayOpen]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">Error loading tokens</h2>
          <p className="text-gray-400">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main className={`h-screen overflow-hidden bg-black text-gray-100 flex flex-col ${themeGrey ? 'bg-[#0b0b0b]' : ''}`}>
        {/* Top Header */}
        <header className="border-b border-gray-800/50 bg-black z-20 shrink-0">
          <div className="px-3 sm:px-6 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              {/* Left - Logo and Nav */}
              <div className="flex items-center gap-6">
                <img
                  src="/logo.png"
                  alt="AXIOM Pro"
                  className="h-11 w-auto"
                />
                <nav className="hidden xl:flex items-center gap-8 text-sm">
                  <a href="#" className="text-white hover:text-blue-400 transition-colors font-semibold text-[13px]">Discover</a>
                  <a href="#" className="text-blue-500 font-semibold text-[13px]">Pulse</a>
                  <a href="#" className="text-white hover:text-blue-400 transition-colors font-semibold text-[13px]">Trackers</a>
                  <a href="#" className="text-white hover:text-blue-400 transition-colors font-semibold text-[13px]">Perpetuals</a>
                  <a href="#" className="text-white hover:text-blue-400 transition-colors font-semibold text-[13px]">Yield</a>
                  <a href="#" className="text-white hover:text-blue-400 transition-colors font-semibold text-[13px]">Vision</a>
                  <a href="#" className="text-white hover:text-blue-400 transition-colors font-semibold text-[13px]">Portfolio</a>
                </nav>
              </div>

              
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Search Bar - hide on small/medium or if setting is false */}
                {showSearch && (
                  <div className="relative hidden xl:block">
                    <svg className="w-5 h-5 text-white absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by token or CA..."
                      className="w-64 pl-10 pr-4 py-2 text-[12px] bg-[#0a0a0a] border border-gray-700/50 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
                    />
                  </div>
                )}

                <div className="relative">
                  <button
                    onClick={() => setDisplayOpen(!displayOpen)}
                    aria-expanded={displayOpen}
                    className="flex items-center gap-2 px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-700/50 rounded-full text-sm transition-colors"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span className="text-white font-medium">Display</span>
                    <svg className={`w-3.5 h-3.5 text-white transition-transform ${displayOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown / Panel */}
                  {displayOpen && (
                    <>
                      {/* Mobile sheet: full screen bottom sheet */}
                      <div className="md:hidden fixed inset-0 z-50">
                        <div className="absolute inset-0 bg-black/70" onClick={() => setDisplayOpen(false)} />
                        <div ref={dropdownRef} className="absolute bottom-0 left-0 right-0 bg-[#0f1012] border-t border-gray-800/50 rounded-t-2xl p-4 max-h-[80vh] overflow-auto">
                          {/* Panel content (same as desktop) */}
                          <PanelContent
                            metricSize={metricSize}
                            setMetricSize={setMetricSize}
                            quickBuy={quickBuy}
                            setQuickBuy={setQuickBuy}
                            themeGrey={themeGrey}
                            setThemeGrey={setThemeGrey}
                            showSearch={showSearch}
                            setShowSearch={setShowSearch}
                            noDecimals={noDecimals}
                            setNoDecimals={setNoDecimals}
                            showHidden={showHidden}
                            setShowHidden={setShowHidden}
                            unhideMigrated={unhideMigrated}
                            setUnhideMigrated={setUnhideMigrated}
                            circleImages={circleImages}
                            setCircleImages={setCircleImages}
                            sortBy={sortBy}
                            setSortBy={(s: any) => { setSortBy(s); setDisplayOpen(false); }}
                          />
                        </div>
                      </div>

                      {/* Desktop popover: anchored to button (uses parent .relative) */}
                      <div className="hidden md:block absolute right-0 mt-2 z-50 w-[420px]">
                        <div ref={dropdownRef} className="rounded-lg shadow-xl bg-[#0f1012] border border-gray-800/50 overflow-hidden">
                          <div className="p-4 max-h-[70vh] overflow-auto">
                            <PanelContent
                              metricSize={metricSize}
                              setMetricSize={setMetricSize}
                              quickBuy={quickBuy}
                              setQuickBuy={setQuickBuy}
                              themeGrey={themeGrey}
                              setThemeGrey={setThemeGrey}
                              showSearch={showSearch}
                              setShowSearch={setShowSearch}
                              noDecimals={noDecimals}
                              setNoDecimals={setNoDecimals}
                              showHidden={showHidden}
                              setShowHidden={setShowHidden}
                              unhideMigrated={unhideMigrated}
                              setUnhideMigrated={setUnhideMigrated}
                              circleImages={circleImages}
                              setCircleImages={setCircleImages}
                              sortBy={sortBy}
                              setSortBy={(s: any) => { setSortBy(s); setDisplayOpen(false); }}
                            />
                          </div>

                          
                          <div className="px-4 py-3 border-t border-gray-800/50 flex items-center gap-2 bg-[#0f1012]">
                            <SortButtons sortBy={sortBy} setSortBy={(s: any) => setSortBy(s)} close={() => setDisplayOpen(false)} />
                            <button
                              onClick={() => setDisplayOpen(false)}
                              className="px-3 py-2 rounded-md bg-transparent border border-gray-700/40 text-gray-300 hover:bg-gray-800"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col mx-1.5">
          <div className="max-w-[1600px] mx-auto w-full px-4 flex flex-col h-full">
            <div className="hidden lg:flex items-center justify-start gap-2 shrink-0">
              <button className="w-7 h-7 rounded bg-[#0a0a0a] hover:bg-gray-800/70 border border-gray-700/50 flex items-center justify-center transition-colors">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button className="w-7 h-7 rounded bg-[#0a0a0a] hover:bg-gray-800/70 border border-gray-700/50 flex items-center justify-center transition-colors">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <button className="w-7 h-7 rounded bg-[#0a0a0a] hover:bg-gray-800/70 border border-gray-700/50 flex items-center justify-center transition-colors">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* Pulse Header Row */}
            <div className="flex items-center justify-between py-4.5 shrink-0 border-b border-gray-800/30">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-[20px] font-semibold ml-1 text-white">Pulse</h2>

                <button
                  className="w-7 h-7 rounded bg-black hover:bg-gray-900 border border-black flex items-center justify-center transition-colors"
                  aria-label="Menu"
                >
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <button
                  className="w-7 h-7 rounded bg-black hover:bg-gray-900 border border-black flex items-center justify-center transition-colors"
                  aria-label="Packages"
                >
                  <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden lg:block">
                  {/* placeholder to keep spacing; functions remain */}
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Tab Navigation (below 1024px) */}
            <div className="lg:hidden flex gap-2 mb-3 shrink-0">
              <button
                onClick={() => setMobileTab('new')}
                className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                  mobileTab === 'new'
                    ? 'bg-[#1a1a1a] text-white border border-gray-700'
                    : 'bg-[#0a0a0a] text-gray-400 hover:text-white hover:bg-[#151515]'
                }`}
              >
                New Pairs
              </button>
              <button
                onClick={() => setMobileTab('final-stretch')}
                className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                  mobileTab === 'final-stretch'
                    ? 'bg-[#1a1a1a] text-white border border-gray-700'
                    : 'bg-[#0a0a0a] text-gray-400 hover:text-white hover:bg-[#151515]'
                }`}
              >
                Final Stretch
              </button>
              <button
                onClick={() => setMobileTab('migrated')}
                className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                  mobileTab === 'migrated'
                    ? 'bg-[#1a1a1a] text-white border border-gray-700'
                    : 'bg-[#0a0a0a] text-gray-400 hover:text-white hover:bg-[#151515]'
                }`}
              >
                Migrated
              </button>
            </div>

            {/* Token Card Grid - Three Columns */}
            <TokenCardGrid
              tokens={tokens}
              isLoading={isLoading}
              globalSortBy={sortBy}
              mobileTab={mobileTab}
              {...({ metricSize, quickBuy, themeGrey, showSearch, noDecimals, showHidden, unhideMigrated, circleImages } as any)}
            />
          </div>
        </div>

        {/* Footer Stats Bar */}
        <footer className="border-t border-gray-800/50 bg-black shrink-0 hidden md:block">
          <div className="px-6 py-2.5">
            {/* footer content */}
          </div>
        </footer>
      </main>
    </ErrorBoundary>
  );
}


function PanelContent({
  metricSize, setMetricSize,
  quickBuy, setQuickBuy,
  themeGrey, setThemeGrey,
  showSearch, setShowSearch,
  noDecimals, setNoDecimals,
  showHidden, setShowHidden,
  unhideMigrated, setUnhideMigrated,
  circleImages, setCircleImages,
  sortBy, setSortBy,
}: any) {
  return (
    <>
      {/* Top row: Metrics + Quick Buy */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-gray-400 font-semibold mb-2">Metrics</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMetricSize('small')}
              className={`py-3 px-3 rounded-lg text-sm text-center transition ${metricSize === 'small' ? 'bg-gray-700 text-white' : 'bg-[#0a0a0a] text-gray-300 hover:bg-gray-800'}`}
            >
              <div className="text-xs text-gray-300 tracking-tight">MC 77K</div>
              <div className="font-semibold mt-1">Small</div>
            </button>

            <button
              onClick={() => setMetricSize('large')}
              className={`py-3 px-3 rounded-lg text-sm text-center transition ${metricSize === 'large' ? 'bg-gray-700 text-white' : 'bg-[#0a0a0a] text-gray-300 hover:bg-gray-800'}`}
            >
              <div className="text-xs text-gray-300 tracking-tight">MC 77K</div>
              <div className="font-semibold mt-1">Large</div>
            </button>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-400 font-semibold mb-2">Quick Buy</div>
          <div className="grid grid-cols-4 gap-2">
            {(['small', 'large', 'mega', 'ultra'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setQuickBuy(s)}
                className={`py-2 px-2 rounded-md text-xs text-center transition ${quickBuy === s ? 'bg-indigo-600 text-white' : 'bg-[#0a0a0a] text-gray-300 hover:bg-gray-800'}`}
                title={s}
              >
                <div className="font-semibold">⚡7</div>
                <div className="text-[11px] text-gray-300 mt-1">{s}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* theme row */}
      <div className="mt-4 border-t border-gray-800/50 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/></svg>
          <div>
            <div className="text-sm text-white font-medium">Grey</div>
            <div className="text-xs text-gray-400">Theme</div>
          </div>
        </div>
        <button
          onClick={() => setThemeGrey(!themeGrey)}
          className={`relative inline-flex items-center h-5 w-10 rounded-full transition-colors focus:outline-none ${themeGrey ? 'bg-gray-600' : 'bg-gray-700'}`}
          aria-pressed={themeGrey}
        >
          <span className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${themeGrey ? 'translate-x-5' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-4">
        <div className="flex items-center gap-3 border-b border-gray-800/50 pb-3">
          <Tab label="Layout" active={false} onClick={() => {}} />
          <Tab label="Metrics" active={false} onClick={() => {}} />
          <Tab label="Row" active={false} onClick={() => {}} />
          <Tab label="Extras" active={true} onClick={() => {}} />
        </div>

        {/* Extras content */}
        <div className="mt-3 space-y-3">
          <ToggleRow label="Show Search Bar" sub="Toggle the top search box" checked={showSearch} onChange={() => setShowSearch(!showSearch)} />
          <ToggleRow label="No Decimals" sub="Round numbers" checked={noDecimals} onChange={() => setNoDecimals(!noDecimals)} />
          <ToggleRow label="Show Hidden Tokens" sub="Reveal hidden tokens" checked={showHidden} onChange={() => setShowHidden(!showHidden)} />
          <ToggleRow label="Unhide on Migrated" sub="Auto unhide migrated tokens" checked={unhideMigrated} onChange={() => setUnhideMigrated(!unhideMigrated)} />
          <ToggleRow label="Circle Images" sub="Use circular token icons" checked={circleImages} onChange={() => setCircleImages(!circleImages)} />
        </div>
      </div>

      {/* Sort controls */}
      <div className="mt-4 md:hidden">
        <SortButtons sortBy={sortBy} setSortBy={setSortBy} close={() => {}} />
      </div>
    </>
  );
}

/* SortButtons: reusable set of sorting controls */
function SortButtons({ sortBy, setSortBy, close }: any) {
  const items: { key: any; label: string }[] = [
    { key: 'mc', label: 'Market Cap' },
    { key: 'volume', label: 'Volume' },
    { key: 'price', label: 'Price' },
    { key: 'age', label: 'Age' },
  ];
  return (
    <div className="flex flex-col md:flex-row gap-2 w-full">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => { setSortBy(it.key); if (close) close(); }}
          className={`flex-1 px-3 py-2 rounded-md transition ${sortBy === it.key ? 'bg-blue-600 text-white' : 'bg-[#0a0a0a] text-gray-300 hover:bg-gray-800'}`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

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
        <button onClick={onChange} className="focus:outline-none" aria-pressed={checked}>
          <div className={`w-10 h-5 rounded-full ${checked ? 'bg-gray-600' : 'bg-gray-700'} relative`}>
            <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transform ${checked ? 'translate-x-5' : ''}`} />
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
