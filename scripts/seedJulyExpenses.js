// Node script to parse July expense prompt list and generate JSON seed data

const rawInput = `
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

// Helper matching categories
const CATEGORIES = [
  { id: 'transport', keywords: ['metro', 'rapido', 'train', 'bus', 'bike', 'auto', 'cab', 'uber', 'petrol', 'parking'] },
  { id: 'food', keywords: ['poha', 'burg', 'fruits', 'snacks', 'lassi', 'wrap', 'food', 'namkeen', 'rajma', 'mcd', 'dinner', 'sandwich', 'coffee', 'ice cream', 'pizza', 'patties', 'kulfa', 'bakery', 'subway', 'waffles', 'coke', 'pancake', 'lunch', 'chai', 'maggi', 'burger', 'ghewar', 'momos', 'breakfast', 'chips'] },
  { id: 'groceries', keywords: ['water', 'groceries', 'zepto', 'veges', 'milk', 'yogurt'] },
  { id: 'bills', keywords: ['yt gpay', 'apple music', 'brokerage', 'donation', 'ticket'] },
  { id: 'shopping', keywords: ['perfume', 'face wash', 'toothpaste', 'soap', 'jeans', 'sleepers', 'salon', 'gadgets', 'shoes', 'gf'] },
  { id: 'misc', keywords: ['pocket money', 'bribe', 'prasad'] }
];

function detectCat(text) {
  const lower = text.toLowerCase();
  for (const c of CATEGORIES) {
    if (c.keywords.some(k => lower.includes(k))) return c.id;
  }
  return 'misc';
}

function parseJulyData(text) {
  const lines = text.split('\n');
  const items = [];
  let currentDate = '2026-07-01';
  let counter = 1;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Check for date header like "1 july", "15july", "30 july"
    const dateMatch = line.match(/^(\d{1,2})\s*july/i);
    if (dateMatch) {
      const day = dateMatch[1].padStart(2, '0');
      currentDate = `2026-07-${day}`;
      continue;
    }

    // Extract amount from line
    // e.g. "Poha 75", "495 pizza", "zepto 152(towel milk yogurt)", "Jeans 1199 - payment done"
    let amount = 0;
    let desc = line;

    // Pattern 1: Starts with number e.g. "495 pizza"
    const startNum = line.match(/^(\d+(?:\.\d+)?)\s+(.*)/);
    if (startNum) {
      amount = parseFloat(startNum[1]);
      desc = startNum[2];
    } else {
      // Pattern 2: Contains number inside or at end e.g. "Poha 75", "zepto 152(...)"
      const numMatch = line.match(/(\d+(?:\.\d+)?)/);
      if (numMatch) {
        amount = parseFloat(numMatch[1]);
        desc = line.replace(numMatch[0], '').trim();
        // Clean up remaining brackets or notes if needed
        desc = desc.replace(/^[\s\-\:]+/, '').replace(/[\s\-\:]+$/, '').trim();
        if (!desc) desc = line;
      }
    }

    if (amount > 0) {
      const catId = detectCat(line);
      items.push({
        id: `july-${counter++}`,
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

const parsedItems = parseJulyData(rawInput);
console.log(JSON.stringify(parsedItems, null, 2));
