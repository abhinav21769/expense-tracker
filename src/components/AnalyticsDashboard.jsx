import React from 'react';
import CategoryIcon from './CategoryIcon';
import { 
  TrendingDown, 
  TrendingUp, 
  IndianRupee, 
  PieChart as PieIcon, 
  Activity, 
  Award
} from 'lucide-react';

export default function AnalyticsDashboard({ expenses, categories }) {
  const totalExpenses = expenses
    .filter(i => i.type !== 'income')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalIncome = expenses
    .filter(i => i.type === 'income')
    .reduce((sum, i) => sum + i.amount, 0);

  const netSavings = totalIncome - totalExpenses;

  const uniqueDates = new Set(expenses.map(i => i.date)).size || 1;
  const dailyAverage = totalExpenses / Math.max(1, uniqueDates);

  const categoryTotals = categories.map(cat => {
    const catExpenses = expenses.filter(i => i.categoryId === cat.id && i.type !== 'income');
    const total = catExpenses.reduce((sum, i) => sum + i.amount, 0);
    const count = catExpenses.length;
    const percentage = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
    return {
      ...cat,
      total,
      count,
      percentage
    };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const topCategory = categoryTotals.length > 0 ? categoryTotals[0] : null;

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Total Spent Card */}
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
          <p className="text-[10px] text-slate-400 mt-1">Across all transactions</p>
        </div>

        {/* Total Income Card */}
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

        {/* Net Savings Card */}
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

        {/* Daily Average Card */}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="md:col-span-2 glass-card p-5 rounded-3xl border border-slate-800 light-mode:border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-100 light-mode:text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-400" />
              Category Breakdown
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {categoryTotals.length} active categories
            </span>
          </div>

          {categoryTotals.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No category expense data available yet.</p>
          ) : (
            <div className="space-y-3">
              {categoryTotals.map(cat => (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="font-medium text-slate-200 light-mode:text-slate-800">{cat.name}</span>
                      <span className="text-[10px] text-slate-400">({cat.count} items)</span>
                    </div>
                    <div className="font-semibold text-slate-100 light-mode:text-slate-900">
                      ₹{cat.total.toFixed(2)} <span className="text-slate-400 text-[10px]">({cat.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800 light-mode:bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-800 light-mode:border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Highest Spending Category</span>
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
                    Makes up <span className="font-bold text-slate-200 light-mode:text-slate-800">{topCategory.percentage.toFixed(1)}%</span> of your total spend
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No expense categories yet.</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 light-mode:border-slate-200 text-center">
            <span className="text-[11px] text-slate-400">Tip: Type prompts regularly to track spending velocity!</span>
          </div>
        </div>

      </div>

    </div>
  );
}
