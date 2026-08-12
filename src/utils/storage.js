// LocalStorage persistence manager (100% Dynamic - Zero Hardcoded Data)

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
 * Load expenses from LocalStorage (100% dynamic, no hardcoded seed arrays)
 */
export function loadExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to load expenses from LocalStorage:', err);
    return [];
  }
}

/**
 * Save expenses array to LocalStorage
 */
export function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (err) {
    console.error('Failed to save expenses to LocalStorage:', err);
  }
}

/**
 * Load custom categories
 */
export function loadCustomCategories() {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

/**
 * Save custom categories
 */
export function saveCustomCategories(categories) {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save custom categories:', err);
  }
}

/**
 * Load Theme preference ('dark' | 'light')
 */
export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

/**
 * Save Theme preference
 */
export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
