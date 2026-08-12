import React from 'react';
import { ListFilter, PieChart, Sparkles, Smartphone } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, onFocusPrompt }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden backdrop-blur-xl bg-slate-950/90 light-mode:bg-white/90 border-t border-slate-800/80 light-mode:border-slate-200 pb-safe">
      <div className="flex items-center justify-around px-4 py-2">
        
        {/* Feed Tab */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            activeTab === 'feed'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-500 light-mode:text-slate-400'
          }`}
        >
          <ListFilter className="w-5 h-5" />
          <span className="text-[10px]">Expenses</span>
        </button>

        {/* Floating Quick Prompt Button */}
        <button
          onClick={onFocusPrompt}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg glow-primary -mt-5 border-2 border-slate-950 active:scale-90 transition-transform"
          title="Add Expense Prompt"
        >
          <Sparkles className="w-6 h-6" />
        </button>

        {/* Analytics Tab */}
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            activeTab === 'analytics'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-500 light-mode:text-slate-400'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px]">Analytics</span>
        </button>

      </div>
    </div>
  );
}
