import { autoDetectCategory } from './categories';

export function parseExpensePrompt(prompt, customCategories = []) {
  if (!prompt || typeof prompt !== 'string') {
    return {
      amount: 0,
      description: '',
      category: autoDetectCategory('', customCategories),
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      isValid: false
    };
  }

  let text = prompt.trim();
  let type = 'expense';
  let date = new Date().toISOString().split('T')[0];

  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('yesterday')) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    date = d.toISOString().split('T')[0];
    text = text.replace(/yesterday/gi, '').trim();
  } else if (lowerText.includes('today')) {
    date = new Date().toISOString().split('T')[0];
    text = text.replace(/today/gi, '').trim();
  } else {
    const daysAgoMatch = lowerText.match(/(\d+)\s*(days?|d)\s*ago/);
    if (daysAgoMatch) {
      const days = parseInt(daysAgoMatch[1], 10);
      const d = new Date();
      d.setDate(d.getDate() - days);
      date = d.toISOString().split('T')[0];
      text = text.replace(/(\d+)\s*(days?|d)\s*ago/gi, '').trim();
    }
  }

  if (text.startsWith('+') || text.includes(' +')) {
    type = 'income';
  }

  const amountMatch = text.match(/(?:[\$\₹\€\£]|\+|\-)?\s*(\d+(?:\.\d{1,2})?)/);
  let amount = 0;
  
  if (amountMatch) {
    amount = parseFloat(amountMatch[1]);
    text = text.replace(amountMatch[0], '').trim();
  }

  let description = text.replace(/[\$\₹\€\£\+\-]/g, '').trim();
  
  if (description) {
    description = description
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  } else {
    description = 'Quick Expense';
  }

  let category = autoDetectCategory(prompt, customCategories);
  if (type === 'income' && category.id !== 'income') {
    const incomeCat = autoDetectCategory('salary', customCategories);
    if (incomeCat) category = incomeCat;
  }

  const isValid = amount > 0;

  return {
    amount,
    description,
    category,
    date,
    type: category.isIncome || type === 'income' ? 'income' : 'expense',
    isValid
  };
}
