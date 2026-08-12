# 💸 Smart Prompt Expense Tracker (iOS PWA)

A modern, responsive, high-performance Expense Tracker designed specifically for **iOS (iPhone/iPad)** and desktop browsers. Users enter simple prompts like `"metro 41"` or `"coffee 150"`, and the app instantly parses amounts, titles, dates, and automatically categorizes transactions into a date-wise feed with visual financial analytics.

![App Screenshot](./src/assets/hero.png)

## ✨ Key Features

- ⚡ **Natural Language Prompt Entry**: Type prompts such as `metro 41`, `coffee 150`, `uber 250 yesterday`, `groceries 1200`, `salary +45000`.
- 🏷️ **Automated Intelligent Categorization**: Rule engine covering Transport, Food & Dining, Groceries, Bills & Utilities, Shopping, Entertainment, Health, Income, and Misc.
- 📱 **iOS Progressive Web App (PWA)**: Built-in iOS install guide for Safari **Share → Add to Home Screen** to run full-screen on iPhone with app icon.
- 📊 **Visual Analytics & Financial Insights**: Total Spent, Income, Net Savings, Daily Average, Category Progress Bars, and Top Category Spotlight.
- 💾 **Privacy-First Storage**: Saved locally in browser LocalStorage. Includes CSV & JSON export/backup & restore functionality.
- 🎨 **Apple HIG Aesthetic**: Glassmorphism UI cards, dark/light theme switching, Indian Rupee (₹) formatting, and smooth micro-animations.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 📱 How to Install on iPhone (iOS)

1. Open the hosted web app link in **Safari** on your iPhone.
2. Tap the **Share** icon at the bottom toolbar.
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** in the top right. A standalone **Expenses** app icon will appear on your iPhone home screen!

---

## 🛠️ Tech Stack

- **Framework**: Vite + React
- **Styling**: Tailwind CSS v4 + Glassmorphism UI
- **Icons**: Lucide React
- **Animations**: Canvas Confetti

---

## 📄 License

MIT License
