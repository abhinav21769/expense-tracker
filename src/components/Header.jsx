import React from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Sun, 
  Moon, 
  Search, 
  Download, 
  PlusCircle, 
  Wallet,
  CloudLightning,
  Calendar
} from 'lucide-react';

export default function Header({
  theme,
  toggleTheme,
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
  selectedMonth,
  setSelectedMonth,
  availableMonths,
  onOpeniOSModal,
  onOpenExportModal,
  onOpenCategoryModal,
  onOpenCloudSyncModal,
  isSyncing
}) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 light-mode:bg-white/80 border-b border-slate-800/80 light-mode:border-slate-200 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg glow-primary text-white font-bold text-lg">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 light-mode:from-slate-900 light-mode:to-slate-700">
                  Prompt Expense
                </h1>
                <span className="hidden xs:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 light-mode:bg-indigo-100 light-mode:text-indigo-700 border border-indigo-500/20">
                  <Sparkles className="w-3 h-3 text-indigo-400" /> Smart PWA
                </span>
              </div>
              <p className="text-xs text-slate-400 light-mode:text-slate-500 hidden sm:block">
                Type <span className="text-indigo-400 font-mono font-medium light-mode:text-indigo-600">"metro 41"</span> to log expenses instantly
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Cloud Sync Button */}
            <button
              onClick={onOpenCloudSyncModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all active:scale-95 ${
                isSyncing
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 light-mode:text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/25'
              }`}
              title="Cloud Sync (Mobile ↔ Laptop)"
            >
              <CloudLightning className={`w-4 h-4 ${isSyncing ? 'animate-pulse text-amber-400' : 'text-emerald-400'}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Cloud Sync'}</span>
            </button>

            {/* iOS Add to Home Screen Button */}
            <button
              onClick={onOpeniOSModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-500/15 to-purple-500/15 hover:from-indigo-500/25 hover:to-purple-500/25 text-indigo-300 light-mode:text-indigo-700 border border-indigo-500/20 active:scale-95"
              title="Install App on iPhone / iOS"
            >
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">iOS App</span>
            </button>

            <button
              onClick={onOpenCategoryModal}
              className="p-2 rounded-xl bg-slate-900 light-mode:bg-slate-100 text-slate-300 light-mode:text-slate-700 border border-slate-800 light-mode:border-slate-200 hover:bg-slate-800 light-mode:hover:bg-slate-200 active:scale-95"
              title="Manage Custom Categories"
            >
              <PlusCircle className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={onOpenExportModal}
              className="p-2 rounded-xl bg-slate-900 light-mode:bg-slate-100 text-slate-300 light-mode:text-slate-700 border border-slate-800 light-mode:border-slate-200 hover:bg-slate-800 light-mode:hover:bg-slate-200 active:scale-95"
              title="Export CSV or JSON"
            >
              <Download className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900 light-mode:bg-slate-100 text-slate-300 light-mode:text-slate-700 border border-slate-800 light-mode:border-slate-200 hover:bg-slate-800 light-mode:hover:bg-slate-200 active:scale-95"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Search & Month Filter Toolbar */}
        <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/40 light-mode:border-slate-200/60">
          
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses or prompts..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900/90 light-mode:bg-slate-100 text-slate-100 light-mode:text-slate-900 border border-slate-800 light-mode:border-slate-300 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Month Dropdown Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 light-mode:bg-slate-100 p-1 rounded-xl border border-slate-800 light-mode:border-slate-300 text-xs">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 ml-1.5" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-slate-100 light-mode:text-slate-900 font-semibold focus:outline-none text-xs pr-1 cursor-pointer"
            >
              <option value="all" className="bg-slate-900 light-mode:bg-white text-slate-100 light-mode:text-slate-900">
                All Months
              </option>
              {availableMonths.map(m => (
                <option key={m.value} value={m.value} className="bg-slate-900 light-mode:bg-white text-slate-100 light-mode:text-slate-900">
                  {m.label}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>
    </header>
  );
}
