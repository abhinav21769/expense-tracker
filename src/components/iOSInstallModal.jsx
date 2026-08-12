import React from 'react';
import { Smartphone, Share, PlusSquare, CheckCircle2, X } from 'lucide-react';

export default function iOSInstallModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-100 light-mode:text-slate-900">
              Install App on iPhone / iPad
            </h3>
            <p className="text-xs text-slate-400">Run full screen as a native iOS PWA app</p>
          </div>
        </div>

        {/* Step-by-step Guide */}
        <div className="space-y-3 py-2 text-xs">
          
          <div className="p-3 rounded-2xl bg-slate-900/80 light-mode:bg-slate-100 border border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div>
              <p className="font-semibold text-slate-200 light-mode:text-slate-800">Open in Safari</p>
              <p className="text-slate-400 mt-0.5">Ensure you are opening this link inside Safari browser on your iOS device.</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 light-mode:bg-slate-100 border border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div>
              <p className="font-semibold text-slate-200 light-mode:text-slate-800 flex items-center gap-1">
                Tap the <Share className="w-3.5 h-3.5 text-indigo-400" /> Share Button
              </p>
              <p className="text-slate-400 mt-0.5">At the bottom navigation toolbar of Safari, tap the Share icon.</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 light-mode:bg-slate-100 border border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div>
              <p className="font-semibold text-slate-200 light-mode:text-slate-800 flex items-center gap-1">
                Select <PlusSquare className="w-3.5 h-3.5 text-indigo-400" /> "Add to Home Screen"
              </p>
              <p className="text-slate-400 mt-0.5">Scroll down the action sheet and select "Add to Home Screen".</p>
            </div>
          </div>

        </div>

        {/* Footer Action */}
        <div className="mt-5 pt-3 border-t border-slate-800 light-mode:border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs active:scale-95 shadow-md"
          >
            Got it, thanks!
          </button>
        </div>

      </div>
    </div>
  );
}
