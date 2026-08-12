import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import PromptBar from './components/PromptBar';
import ExpenseFeed from './components/ExpenseFeed';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import iOSInstallModal from './components/iOSInstallModal';
import CategoryManagerModal from './components/CategoryManagerModal';
import ExportImportModal from './components/ExportImportModal';
import CloudSyncModal from './components/CloudSyncModal';
import BottomNav from './components/BottomNav';
import PullToRefresh from './components/PullToRefresh';

import { DEFAULT_CATEGORIES } from './utils/categories';
import { 
  loadExpenses, 
  saveExpenses, 
  loadCustomCategories, 
  saveCustomCategories, 
  loadTheme, 
  saveTheme 
} from './utils/storage';
import { syncDevices, pushExpensesToCloud } from './utils/cloudSync';

export default function App() {
  const [expenses, setExpenses] = useState(() => loadExpenses());
  const [customCategories, setCustomCategories] = useState(() => loadCustomCategories());
  const [theme, setTheme] = useState(() => loadTheme());
  
  // UI Filters & Tabs
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all'); // 'all' | '2026-07' | '2026-08'
  const [activeTab, setActiveTab] = useState('feed');

  // Modals
  const [isiOSModalOpen, setIsiOSModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCloudSyncModalOpen, setIsCloudSyncModalOpen] = useState(false);

  // Cloud Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState('');

  const categories = [...DEFAULT_CATEGORIES, ...customCategories];

  // Dynamically calculate available months from expense dataset
  const availableMonths = useMemo(() => {
    const monthMap = new Map();
    for (const item of expenses) {
      if (item.date && item.date.length >= 7) {
        const yearMonth = item.date.substring(0, 7);
        if (!monthMap.has(yearMonth)) {
          const [yr, mo] = yearMonth.split('-');
          const dateObj = new Date(parseInt(yr, 10), parseInt(mo, 10) - 1, 1);
          const label = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          monthMap.set(yearMonth, { value: yearMonth, label });
        }
      }
    }
    return Array.from(monthMap.values()).sort((a, b) => b.value.localeCompare(a.value));
  }, [expenses]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    saveTheme(theme);
  }, [theme]);

  // Initial Cloud Sync on App Mount & Periodic 10s Background Auto-Sync
  useEffect(() => {
    handleCloudSync();

    const interval = setInterval(() => {
      handleCloudSync(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveCustomCategories(customCategories);
  }, [customCategories]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleCloudSync = async (silent = false) => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const currentLocal = loadExpenses();
      const synced = await syncDevices(currentLocal);
      if (synced && Array.isArray(synced)) {
        setExpenses(synced);
        saveExpenses(synced);
        setLastSyncedAt(new Date());
        if (!silent) showToast('Cloud database synchronized');
      }
    } catch (err) {
      console.error('Cloud Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddExpense = async (parsedResult, originalPrompt) => {
    const newExpense = {
      id: `exp-${Date.now()}`,
      description: parsedResult.description,
      amount: parsedResult.amount,
      categoryId: parsedResult.category.id,
      date: parsedResult.date,
      type: parsedResult.type,
      promptUsed: originalPrompt,
      createdAt: new Date().toISOString()
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
    showToast(`Added: ${parsedResult.description} (₹${parsedResult.amount.toFixed(2)})`);
    await pushExpensesToCloud(updated);
  };

  const handleDeleteExpense = async (id) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    saveExpenses(updated);
    showToast('Transaction deleted');
    await pushExpensesToCloud(updated);
  };

  const handleUpdateExpense = async (id, updatedFields) => {
    const updated = expenses.map(e => (e.id === id ? { ...e, ...updatedFields } : e));
    setExpenses(updated);
    saveExpenses(updated);
    showToast('Transaction updated');
    await pushExpensesToCloud(updated);
  };

  const handleAddCategory = (newCat) => {
    setCustomCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created`);
  };

  const handleDeleteCategory = (id) => {
    setCustomCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category deleted');
  };

  const handleImportData = async (importedItems) => {
    setExpenses(importedItems);
    saveExpenses(importedItems);
    showToast(`Restored ${importedItems.length} transactions`);
    await pushExpensesToCloud(importedItems);
  };

  const handleClearAllData = async () => {
    setExpenses([]);
    saveExpenses([]);
    showToast('All expense records cleared');
    await pushExpensesToCloud([]);
  };

  const handleRefresh = async () => {
    await handleCloudSync();
  };

  // Filter Expenses by Search Query & Selected Month
  const filteredExpenses = expenses.filter(item => {
    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchPrompt = (item.promptUsed || '').toLowerCase().includes(q);
      const cat = categories.find(c => c.id === item.categoryId);
      const matchCat = cat?.name.toLowerCase().includes(q);

      if (!matchDesc && !matchPrompt && !matchCat) return false;
    }

    // 2. Month Selector Filter
    if (selectedMonth !== 'all') {
      const itemMonth = item.date ? item.date.substring(0, 7) : '';
      if (itemMonth !== selectedMonth) return false;
    }

    return true;
  });

  const handleFocusPrompt = () => {
    setActiveTab('feed');
    const inputEl = document.getElementById('promptInput');
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputEl.focus();
    }
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-slate-950 light-mode:bg-slate-100 text-slate-100 light-mode:text-slate-900 pb-20 sm:pb-12 transition-colors">
        
        {/* Toast Notification Popup */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-indigo-600 text-white font-semibold text-xs shadow-2xl animate-slide-up flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Navigation Header */}
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          availableMonths={availableMonths}
          onOpeniOSModal={() => setIsiOSModalOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
          onOpenCloudSyncModal={() => setIsCloudSyncModalOpen(true)}
          isSyncing={isSyncing}
        />

        {/* Main Container */}
        <main className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
          
          {/* Natural Language Prompt Input Bar */}
          <PromptBar
            onAddExpense={handleAddExpense}
            customCategories={customCategories}
          />

          {/* Tab Selector (Feed vs Analytics) for Desktop */}
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800 light-mode:border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'feed'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 light-mode:bg-white text-slate-400 light-mode:text-slate-600 border border-slate-800 light-mode:border-slate-300'
              }`}
            >
              Expenses Feed ({filteredExpenses.length})
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 light-mode:bg-white text-slate-400 light-mode:text-slate-600 border border-slate-800 light-mode:border-slate-300'
              }`}
            >
              Analytics & Charts
            </button>
          </div>

          {/* Active Tab View */}
          {activeTab === 'feed' ? (
            <ExpenseFeed
              expenses={filteredExpenses}
              categories={categories}
              onDeleteExpense={handleDeleteExpense}
              onUpdateExpense={handleUpdateExpense}
            />
          ) : (
            <AnalyticsDashboard
              expenses={expenses}
              categories={categories}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              availableMonths={availableMonths}
            />
          )}

        </main>

        {/* Cloud Sync Modal */}
        <CloudSyncModal
          isOpen={isCloudSyncModalOpen}
          onClose={() => setIsCloudSyncModalOpen(false)}
          onManualSync={handleCloudSync}
          isSyncing={isSyncing}
          lastSyncedAt={lastSyncedAt}
        />

        {/* iOS App Add to Home Screen Modal */}
        <iOSInstallModal
          isOpen={isiOSModalOpen}
          onClose={() => setIsiOSModalOpen(false)}
        />

        {/* Custom Category Manager Modal */}
        <CategoryManagerModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />

        {/* Export / Import Data Modal */}
        <ExportImportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          expenses={expenses}
          categories={categories}
          onImportData={handleImportData}
          onClearAllData={handleClearAllData}
        />

        {/* Mobile iOS Bottom Navigation Toolbar */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onFocusPrompt={handleFocusPrompt}
        />

      </div>
    </PullToRefresh>
  );
}
