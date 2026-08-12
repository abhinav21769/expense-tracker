// Real-time Cloud Sync Engine (Cross-device Mobile <-> Laptop Sync)

const SYNC_CODE_KEY = 'smart_expense_tracker_sync_code_v1';
const CLOUD_ENDPOINT = 'https://crudcrud.com/api/8c642e80b2bb4d5d81d9422d87c86686/expenses/6a7cda0e88d77103e82653fb';

export function getSyncCode() {
  return localStorage.getItem(SYNC_CODE_KEY) || 'ABHINAV-EXPENSES';
}

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
    const res = await fetch(CLOUD_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: expenses,
        lastUpdated: new Date().toISOString()
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
    const res = await fetch(CLOUD_ENDPOINT);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.items || null;
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
      await pushExpensesToCloud(localExpenses);
      return localExpenses;
    }

    const itemMap = new Map();
    
    for (const item of cloudExpenses) {
      if (item && item.id) itemMap.set(item.id, item);
    }

    for (const item of localExpenses) {
      if (item && item.id) itemMap.set(item.id, item);
    }

    const merged = Array.from(itemMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));

    await pushExpensesToCloud(merged);
    return merged;
  } catch (err) {
    console.error('Sync Devices Error:', err);
    return localExpenses;
  }
}
