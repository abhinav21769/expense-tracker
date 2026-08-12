// Node script to remove mock starter items (exp-1 to exp-7) and format 94 July items compactly

const CLOUD_ENDPOINT = 'https://crudcrud.com/api/8c642e80b2bb4d5d81d9422d87c86686/expenses/6a7cda0e88d77103e82653fb';

async function removeMockItems() {
  console.log('Fetching Cloud Database expenses...');
  try {
    const res = await fetch(CLOUD_ENDPOINT);
    if (!res.ok) {
      console.error('Failed to fetch from Cloud Database');
      return;
    }

    const json = await res.json();
    const currentItems = json?.items || [];
    console.log(`Total items currently in cloud: ${currentItems.length}`);

    // Filter out initial mock items (exp-1 to exp-7) and format compactly
    const cleaned = currentItems
      .filter(item => item.id && !item.id.startsWith('exp-'))
      .map(item => ({
        id: item.id,
        description: item.description,
        amount: item.amount,
        categoryId: item.categoryId,
        date: item.date,
        type: item.type,
        promptUsed: item.promptUsed
      }));

    console.log(`Cleaned total items: ${cleaned.length}`);

    // Update Cloud Database
    const updateRes = await fetch(CLOUD_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cleaned,
        lastUpdated: new Date().toISOString()
      })
    });

    if (updateRes.ok) {
      console.log('✅ Successfully removed mock starter items from Cloud Database!');
    } else {
      console.error('❌ Update status:', updateRes.status, updateRes.statusText);
    }
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
}

removeMockItems();
