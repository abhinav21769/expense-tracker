import React, { useState } from 'react';
import { Cloud, CloudLightning, RefreshCw, Check, X, Smartphone, Laptop } from 'lucide-react';
import { getSyncCode, setSyncCode } from '../utils/cloudSync';

export default function CloudSyncModal({
  isOpen,
  onClose,
  onManualSync,
  isSyncing,
  lastSyncedAt
}) {
  const [code, setCode] = useState(() => getSyncCode());
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleSaveCode = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setSyncCode(code.trim());
    setStatusMsg('Sync Code saved!');
    setTimeout(() => setStatusMsg(''), 2500);
    onManualSync();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-slide-up">
      <div className="glass-card max-w-md w-full rounded-3xl p-6 border border-indigo-500/30 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-xl bg-slate-900 light-mode:bg-slate-100 text-slate-400 hover:text-slate-100"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center">
            <CloudLightning className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-100 light-mode:text-slate-900">
              Cross-Device Cloud Sync
            </h3>
            <p className="text-xs text-slate-400">Sync iPhone ↔ Laptop instantly</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Sync Status Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 light-mode:bg-slate-100 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
              <span className="font-semibold text-slate-200 light-mode:text-slate-800">
                {isSyncing ? 'Syncing with Cloud...' : 'Cloud Database Connected'}
              </span>
            </div>
            {lastSyncedAt && (
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          {/* Sync Code Settings */}
          <form onSubmit={handleSaveCode} className="p-4 rounded-2xl bg-slate-900/90 light-mode:bg-slate-100 border border-slate-800 space-y-2">
            <label className="font-bold text-slate-200 light-mode:text-slate-800 block">
              Device Sync Code
            </label>
            <p className="text-slate-400">Enter this same code on both your iPhone and Laptop to keep them synchronized.</p>
            
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. ABHINAV-EXPENSES"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 light-mode:bg-white text-slate-100 light-mode:text-slate-900 border border-slate-700 font-mono font-bold tracking-wider"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shrink-0"
              >
                Save
              </button>
            </div>
            {statusMsg && (
              <p className="text-emerald-400 font-semibold flex items-center gap-1 mt-1 text-[11px]">
                <Check className="w-3.5 h-3.5" /> {statusMsg}
              </p>
            )}
          </form>

          {/* Manual Sync Button */}
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now with Cloud'}</span>
          </button>

          {/* Device Icons Diagram */}
          <div className="flex items-center justify-around py-2 px-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-slate-300">
            <div className="flex items-center gap-1.5 text-[11px] font-medium">
              <Smartphone className="w-4 h-4 text-indigo-400" /> iPhone
            </div>
            <div className="text-indigo-400 font-bold">⟷</div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium">
              <Cloud className="w-4 h-4 text-purple-400" /> Cloud DB
            </div>
            <div className="text-indigo-400 font-bold">⟷</div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium">
              <Laptop className="w-4 h-4 text-indigo-400" /> Laptop
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
