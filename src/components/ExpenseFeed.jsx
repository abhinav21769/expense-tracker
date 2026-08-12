import React, { useState } from 'react';
import CategoryIcon from './CategoryIcon';
import { 
  Calendar, 
  Trash2, 
  Edit2, 
  Check, 
  Sparkles
} from 'lucide-react';

export default function ExpenseFeed({
  expenses,
  categories,
  onDeleteExpense,
  onUpdateExpense
}) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', amount: '', categoryId: '', date: '' });

  const getCategory = (catId) => {
    return categories.find(c => c.id === catId) || categories.find(c => c.id === 'misc');
  };

  const formatDateHeader = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';

    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const groupedExpenses = expenses.reduce((groups, item) => {
    const dateKey = item.date || new Date().toISOString().split('T')[0];
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(item);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a));

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      description: item.description,
      amount: item.amount,
      categoryId: item.categoryId,
      date: item.date
    });
  };

  const handleSaveEdit = (id) => {
    if (!editForm.description || !editForm.amount) return;
    onUpdateExpense(id, {
      description: editForm.description,
      amount: parseFloat(editForm.amount),
      categoryId: editForm.categoryId,
      date: editForm.date
    });
    setEditingId(null);
  };

  if (sortedDates.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center border border-slate-800 light-mode:border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-bold text-lg text-slate-200 light-mode:text-slate-800">No Expenses Found</h3>
        <p className="text-xs text-slate-400 light-mode:text-slate-500 mt-1 max-w-sm mx-auto">
          Start by typing a prompt above like <span className="text-indigo-400 font-mono">"metro 41"</span> or <span className="text-indigo-400 font-mono">"coffee 150"</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map(dateKey => {
        const dayItems = groupedExpenses[dateKey];
        
        const dayExpenseTotal = dayItems
          .filter(i => i.type !== 'income')
          .reduce((sum, i) => sum + i.amount, 0);

        const dayIncomeTotal = dayItems
          .filter(i => i.type === 'income')
          .reduce((sum, i) => sum + i.amount, 0);

        return (
          <div key={dateKey} className="space-y-3">
            
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <h2 className="font-heading font-bold text-sm text-slate-200 light-mode:text-slate-800">
                  {formatDateHeader(dateKey)}
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 light-mode:bg-slate-200 text-slate-400 light-mode:text-slate-600 font-mono">
                  {dayItems.length} {dayItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="text-xs font-semibold flex items-center gap-2">
                {dayExpenseTotal > 0 && (
                  <span className="text-slate-400 light-mode:text-slate-600">
                    Spent: <span className="text-slate-100 light-mode:text-slate-900 font-bold">₹{dayExpenseTotal.toFixed(2)}</span>
                  </span>
                )}
                {dayIncomeTotal > 0 && (
                  <span className="text-emerald-400 font-bold">
                    +₹{dayIncomeTotal.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              {dayItems.map(item => {
                const cat = getCategory(item.categoryId);
                const isEditing = editingId === item.id;
                const isIncome = item.type === 'income';

                if (isEditing) {
                  return (
                    <div key={item.id} className="glass-card p-4 rounded-2xl border border-indigo-500/40 space-y-3 animate-slide-up">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Title</label>
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 light-mode:bg-slate-100 border border-slate-700 text-slate-100 light-mode:text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Amount (₹)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.amount}
                            onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 light-mode:bg-slate-100 border border-slate-700 text-slate-100 light-mode:text-slate-900 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Category</label>
                          <select
                            value={editForm.categoryId}
                            onChange={e => setEditForm({ ...editForm, categoryId: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 light-mode:bg-slate-100 border border-slate-700 text-slate-100 light-mode:text-slate-900"
                          >
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Date</label>
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 light-mode:bg-slate-100 border border-slate-700 text-slate-100 light-mode:text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 rounded-xl text-xs bg-slate-800 text-slate-300 hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="px-3 py-1 rounded-xl text-xs bg-indigo-600 text-white hover:bg-indigo-500 font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="glass-card p-3.5 rounded-2xl border border-slate-800/80 light-mode:border-slate-200/80 hover:border-indigo-500/30 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{ backgroundColor: `${cat.color}20`, border: `1px solid ${cat.color}40` }}
                      >
                        <CategoryIcon name={cat.icon} className="w-5 h-5" color={cat.color} />
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-slate-100 light-mode:text-slate-900 truncate">
                          {item.description}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 light-mode:text-slate-500 mt-0.5">
                          <span className="font-medium" style={{ color: cat.color }}>
                            {cat.name}
                          </span>
                          {item.promptUsed && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-[10px] text-slate-500 light-mode:text-slate-400 truncate max-w-[120px]">
                                "{item.promptUsed}"
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className={`font-heading font-extrabold text-sm sm:text-base ${
                          isIncome ? 'text-emerald-400 light-mode:text-emerald-600' : 'text-slate-100 light-mode:text-slate-900'
                        }`}>
                          {isIncome ? '+' : '-'}₹{item.amount.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-slate-800 light-mode:hover:bg-slate-200 text-slate-400 hover:text-indigo-400"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(item.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-800 light-mode:hover:bg-slate-200 text-slate-400 hover:text-rose-400"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        );
      })}
    </div>
  );
}
