import React, { useState, useEffect } from 'react';
import { parseExpensePrompt } from '../utils/parser';
import CategoryIcon from './CategoryIcon';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Mic, 
  Zap,
  IndianRupee
} from 'lucide-react';

const PRESET_PROMPTS = [
  'metro 41',
  'coffee 150',
  'uber 250 yesterday',
  'groceries 1200',
  'lunch 250 food',
  'salary +45000'
];

export default function PromptBar({ onAddExpense, customCategories }) {
  const [prompt, setPrompt] = useState('');
  const [parsed, setParsed] = useState(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (prompt.trim().length > 0) {
      const result = parseExpensePrompt(prompt, customCategories);
      setParsed(result);
    } else {
      setParsed(null);
    }
  }, [prompt, customCategories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const result = parseExpensePrompt(prompt, customCategories);
    if (result.amount <= 0) {
      alert('Please include an amount in your prompt (e.g. "metro 41" or "coffee 150")');
      return;
    }

    onAddExpense(result, prompt);
    
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: [result.category.color || '#6366f1', '#10b981', '#f59e0b']
      });
    } catch (err) {}

    setPrompt('');
    setParsed(null);
  };

  const handleApplyPreset = (presetText) => {
    setPrompt(presetText);
  };

  const handleSimulateVoice = () => {
    setIsListening(true);
    const voiceExamples = [
      'coffee 150 at starbucks',
      'metro ride 41',
      'dinner 850 yesterday',
      'groceries 1400 supermarket'
    ];
    const randomChoice = voiceExamples[Math.floor(Math.random() * voiceExamples.length)];
    
    setTimeout(() => {
      setPrompt(randomChoice);
      setIsListening(false);
    }, 900);
  };

  return (
    <div className="w-full mb-6">
      <div className="glass-card rounded-3xl p-4 sm:p-5 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        
        <div className="absolute -right-16 -top-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="relative z-10 space-y-3">
          
          <div className="flex items-center justify-between">
            <label htmlFor="promptInput" className="text-xs font-semibold uppercase tracking-wider text-slate-400 light-mode:text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Quick Prompt Entry (₹ Rupee)
            </label>
            <span className="text-[11px] text-slate-400 light-mode:text-slate-500">
              Format: <span className="font-mono text-indigo-300 light-mode:text-indigo-600">"[item] [amount] [date/notes]"</span>
            </span>
          </div>

          {/* Main Input Box */}
          <div className="relative flex items-center">
            <input
              id="promptInput"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. metro 41, starbucks 150, uber 250 yesterday..."
              className="w-full pl-4 pr-28 py-3.5 text-sm sm:text-base rounded-2xl bg-slate-900/90 light-mode:bg-white text-slate-100 light-mode:text-slate-900 placeholder-slate-500 light-mode:placeholder-slate-400 border border-indigo-500/30 light-mode:border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 font-medium shadow-inner"
              autoComplete="off"
            />

            <div className="absolute right-2 flex items-center gap-1.5">
              
              <button
                type="button"
                onClick={handleSimulateVoice}
                className={`p-2 rounded-xl border transition-all ${
                  isListening 
                    ? 'bg-rose-500 text-white animate-pulse border-rose-400'
                    : 'bg-slate-800/80 light-mode:bg-slate-100 text-slate-400 hover:text-slate-200 border-slate-700/60 light-mode:border-slate-300'
                }`}
                title="Voice Input (Speech)"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!prompt.trim()}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-md ${
                  prompt.trim()
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white active:scale-95 glow-primary'
                    : 'bg-slate-800 light-mode:bg-slate-200 text-slate-500 light-mode:text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Add</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>

          {/* Real-time Parsed Live Preview Badge */}
          {parsed && (
            <div className="mt-3 p-3 rounded-2xl bg-slate-900/80 light-mode:bg-slate-50 border border-indigo-500/25 light-mode:border-indigo-200 animate-slide-up flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300 light-mode:text-slate-700">Preview:</span>
                <span className="font-bold text-slate-100 light-mode:text-slate-900">
                  {parsed.description}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                
                <div 
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-white text-[11px] font-medium shadow-sm"
                  style={{ backgroundColor: parsed.category.color }}
                >
                  <CategoryIcon name={parsed.category.icon} className="w-3.5 h-3.5 text-white" />
                  <span>{parsed.category.name}</span>
                </div>

                <div className={`flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  parsed.type === 'income' 
                    ? 'bg-emerald-500/20 text-emerald-400 light-mode:bg-emerald-100 light-mode:text-emerald-700 border border-emerald-500/30' 
                    : 'bg-indigo-500/20 text-indigo-300 light-mode:bg-indigo-100 light-mode:text-indigo-700 border border-indigo-500/30'
                }`}>
                  <span>{parsed.type === 'income' ? '+' : ''}₹{parsed.amount.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 light-mode:bg-slate-200 text-slate-300 light-mode:text-slate-700 text-[11px]">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{parsed.date}</span>
                </div>

              </div>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-medium text-slate-500 light-mode:text-slate-400 shrink-0 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Presets:
            </span>
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/60 light-mode:bg-slate-200/60 hover:bg-indigo-600/20 hover:border-indigo-500/40 text-slate-300 light-mode:text-slate-700 text-[11px] border border-slate-800/80 light-mode:border-slate-300 shrink-0 transition-all font-mono"
              >
                {preset}
              </button>
            ))}
          </div>

        </form>

      </div>
    </div>
  );
}
