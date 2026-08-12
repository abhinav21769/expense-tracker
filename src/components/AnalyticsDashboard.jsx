import React, { useState } from 'react';
import CategoryIcon from './CategoryIcon';
import { 
  TrendingDown, 
  TrendingUp, 
  IndianRupee, 
  PieChart as PieIcon, 
  Activity, 
  Award,
  ChevronDown,
  ChevronUp,
  Calendar,
  Layers
} from 'lucide-react';

export default function AnalyticsDashboard({ 
  expenses, 
  categories,
  selectedMonth,
  setSelectedMonth,
  availableMonths
}) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Filter expenses by selected Month (if specified)
  const monthFilteredExpenses = selectedMonth === 'all'
    ? expenses
    : expenses.filter(item => {
        const itemMonth = item.date ? item.date.substring(0, 7) : ''; // e.g. "2026-07"
        return itemMonth === selectedMonth;
      });

  const totalExpenses = monthFilteredExpenses
    .filter(i => i.type !== 'income')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalIncome = monthFilteredExpenses
    .filter(i => i.type === 'income')
    .reduce((sum, i) => sum + i.amount, 0);

  const netSavings = totalIncome - totalExpenses;

  const uniqueDates = new Set(monthFilteredExpenses.map(i => i.date)).size || 1;
  const dailyAverage = totalExpenses / Math.max(1, uniqueDates);

  // Category Breakdown with itemized transaction list
  const categoryTotals = categories.map(cat => {
    const catExpenses = monthFilteredExpenses.filter(i => i.categoryId === cat.id && i.type !== 'income');
    const total = catExpenses.reduce((sum, i) => sum + i.amount, 0);
    const count = catExpenses.length;
    const percentage = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
    return {
      ...cat,
      total,
      count,
      percentage,
      items: catExpenses.sort((a, b) => new Date(b.date) - new Date(a.date))
    };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const topCategory = categoryTotals.length > 0 ? categoryTotals[0] : null;

  const toggleExpand = (catId) => {
    setExpandedCategory(prev => (prev === catId ? null : catId));
  };

  return (
    <div className="space-y-6">
      
      {/* Month Selector Bar */}
      <div className="glass-card p-4 rounded-3xl border border-slate-800 light-mode:border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-100 light-mode:text-slate-900">
              Month-wise View
            </h3>
            <p className="text-[11px] text-slate-400">Filter stats and category breakdowns by month</p>
          </div>
        </div>

        {/* Month Dropdown Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-slate-900 light-mode:bg-slate-100 text-slate-100 light-mode:text-slate-900 border border-indigo-500/40 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
          >
            <option value="all">📅 All Months Overall</option>
            {availableMonths.map(m => (
              <option key={m.value} value={m.value}>
                🗓️ {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="glass-card p-4 rounded-2xl border border-indigo-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Spent</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-lg sm:text-2xl text-slate-100 light-mode:text-slate-900">
            ₹{totalExpenses.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{monthFilteredExpenses.length} transactions</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Income</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-lg sm:text-2xl text-emerald-400 light-mode:text-emerald-600">
            ₹{totalIncome.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Earnings & salary</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-purple-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Net Balance</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className={`font-heading font-extrabold text-lg sm:text-2xl ${
            netSavings >= 0 ? 'text-indigo-300 light-mode:text-indigo-600' : 'text-rose-400'
          }`}>
            ₹{netSavings.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Income minus expenses</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-amber-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Daily Average</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-lg sm:text-2xl text-amber-400 light-mode:text-amber-600">
            ₹{dailyAverage.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Over {uniqueDates} active days</p>
        </div>

      </div>

      {/* Category Breakdown with Expandable Transaction Listing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="md:col-span-2 glass-card p-5 rounded-3xl border border-slate-800 light-mode:border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-100 light-mode:text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-400" />
              Category Breakdown (Click to View Items)
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {categoryTotals.length} active categories
            </span>
          </div>

          {categoryTotals.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No expense data available for this month.</p>
          ) : (
            <div className="space-y-3">
              {categoryTotals.map(cat => {
                const isExpanded = expandedCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="rounded-2xl border border-slate-800/80 light-mode:border-slate-200/80 overflow-hidden transition-all bg-slate-900/40 light-mode:bg-slate-50"
                  >
                    {/* Clickable Category Summary Bar */}
                    <button
                      onClick={() => toggleExpand(cat.id)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-slate-800/50 light-mode:hover:bg-slate-200/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                          style={{ backgroundColor: `${cat.color}25`, border: `1px solid ${cat.color}40` }}
                        >
                          <CategoryIcon name={cat.icon} className="w-4.5 h-4.5" color={cat.color} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-100 light-mode:text-slate-900">{cat.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 light-mode:bg-slate-200 text-slate-400 font-mono">
                              {cat.count} {cat.count === 1 ? 'item' : 'items'}
                            </span>
                          </div>

                          {/* Progress Bar inside row */}
                          <div className="w-36 sm:w-48 h-1.5 rounded-full bg-slate-800 light-mode:bg-slate-200 mt-1.5 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-heading font-extrabold text-xs sm:text-sm text-slate-100 light-mode:text-slate-900">
                            ₹{cat.total.toFixed(2)}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            {cat.percentage.toFixed(1)}% share
                          </div>
                        </div>
                        <div className="p-1 rounded-lg text-slate-400">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Detailed Transaction List for Category */}
                    {isExpanded && (
                      <div className="p-3 bg-slate-950/80 light-mode:bg-white border-t border-slate-800/60 light-mode:border-slate-200 space-y-2 animate-slide-up">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pb-1 border-b border-slate-800/40">
                          <span>Listing: {cat.name} ({cat.count})</span>
                          <span>Total: ₹{cat.total.toFixed(2)}</span>
                        </div>

                        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                          {cat.items.map(item => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 light-mode:bg-slate-50 border border-slate-800/50 light-mode:border-slate-200 text-xs"
                            >
                              <div className="min-w-0 pr-2">
                                <p className="font-semibold text-slate-200 light-mode:text-slate-800 truncate">
                                  {item.description}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono">
                                  {item.date} {item.promptUsed ? `• "${item.promptUsed}"` : ''}
                                </p>
                              </div>
                              <span className="font-bold text-slate-100 light-mode:text-slate-900 shrink-0">
                                ₹{item.amount.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Highest Spending Category Spotlight */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 light-mode:border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Highest Category Spotlight</span>
            </div>

            {topCategory ? (
              <div className="space-y-3 text-center py-4">
                <div
                  className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: `${topCategory.color}25`, border: `1px solid ${topCategory.color}50` }}
                >
                  <CategoryIcon name={topCategory.icon} className="w-7 h-7" color={topCategory.color} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg text-slate-100 light-mode:text-slate-900">
                    {topCategory.name}
                  </h4>
                  <div className="text-2xl font-extrabold text-indigo-400 light-mode:text-indigo-600 mt-1">
                    ₹{topCategory.total.toFixed(2)}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Makes up <span className="font-bold text-slate-200 light-mode:text-slate-800">{topCategory.percentage.toFixed(1)}%</span> of total spend
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No category data yet.</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 light-mode:border-slate-200 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Click any category above to reveal items!
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
