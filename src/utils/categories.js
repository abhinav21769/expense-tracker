export const DEFAULT_CATEGORIES = [
  {
    id: 'transport',
    name: 'Transport & Commute',
    icon: 'Car',
    color: '#3b82f6',
    keywords: [
      'metro', 'subway', 'train', 'bus', 'uber', 'lyft', 'cab', 'taxi', 'auto',
      'petrol', 'diesel', 'fuel', 'gas', 'gasoline', 'parking', 'toll', 'flight',
      'airline', 'transit', 'car', 'bike', 'scooter', 'rapido', 'ola'
    ]
  },
  {
    id: 'food',
    name: 'Food & Dining',
    icon: 'Utensils',
    color: '#f59e0b',
    keywords: [
      'coffee', 'cafe', 'starbucks', 'dunkin', 'tea', 'chai', 'lunch', 'dinner',
      'breakfast', 'brunch', 'food', 'restaurant', 'pizza', 'burger', 'sushi',
      'taco', 'bakery', 'snack', 'ice cream', 'dessert', 'swiggy', 'zomato',
      'uber eats', 'doordash', 'grubhub', 'mcdonalds', 'kfc', 'subway', 'dominos'
    ]
  },
  {
    id: 'groceries',
    name: 'Groceries & Mart',
    icon: 'ShoppingBag',
    color: '#10b981',
    keywords: [
      'groceries', 'grocery', 'supermarket', 'mart', 'walmart', 'target',
      'trader joe', 'whole foods', 'costco', 'vegetables', 'veggies', 'fruits',
      'milk', 'bread', 'eggs', 'cheese', 'meat', 'chicken', 'fish', 'bazaar',
      'blinkit', 'zepto', 'instamart'
    ]
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    icon: 'Zap',
    color: '#8b5cf6',
    keywords: [
      'bill', 'utility', 'electricity', 'power', 'water', 'internet', 'wifi',
      'broadband', 'phone', 'mobile', 'recharge', 'rent', 'lease', 'gas bill',
      'insurance', 'netflix', 'spotify', 'apple', 'amazon prime', 'hulu', 'subscription'
    ]
  },
  {
    id: 'shopping',
    name: 'Shopping & Apparel',
    icon: 'Tag',
    color: '#ec4899',
    keywords: [
      'shopping', 'clothes', 'clothing', 'shoes', 'dress', 'shirt', 'pants',
      'amazon', 'flipkart', 'myntra', 'zara', 'h&m', 'electronics', 'laptop',
      'phone purchase', 'gadget', 'mall', 'retail', 'gift'
    ]
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'Film',
    color: '#06b6d4',
    keywords: [
      'movie', 'cinema', 'theater', 'ticket', 'concert', 'show', 'game',
      'gaming', 'steam', 'playstation', 'xbox', 'party', 'bar', 'club', 'drinks',
      'beer', 'wine', 'pub', 'event', 'bowling', 'sports'
    ]
  },
  {
    id: 'health',
    name: 'Health & Medical',
    icon: 'HeartPulse',
    color: '#ef4444',
    keywords: [
      'doctor', 'hospital', 'clinic', 'pharmacy', 'medicine', 'pills', 'dentist',
      'eye check', 'medical', 'gym', 'workout', 'fitness', 'supplements', 'protein'
    ]
  },
  {
    id: 'income',
    name: 'Income & Salary',
    icon: 'TrendingUp',
    color: '#22c55e',
    isIncome: true,
    keywords: [
      'salary', 'paycheck', 'income', 'freelance', 'client', 'payment received',
      'bonus', 'cashback', 'refund', 'dividend', 'stipend', 'reward', 'profit'
    ]
  },
  {
    id: 'misc',
    name: 'Others / Misc',
    icon: 'Grid',
    color: '#64748b',
    keywords: []
  }
];

export function autoDetectCategory(text, customCategories = []) {
  if (!text) return DEFAULT_CATEGORIES.find(c => c.id === 'misc');

  const lowerText = text.toLowerCase().trim();
  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];

  if (lowerText.startsWith('+') || lowerText.includes('salary') || lowerText.includes('paycheck') || lowerText.includes('income')) {
    const incomeCat = allCategories.find(c => c.id === 'income');
    if (incomeCat) return incomeCat;
  }

  let bestMatch = null;
  let highestScore = 0;

  for (const category of allCategories) {
    if (!category.keywords) continue;
    
    let score = 0;
    for (const keyword of category.keywords) {
      if (lowerText === keyword) {
        score += 10;
      } else if (lowerText.startsWith(keyword + ' ') || lowerText.endsWith(' ' + keyword)) {
        score += 5;
      } else if (lowerText.includes(keyword)) {
        score += 2;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = category;
    }
  }

  return bestMatch || allCategories.find(c => c.id === 'misc');
}
