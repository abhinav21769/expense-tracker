// Node script to clear July expenses from Cloud Database & Local Storage

const OBJECT_ID = 'ff8081819ff5b110019ff7b0692d056b';
const API_URL = `https://api.restful-api.dev/objects/${OBJECT_ID}`;

async function clearJulyExpenses() {
  console.log('Fetching current Cloud Database expenses...');
  
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      console.error('Failed to fetch cloud expenses:', res.statusText);
      return;
    }

    const json = await res.json();
    const currentItems = json?.data?.items || [];
    console.log(`Current total items in cloud: ${currentItems.length}`);

    // Filter out July expenses (items starting with july- or date in July)
    const filtered = currentItems.filter(item => {
      const isJulyId = item.id && item.id.startsWith('july-');
      const isJulyDate = item.date && item.date.startsWith('2026-07');
      return !isJulyId && !isJulyDate;
    });

    console.log(`Remaining non-July items: ${filtered.length}`);

    // Update Cloud Database
    const updateRes = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Expenses Sync (ABHINAV-EXPENSES)',
        data: {
          items: filtered,
          lastUpdated: new Date().toISOString()
        }
      })
    });

    if (updateRes.ok) {
      console.log('✅ Successfully cleared July expenses from Cloud Database!');
    } else {
      console.error('❌ Failed to update Cloud Database:', updateRes.statusText);
    }

  } catch (err) {
    console.error('Error executing script:', err);
  }
}

clearJulyExpenses();
