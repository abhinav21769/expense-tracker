// LocalStorage persistence manager with July Expense Seed Data

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

// Complete 94 parsed July expense records provided by user
export const JULY_SEED_DATA = [
  { id: "july-1", description: "Poha", amount: 75, categoryId: "food", date: "2026-07-01", type: "expense", promptUsed: "Poha 75" },
  { id: "july-2", description: "Metro", amount: 41, categoryId: "transport", date: "2026-07-01", type: "expense", promptUsed: "Metro 41" },
  { id: "july-3", description: "Rapido", amount: 74, categoryId: "transport", date: "2026-07-01", type: "expense", promptUsed: "rapido 74" },
  { id: "july-4", description: "Train", amount: 97, categoryId: "transport", date: "2026-07-01", type: "expense", promptUsed: "train 97" },
  { id: "july-5", description: "Water", amount: 20, categoryId: "groceries", date: "2026-07-01", type: "expense", promptUsed: "water 20" },
  { id: "july-6", description: "Burg singh", amount: 100, categoryId: "food", date: "2026-07-01", type: "expense", promptUsed: "burg singh  100" },
  { id: "july-7", description: "Fruits", amount: 215, categoryId: "food", date: "2026-07-03", type: "expense", promptUsed: "fruits 215" },
  { id: "july-8", description: "Snacks", amount: 120, categoryId: "food", date: "2026-07-03", type: "expense", promptUsed: "snacks 120" },
  { id: "july-9", description: "Arnav 2000 pocket money", amount: 2000, categoryId: "misc", date: "2026-07-03", type: "expense", promptUsed: "arnav 2000 pocket money" },
  { id: "july-10", description: "Groceries", amount: 335, categoryId: "groceries", date: "2026-07-04", type: "expense", promptUsed: "groceries 335" },
  { id: "july-11", description: "Groceries", amount: 249, categoryId: "groceries", date: "2026-07-04", type: "expense", promptUsed: "groceries 249" },
  { id: "july-12", description: "Bus", amount: 15, categoryId: "transport", date: "2026-07-05", type: "expense", promptUsed: "Bus 15" },
  { id: "july-13", description: "Train", amount: 97, categoryId: "transport", date: "2026-07-05", type: "expense", promptUsed: "Train 97" },
  { id: "july-14", description: "Lassi", amount: 10, categoryId: "food", date: "2026-07-05", type: "expense", promptUsed: "Lassi 10" },
  { id: "july-15", description: "Metro", amount: 30, categoryId: "transport", date: "2026-07-05", type: "expense", promptUsed: "Metro 30" },
  { id: "july-16", description: "Bike", amount: 96, categoryId: "transport", date: "2026-07-05", type: "expense", promptUsed: "Bike 96" },
  { id: "july-17", description: "Auto", amount: 92, categoryId: "transport", date: "2026-07-05", type: "expense", promptUsed: "Auto 92" },
  { id: "july-18", description: "Yt gpay", amount: 50, categoryId: "bills", date: "2026-07-05", type: "expense", promptUsed: "yt gpay 50" },
  { id: "july-19", description: "Water", amount: 10, categoryId: "groceries", date: "2026-07-05", type: "expense", promptUsed: "water 10" },
  { id: "july-20", description: "Groceries", amount: 149, categoryId: "groceries", date: "2026-07-05", type: "expense", promptUsed: "groceries 149" },
  { id: "july-21", description: "Wrap", amount: 75, categoryId: "food", date: "2026-07-06", type: "expense", promptUsed: "wrap 75" },
  { id: "july-22", description: "Food", amount: 110, categoryId: "food", date: "2026-07-06", type: "expense", promptUsed: "food 110" },
  { id: "july-23", description: "Namkeen", amount: 10, categoryId: "food", date: "2026-07-06", type: "expense", promptUsed: "namkeen 10" },
  { id: "july-24", description: "Rajma chawal", amount: 147, categoryId: "food", date: "2026-07-06", type: "expense", promptUsed: "rajma chawal 147" },
  { id: "july-25", description: "Mcd", amount: 146, categoryId: "food", date: "2026-07-06", type: "expense", promptUsed: "mcd 146" },
  { id: "july-26", description: "Food", amount: 131, categoryId: "food", date: "2026-07-07", type: "expense", promptUsed: "food 131" },
  { id: "july-27", description: "Bribe", amount: 250, categoryId: "misc", date: "2026-07-07", type: "expense", promptUsed: "bribe 250" },
  { id: "july-28", description: "Dinner", amount: 350, categoryId: "food", date: "2026-07-07", type: "expense", promptUsed: "dinner 350" },
  { id: "july-29", description: "Metro", amount: 20, categoryId: "transport", date: "2026-07-08", type: "expense", promptUsed: "Metro 20" },
  { id: "july-30", description: "Train", amount: 97, categoryId: "transport", date: "2026-07-08", type: "expense", promptUsed: "train 97" },
  { id: "july-31", description: "Cab", amount: 150, categoryId: "transport", date: "2026-07-08", type: "expense", promptUsed: "cab 150" },
  { id: "july-32", description: "Sandwich", amount: 50, categoryId: "food", date: "2026-07-08", type: "expense", promptUsed: "sandwich 50" },
  { id: "july-33", description: "Coffee", amount: 140, categoryId: "food", date: "2026-07-10", type: "expense", promptUsed: "coffee 140" },
  { id: "july-34", description: "Ice cream", amount: 160, categoryId: "food", date: "2026-07-10", type: "expense", promptUsed: "ice cream 160" },
  { id: "july-35", description: "Apple music", amount: 59, categoryId: "bills", date: "2026-07-11", type: "expense", promptUsed: "apple music 59" },
  { id: "july-36", description: "Pizza", amount: 495, categoryId: "food", date: "2026-07-12", type: "expense", promptUsed: "495 pizza" },
  { id: "july-37", description: "Gf", amount: 1346, categoryId: "shopping", date: "2026-07-13", type: "expense", promptUsed: "gf 1346" },
  { id: "july-38", description: "Patties", amount: 150, categoryId: "food", date: "2026-07-13", type: "expense", promptUsed: "Patties 150" },
  { id: "july-39", description: "Kulfa", amount: 140, categoryId: "food", date: "2026-07-13", type: "expense", promptUsed: "kulfa 140" },
  { id: "july-40", description: "Prasad", amount: 10, categoryId: "misc", date: "2026-07-14", type: "expense", promptUsed: "prasad 10" },
  { id: "july-41", description: "Mohan bakery", amount: 70, categoryId: "food", date: "2026-07-14", type: "expense", promptUsed: "mohan bakery 70" },
  { id: "july-42", description: "Subway", amount: 400, categoryId: "food", date: "2026-07-14", type: "expense", promptUsed: "subway 400" },
  { id: "july-43", description: "Zepto", amount: 105, categoryId: "groceries", date: "2026-07-15", type: "expense", promptUsed: "Zepto 105" },
  { id: "july-44", description: "Waffles", amount: 108, categoryId: "food", date: "2026-07-15", type: "expense", promptUsed: "Waffles 108" },
  { id: "july-45", description: "Diet coke", amount: 50, categoryId: "food", date: "2026-07-15", type: "expense", promptUsed: "diet coke 50" },
  { id: "july-46", description: "Veges/fruits", amount: 310, categoryId: "food", date: "2026-07-16", type: "expense", promptUsed: "veges/fruits 310" },
  { id: "july-47", description: "Water", amount: 20, categoryId: "groceries", date: "2026-07-16", type: "expense", promptUsed: "water 20" },
  { id: "july-48", description: "Perfume", amount: 799, categoryId: "shopping", date: "2026-07-17", type: "expense", promptUsed: "Perfume 799" },
  { id: "july-49", description: "Snacks", amount: 200, categoryId: "food", date: "2026-07-17", type: "expense", promptUsed: "snacks 200" },
  { id: "july-50", description: "Pancake", amount: 260, categoryId: "food", date: "2026-07-18", type: "expense", promptUsed: "pancake 260" },
  { id: "july-51", description: "Lunch", amount: 80, categoryId: "food", date: "2026-07-20", type: "expense", promptUsed: "Lunch 80" },
  { id: "july-52", description: "Chai", amount: 20, categoryId: "food", date: "2026-07-20", type: "expense", promptUsed: "Chai 20" },
  { id: "july-53", description: "Face wash", amount: 206, categoryId: "shopping", date: "2026-07-20", type: "expense", promptUsed: "face wash 206" },
  { id: "july-54", description: "Perfora toothpaste", amount: 168, categoryId: "shopping", date: "2026-07-20", type: "expense", promptUsed: "Perfora toothpaste 168" },
  { id: "july-55", description: "Lux soap", amount: 40, categoryId: "shopping", date: "2026-07-20", type: "expense", promptUsed: "Lux soap 40" },
  { id: "july-56", description: "Zepto (towel milk yogurt)", amount: 152, categoryId: "groceries", date: "2026-07-21", type: "expense", promptUsed: "zepto 152(towel milk yogurt)" },
  { id: "july-57", description: "Flat brokerage", amount: 12000, categoryId: "bills", date: "2026-07-21", type: "expense", promptUsed: "Flat brokerage 12000" },
  { id: "july-58", description: "Lunch", amount: 95, categoryId: "food", date: "2026-07-21", type: "expense", promptUsed: "lunch 95" },
  { id: "july-59", description: "Patties", amount: 70, categoryId: "food", date: "2026-07-21", type: "expense", promptUsed: "Patties 70" },
  { id: "july-60", description: "Wrap", amount: 91, categoryId: "food", date: "2026-07-22", type: "expense", promptUsed: "wrap 91" },
  { id: "july-61", description: "Maggi", amount: 65, categoryId: "food", date: "2026-07-22", type: "expense", promptUsed: "Maggi 65" },
  { id: "july-62", description: "Uber", amount: 156, categoryId: "transport", date: "2026-07-22", type: "expense", promptUsed: "uber 156" },
  { id: "july-63", description: "Train", amount: 97, categoryId: "transport", date: "2026-07-22", type: "expense", promptUsed: "train 97" },
  { id: "july-64", description: "Snacks", amount: 45, categoryId: "food", date: "2026-07-22", type: "expense", promptUsed: "snacks 45" },
  { id: "july-65", description: "Jeans (payment done)", amount: 1199, categoryId: "shopping", date: "2026-07-22", type: "expense", promptUsed: "Jeans 1199 - payment done but no response" },
  { id: "july-66", description: "Train ticket booking (5 aug)", amount: 192, categoryId: "transport", date: "2026-07-23", type: "expense", promptUsed: "train ticket booking - 192 (5 aug)" },
  { id: "july-67", description: "Burger", amount: 100, categoryId: "food", date: "2026-07-23", type: "expense", promptUsed: "burger 100" },
  { id: "july-68", description: "Ghewar", amount: 780, categoryId: "food", date: "2026-07-24", type: "expense", promptUsed: "Ghewar 780" },
  { id: "july-69", description: "Sleepers", amount: 460, categoryId: "shopping", date: "2026-07-24", type: "expense", promptUsed: "Sleepers 460" },
  { id: "july-70", description: "Momos", amount: 80, categoryId: "food", date: "2026-07-24", type: "expense", promptUsed: "momos 80" },
  { id: "july-71", description: "Salon", amount: 350, categoryId: "shopping", date: "2026-07-26", type: "expense", promptUsed: "Salon 350" },
  { id: "july-72", description: "Fruits", amount: 500, categoryId: "food", date: "2026-07-26", type: "expense", promptUsed: "fruits 500" },
  { id: "july-73", description: "Train", amount: 97, categoryId: "transport", date: "2026-07-26", type: "expense", promptUsed: "train 97" },
  { id: "july-74", description: "Auto", amount: 20, categoryId: "transport", date: "2026-07-26", type: "expense", promptUsed: "auto 20" },
  { id: "july-75", description: "Lassi", amount: 20, categoryId: "food", date: "2026-07-26", type: "expense", promptUsed: "Lassi 20" },
  { id: "july-76", description: "Uber", amount: 100, categoryId: "transport", date: "2026-07-26", type: "expense", promptUsed: "Uber 100" },
  { id: "july-77", description: "Breakfast", amount: 85, categoryId: "food", date: "2026-07-27", type: "expense", promptUsed: "Breakfast 85" },
  { id: "july-78", description: "Lunch", amount: 222, categoryId: "food", date: "2026-07-27", type: "expense", promptUsed: "lunch 222" },
  { id: "july-79", description: "Assam donation", amount: 1000, categoryId: "bills", date: "2026-07-27", type: "expense", promptUsed: "assam donation 1000" },
  { id: "july-80", description: "Breakfast", amount: 85, categoryId: "food", date: "2026-07-28", type: "expense", promptUsed: "Breakfast 85" },
  { id: "july-81", description: "Subway", amount: 246, categoryId: "food", date: "2026-07-28", type: "expense", promptUsed: "Subway 246" },
  { id: "july-82", description: "Chips", amount: 250, categoryId: "food", date: "2026-07-28", type: "expense", promptUsed: "Chips 250" },
  { id: "july-83", description: "Parking", amount: 70, categoryId: "transport", date: "2026-07-28", type: "expense", promptUsed: "Parking 70" },
  { id: "july-84", description: "Chai", amount: 30, categoryId: "food", date: "2026-07-29", type: "expense", promptUsed: "chai 30" },
  { id: "july-85", description: "Petrol", amount: 200, categoryId: "transport", date: "2026-07-29", type: "expense", promptUsed: "Petrol 200" },
  { id: "july-86", description: "Metro", amount: 41, categoryId: "transport", date: "2026-07-29", type: "expense", promptUsed: "Metro 41" },
  { id: "july-87", description: "Bus", amount: 335, categoryId: "transport", date: "2026-07-29", type: "expense", promptUsed: "bus 335" },
  { id: "july-88", description: "Chips", amount: 25, categoryId: "food", date: "2026-07-29", type: "expense", promptUsed: "Chips 25" },
  { id: "july-89", description: "Gf", amount: 976, categoryId: "shopping", date: "2026-07-30", type: "expense", promptUsed: "gf 976" },
  { id: "july-90", description: "Desk gadgets", amount: 486, categoryId: "shopping", date: "2026-07-30", type: "expense", promptUsed: "desk gadgets 486" },
  { id: "july-91", description: "Snacks", amount: 256, categoryId: "food", date: "2026-07-30", type: "expense", promptUsed: "snacks 256" },
  { id: "july-92", description: "Shoes", amount: 4400, categoryId: "shopping", date: "2026-07-31", type: "expense", promptUsed: "shoes 4400" },
  { id: "july-93", description: "Snacks", amount: 376, categoryId: "food", date: "2026-07-31", type: "expense", promptUsed: "snacks 376" },
  { id: "july-94", description: "Subway", amount: 390, categoryId: "food", date: "2026-07-31", type: "expense", promptUsed: "subway 390" }
];

export function loadExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      saveExpenses(JULY_SEED_DATA);
      return JULY_SEED_DATA;
    }
    return JSON.parse(data);
  } catch (err) {
    return JULY_SEED_DATA;
  }
}

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
