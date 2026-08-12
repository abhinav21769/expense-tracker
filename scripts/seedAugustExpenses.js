// Node script to upload both July (94 items) & August (63 items) to Cloud Database

const CLOUD_ENDPOINT = 'https://crudcrud.com/api/9a6d54bf50854b869d7b5709fcf39269/data/6a7cdcae88d77103e82653fc';

const rawJulyInput = `
1 july
Poha 75
Metro 41
rapido 74
train 97
water 20
burg singh  100

3 july
fruits 215 
snacks 120
arnav 2000 pocket money

4 july
groceries 335 
groceries 249 

5 july 
Bus 15
Train 97
Lassi 10
Metro 30
Bike 96 
Auto 92
yt gpay 50 
water 10
groceries 149

6 july
wrap 75
food 110
namkeen 10
rajma chawal 147
mcd 146

7 july
food 131
bribe 250
dinner 350

8 july
Metro 20
train 97
cab 150
sandwich 50

10 july
coffee 140
ice cream 160

11 july
apple music 59

12 july
495 pizza

13 july
gf 1346
Patties 150
kulfa 140

14 july
prasad 10
mohan bakery 70
subway 400

15july
Zepto 105
Waffles 108
diet coke 50

16 july 
veges/fruits 310
water 20

17 july
Perfume 799
snacks 200

18 july
pancake 260

20 july
Lunch 80
Chai 20
face wash 206
Perfora toothpaste 168
Lux soap 40

21 july
zepto 152(towel milk yogurt)
Flat brokerage 12000
lunch 95
Patties 70

22 july
wrap 91
Maggi 65
uber 156
train 97
snacks 45
Jeans 1199 - payment done but no response

23 july
train ticket booking - 192 (5 aug)
burger 100

24 july
Ghewar 780
Sleepers 460
momos 80

26 july
Salon 350
fruits 500
train 97
auto 20
Lassi 20
Uber 100

27 july
Breakfast 85
lunch 222
assam donation 1000

28 july
Breakfast 85
Subway 246
Chips 250
Parking 70

29 july
chai 30
Petrol 200
Metro 41
bus 335
Chips 25

30 july
gf 976
desk gadgets 486
snacks 256

31 july
shoes 4400
snacks 376
subway 390
`;

const rawAugustInput = `
1 aug
Shirt 1499
Jeans lenght 50
Treat 945
movies 742
zepto 226
money transfer 10000

2 aug
Socks 465
Auto 20
train ticket for 9th aug 423
metro 30
uber 100
keys 200
Cold drink 40

3 aug
gifts 1115
gift bag 50
metro 51
auto 151
rikshaw 20
popcorn 585
waffle 221
haldiram 273
coke 70
Metro 51
bike 110
dinner 215
arnav’s zomato 256

4 aug 
breakfast 135
rent 8000 aug 
rent july 2667
Police verification 300
Lunch 125
dinner 166

5 aug
Metro 41
Bike 85
burger king 130

6 aug
Shampoo 341

7 aug
mcd 146

8 aug 
Coke 50
ghewar 257
yt premium 89
groceries 220

9 aug
Beard 200
Fruits 230 
auto 20
Apple Music 59
Metro 30
bike 76

10 aug
Breakfast 104
Lunch 300
zepto 167

11 aug
breakfast 105
mandir 30
wrap 115
Sandwich 20
dinner 92

12 aug
oats 104
snacks 145
lunch 129
Arnav recharge 299
Bike 80
Metro 41
train 97

13 aug 
subway 368 
`;

const CATEGORIES = [
  { id: 'transport', keywords: ['metro', 'rapido', 'train', 'bus', 'bike', 'auto', 'cab', 'uber', 'petrol', 'parking', 'rikshaw', 'ticket'] },
  { id: 'food', keywords: ['poha', 'burg', 'fruits', 'snacks', 'lassi', 'wrap', 'food', 'namkeen', 'rajma', 'mcd', 'dinner', 'sandwich', 'coffee', 'ice cream', 'pizza', 'patties', 'kulfa', 'bakery', 'subway', 'waffles', 'coke', 'pancake', 'lunch', 'chai', 'maggi', 'burger', 'ghewar', 'momos', 'breakfast', 'chips', 'treat', 'movies', 'popcorn', 'haldiram', 'cold drink', 'oats'] },
  { id: 'groceries', keywords: ['water', 'groceries', 'zepto', 'veges', 'milk', 'yogurt'] },
  { id: 'bills', keywords: ['yt gpay', 'apple music', 'brokerage', 'donation', 'money transfer', 'rent', 'verification', 'yt premium', 'recharge'] },
  { id: 'shopping', keywords: ['perfume', 'face wash', 'toothpaste', 'soap', 'jeans', 'sleepers', 'salon', 'gadgets', 'shoes', 'gf', 'shirt', 'socks', 'keys', 'gifts', 'gift bag', 'shampoo', 'beard'] },
  { id: 'misc', keywords: ['pocket money', 'bribe', 'prasad', 'mandir'] }
];

function detectCat(text) {
  const lower = text.toLowerCase();
  for (const c of CATEGORIES) {
    if (c.keywords.some(k => lower.includes(k))) return c.id;
  }
  return 'misc';
}

function parseInputData(text, monthName, monthNum) {
  const lines = text.split('\n');
  const items = [];
  let currentDate = `2026-${monthNum}-01`;
  let counter = 1;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const dateMatch = line.match(new RegExp(`^(\\d{1,2})\\s*${monthName}`, 'i'));
    if (dateMatch) {
      const day = dateMatch[1].padStart(2, '0');
      currentDate = `2026-${monthNum}-${day}`;
      continue;
    }

    let rawLine = line.replace(/(\d+)k\b/gi, (m, p1) => parseInt(p1, 10) * 1000);

    let amount = 0;
    let desc = rawLine;

    const startNum = rawLine.match(/^(\d+(?:\.\d+)?)\s+(.*)/);
    if (startNum) {
      amount = parseFloat(startNum[1]);
      desc = startNum[2];
    } else {
      const numMatch = rawLine.match(/(\d+(?:\.\d+)?)/);
      if (numMatch) {
        amount = parseFloat(numMatch[1]);
        desc = rawLine.replace(numMatch[0], '').trim();
        desc = desc.replace(/^[\s\-\:]+/, '').replace(/[\s\-\:]+$/, '').trim();
        if (!desc) desc = rawLine;
      }
    }

    if (amount > 0) {
      const catId = detectCat(rawLine);
      items.push({
        id: `${monthName.toLowerCase()}-${counter++}`,
        description: desc.charAt(0).toUpperCase() + desc.slice(1),
        amount,
        categoryId: catId,
        date: currentDate,
        type: 'expense',
        promptUsed: line,
        createdAt: new Date().toISOString()
      });
    }
  }

  return items;
}

async function uploadAllData() {
  const julyItems = parseInputData(rawJulyInput, 'july', '07');
  const augustItems = parseInputData(rawAugustInput, 'aug', '08');
  const combined = [...julyItems, ...augustItems].sort((a, b) => new Date(b.date) - new Date(a.date));

  console.log(`Parsed ${julyItems.length} July items and ${augustItems.length} August items. Total: ${combined.length} items.`);
  console.log('Uploading dataset to Cloud Database...');

  try {
    const res = await fetch(CLOUD_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: combined,
        lastUpdated: new Date().toISOString()
      })
    });

    if (res.ok) {
      console.log(`✅ Successfully uploaded all ${combined.length} July & August expenses to Cloud Database!`);
    } else {
      console.error('❌ Failed to upload to Cloud Database:', res.statusText);
    }
  } catch (err) {
    console.error('Error during upload:', err);
  }
}

uploadAllData();
