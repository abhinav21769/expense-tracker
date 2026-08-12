// Real-time Cloud Sync Engine (Silent Error Guarded)

const SYNC_CODE_KEY = 'smart_expense_tracker_sync_code_v1';
const CLOUD_ENDPOINT = 'https://crudcrud.com/api/9a6d54bf50854b869d7b5709fcf39269/data/6a7cdcae88d77103e82653fc';

export function getSyncCode() {
  return localStorage.getItem(SYNC_CODE_KEY) || 'ABHINAV-EXPENSES';
}

export function setSyncCode(code) {
  if (code && code.trim()) {
    localStorage.setItem(SYNC_CODE_KEY, code.trim());
  }
}

/**
 * Push local expenses array to Cloud Database (silent failover guarded)
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
    }).catch(() => null);

    return !!(res && res.ok);
  } catch (err) {
    return false;
  }
}

/**
 * Pull expenses array from Cloud Database (silent failover guarded)
 */
export async function pullExpensesFromCloud() {
  try {
    const res = await fetch(CLOUD_ENDPOINT).catch(() => null);
    if (!res || !res.ok) return null;
    const json = await res.json().catch(() => null);
    return json?.items || null;
  } catch (err) {
    return null;
  }
}

/**
 * Merge local and cloud expenses intelligently (deduplicating by item ID)
 */
export async function syncDevices(localExpenses = []) {
  try {
    const cloudExpenses = await pullExpensesFromCloud();
    if (!cloudExpenses || !Array.isArray(cloudExpenses) || cloudExpenses.length === 0) {
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
    return localExpenses;
  }
}
