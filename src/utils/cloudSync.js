// Real-time Cloud Sync Engine (Cross-device Mobile <-> Laptop Sync)

const SYNC_CODE_KEY = 'smart_expense_tracker_sync_code_v1';
const DEFAULT_OBJECT_ID = 'ff8081819ff5b110019ff7b0692d056b';
const BASE_URL = 'https://api.restful-api.dev/objects';

/**
 * Get current device Sync Code or return default
 */
export function getSyncCode() {
  return localStorage.getItem(SYNC_CODE_KEY) || 'ABHINAV-EXPENSES';
}

/**
 * Set custom device Sync Code
 */
export function setSyncCode(code) {
  if (code && code.trim()) {
    localStorage.setItem(SYNC_CODE_KEY, code.trim());
  }
}

/**
 * Push local expenses array to Cloud Database
 */
export async function pushExpensesToCloud(expenses) {
  try {
    const res = await fetch(`${BASE_URL}/${DEFAULT_OBJECT_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `Expenses Sync (${getSyncCode()})`,
        data: {
          items: expenses,
          lastUpdated: new Date().toISOString()
        }
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Cloud Push Error:', err);
    return false;
  }
}

/**
 * Pull expenses array from Cloud Database
 */
export async function pullExpensesFromCloud() {
  try {
    const res = await fetch(`${BASE_URL}/${DEFAULT_OBJECT_ID}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.items || null;
  } catch (err) {
    console.error('Cloud Pull Error:', err);
    return null;
  }
}

/**
 * Merge local and cloud expenses intelligently (deduplicating by item ID)
 */
export async function syncDevices(localExpenses = []) {
  try {
    const cloudExpenses = await pullExpensesFromCloud();
    if (!cloudExpenses || !Array.isArray(cloudExpenses)) {
      // Push local expenses to initialize cloud
      await pushExpensesToCloud(localExpenses);
      return localExpenses;
    }

    // Map existing IDs
    const itemMap = new Map();
    
    // Add cloud items first
    for (const item of cloudExpenses) {
      if (item && item.id) itemMap.set(item.id, item);
    }

    // Add/Overwrite with local items
    for (const item of localExpenses) {
      if (item && item.id) itemMap.set(item.id, item);
    }

    const merged = Array.from(itemMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));

    // Push merged dataset back to cloud so both devices have identical records
    await pushExpensesToCloud(merged);
    return merged;
  } catch (err) {
    console.error('Sync Devices Error:', err);
    return localExpenses;
  }
}
