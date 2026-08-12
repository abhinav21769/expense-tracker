import React, { useState } from 'react';
import { Download, Upload, FileSpreadsheet, FileJson, X, Check, Trash2 } from 'lucide-react';

export default function ExportImportModal({
  isOpen,
  onClose,
  expenses,
  categories,
  onImportData,
  onClearAllData
}) {
  const [importStatus, setImportStatus] = useState('');

  if (!isOpen) return null;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Description', 'Amount', 'Category', 'Type', 'PromptUsed'];
    const rows = expenses.map(item => {
      const cat = categories.find(c => c.id === item.categoryId);
      return [
        item.id,
        item.date,
        `"${(item.description || '').replace(/"/g, '""')}"`,
        item.amount,
        `"${(cat?.name || 'Misc').replace(/"/g, '""')}"`,
        item.type,
        `"${(item.promptUsed || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(expenses, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `expenses_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import JSON file
  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          onImportData(parsed);
          setImportStatus(`Successfully imported ${parsed.length} transactions!`);
          setTimeout(() => setImportStatus(''), 3000);
        } else {
          alert('Invalid format. Expecting an array of expenses.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all stored expense records?')) {
      onClearAllData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-slide-up">
      <div className="glass-card max-w-md w-full rounded-3xl p-6 border border-indigo-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-xl bg-slate-900 light-mode:bg-slate-100 text-slate-400 hover:text-slate-100"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-indigo-400" />
          <h3 className="font-heading font-bold text-lg text-slate-100 light-mode:text-slate-900">
            Data Settings & Export
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Export CSV Section */}
          <div className="p-4 rounded-2xl bg-slate-900/90 light-mode:bg-slate-100 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 light-mode:text-slate-800 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export to CSV (Excel / Sheets)
            </h4>
            <p className="text-slate-400">Download formatted spreadsheet file compatible with Excel, Apple Numbers, or Google Sheets.</p>
            <button
              onClick={handleExportCSV}
              disabled={expenses.length === 0}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" /> Download CSV ({expenses.length} items)
            </button>
          </div>

          {/* Export JSON Section */}
          <div className="p-4 rounded-2xl bg-slate-900/90 light-mode:bg-slate-100 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 light-mode:text-slate-800 flex items-center gap-1.5">
              <FileJson className="w-4 h-4 text-indigo-400" /> Backup Data (JSON)
            </h4>
            <p className="text-slate-400">Download full JSON backup of all expenses and parameters.</p>
            <button
              onClick={handleExportJSON}
              disabled={expenses.length === 0}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" /> Download Backup JSON
            </button>
          </div>

          {/* Import JSON Section */}
          <div className="p-4 rounded-2xl bg-slate-900/90 light-mode:bg-slate-100 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 light-mode:text-slate-800 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-purple-400" /> Restore / Import Backup
            </h4>
            <p className="text-slate-400">Upload a JSON backup file to restore your expense records.</p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
            />
            {importStatus && (
              <p className="text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                <Check className="w-3.5 h-3.5" /> {importStatus}
              </p>
            )}
          </div>

          {/* Clear All Data Section */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
            <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-rose-400" /> Reset & Clear All Data
            </h4>
            <p className="text-slate-400">Permanently delete all stored expense records from this browser.</p>
            <button
              onClick={handleClearAll}
              className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All Data
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
