import React, { useState } from 'react';
import CategoryIcon from './CategoryIcon';
import { PlusCircle, X, Check, Trash2 } from 'lucide-react';

const AVAILABLE_ICONS = ['Car', 'Utensils', 'ShoppingBag', 'Zap', 'Tag', 'Film', 'HeartPulse', 'TrendingUp', 'Plane', 'Home', 'Coffee', 'Gift', 'Bookmark', 'Briefcase', 'GraduationCap'];
const COLOR_SWATCHES = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#ef4444', '#22c55e', '#eab308', '#6366f1'];

export default function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onDeleteCategory
}) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Bookmark');
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [keywordsText, setKeywordsText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const keywords = keywordsText
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(Boolean);

    onAddCategory({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor,
      keywords,
      isCustom: true
    });

    setName('');
    setKeywordsText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-slide-up">
      <div className="glass-card max-w-lg w-full rounded-3xl p-6 border border-indigo-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-xl bg-slate-900 light-mode:bg-slate-100 text-slate-400 hover:text-slate-100"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <PlusCircle className="w-5 h-5 text-indigo-400" />
          <h3 className="font-heading font-bold text-lg text-slate-100 light-mode:text-slate-900">
            Category Manager
          </h3>
        </div>

        {/* Create Custom Category Form */}
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-slate-900/90 light-mode:bg-slate-100 border border-slate-800 space-y-3 mb-6">
          <h4 className="text-xs font-bold text-slate-300 light-mode:text-slate-700 uppercase tracking-wider">
            Create Custom Category
          </h4>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Subscriptions, Gaming, Pets"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 light-mode:bg-white text-slate-100 light-mode:text-slate-900 border border-slate-700"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Auto-Categorize Keywords (comma separated)</label>
            <input
              type="text"
              value={keywordsText}
              onChange={e => setKeywordsText(e.target.value)}
              placeholder="e.g. pet, dog, cat, vet"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 light-mode:bg-white text-slate-100 light-mode:text-slate-900 border border-slate-700 font-mono"
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Color Theme</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_SWATCHES.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    selectedColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-80'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Icon</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ICONS.map(iconName => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setSelectedIcon(iconName)}
                  className={`p-2 rounded-xl border transition-all ${
                    selectedIcon === iconName 
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-slate-950 light-mode:bg-white text-slate-400 border-slate-800'
                  }`}
                >
                  <CategoryIcon name={iconName} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all disabled:opacity-50"
          >
            Add Category
          </button>
        </form>

        {/* Existing Categories List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Existing Categories</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 light-mode:bg-slate-100 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <CategoryIcon name={cat.icon} className="w-4 h-4 text-slate-300" />
                  <span className="font-medium text-slate-200 light-mode:text-slate-800">{cat.name}</span>
                  {cat.isCustom && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Custom</span>
                  )}
                </div>
                {cat.isCustom && (
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
