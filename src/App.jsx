import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PromptBar from './components/PromptBar';
import ExpenseFeed from './components/ExpenseFeed';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import iOSInstallModal from './components/iOSInstallModal';
import CategoryManagerModal from './components/CategoryManagerModal';
import ExportImportModal from './components/ExportImportModal';
import BottomNav from './components/BottomNav';

import { DEFAULT_CATEGORIES } from './utils/categories';
import { 
  loadExpenses, 
  saveExpenses, 
  loadCustomCategories, 
  saveCustomCategories, 
  loadTheme, 
  saveTheme 
} from './utils/storage';

export default function App() {
  const [expenses, setExpenses] = useState(() => loadExpenses());
  const [customCategories, setCustomCategories] = useState(() => loadCustomCategories());
  const [theme, setTheme] = useState(() => loadTheme());
  
  // UI Filters & Tabs
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'analytics'

  // Modals
  const [isiOSModalOpen, setIsiOSModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState('');

  // Combined categories list (Default + Custom)
  const categories = [...DEFAULT_CATEGORIES, ...customCategories];

  // Apply Theme class to document root
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    saveTheme(theme);
  }, [theme]);

  // Persist expenses on change
  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  // Persist custom categories on change
  useEffect(() => {
    saveCustomCategories(customCategories);
  }, [customCategories]);

  // Show temporary toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Add Expense handler
  const handleAddExpense = (parsedResult, originalPrompt) => {
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

    setExpenses(prev => [newExpense, ...prev]);
    showToast(`Added: ${parsedResult.description} ($${parsedResult.amount.toFixed(2)})`);
  };

  // Delete Expense handler
  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Transaction deleted');
  };

  // Update Expense handler
  const handleUpdateExpense = (id, updatedFields) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...e, ...updatedFields } : e)));
    showToast('Transaction updated');
  };

  // Custom Category Add
  const handleAddCategory = (newCat) => {
    setCustomCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created`);
  };

  // Custom Category Delete
  const handleDeleteCategory = (id) => {
    setCustomCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category deleted');
  };

  // Import Data
  const handleImportData = (importedItems) => {
    setExpenses(importedItems);
    showToast(`Restored ${importedItems.length} transactions`);
  };

  // Clear All Data
  const handleClearAllData = () => {
    setExpenses([]);
    showToast('All expense records cleared');
  };

  // Filter Expenses by Search Query & Date Filter
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

    // 2. Date Filter
    if (dateFilter !== 'all') {
      const todayStr = new Date().toISOString().split('T')[0];
      const itemDateStr = item.date;

      if (dateFilter === 'today') {
        return itemDateStr === todayStr;
      }

      if (dateFilter === 'week') {
        const itemDate = new Date(itemDateStr);
        const now = new Date();
        const diffTime = Math.abs(now - itemDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }

      if (dateFilter === 'month') {
        const itemDate = new Date(itemDateStr);
        const now = new Date();
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }
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
        onOpeniOSModal={() => setIsiOSModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
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
            expenses={filteredExpenses}
            categories={categories}
          />
        )}

      </main>

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
  );
}
