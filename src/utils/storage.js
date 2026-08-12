// LocalStorage persistence manager

const STORAGE_KEY = 'smart_expense_tracker_data_v1';
const CATEGORIES_KEY = 'smart_expense_tracker_custom_categories_v1';
const THEME_KEY = 'smart_expense_tracker_theme_v1';

export function getTodayDateString(offsetDays = 0) {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  return d.toISOString().split('T')[0];
}

/**
 * Load expenses from LocalStorage
 */
export function loadExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

/**
 * Save expenses array to LocalStorage
 */
export function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (err) {}
}

export function loadCustomCategories() {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

export function saveCustomCategories(categories) {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (err) {}
}

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
