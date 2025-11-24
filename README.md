# 🚗 JDM Finance Tracker

A car enthusiast's finance tracking app with a 90s JDM-inspired design. Track your savings, manage budgets, and find the best deals on car parts and mods.

![JDM Finance Tracker](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8)

## ✨ Features

### 💰 Savings Goals
- Create multiple savings goals for cars, mods, or parts
- Visual progress tracking with animated progress bars
- Set target amounts and deadlines
- Category-based organization (Car, Mod, Part, Other)

### 📊 Transaction Tracking
- Record income, expenses, and savings
- Categorize transactions for better insights
- View transaction history with filtering
- Real-time balance calculations

### 📈 Budget Management
- Set budget limits for different categories
- Track spending against budgets
- Visual alerts for near-limit and over-budget situations
- Weekly, monthly, and yearly budget periods

### 🔍 Deal Finder
- Search for car parts and mods across multiple retailers
- Compare prices from different sources
- See discount percentages and savings
- Direct links to product pages
- Stock availability indicators

### 🎨 90s JDM Aesthetic
- Inspired by Initial D and classic JDM culture
- Vaporwave color scheme (purple, pink, cyan gradients)
- Neon glow effects and animated backgrounds
- Grid patterns and racing stripes
- Retro CRT scan line effects
- Custom scrollbars and animations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LzyMedia/car-finance-tracker.git
cd car-finance-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Pages & Features

### Landing Page (`/`)
- Hero section with animated backgrounds
- Feature highlights
- Quick navigation to main sections

### Dashboard (`/dashboard`)
- Overview of total savings and active goals
- Monthly income and expenses summary
- Savings rate calculation
- Recent transactions feed
- Quick access to create new goals

### Goals (`/dashboard/goals`)
- Create, edit, and delete savings goals
- Progress tracking with visual indicators
- Category-based filtering
- Deadline management

### Transactions (`/dashboard/transactions`)
- Add income, expense, and savings transactions
- Filter by transaction type
- View summary statistics
- Delete transactions

### Budget (`/dashboard/budget`)
- Create category-based budgets
- Track spending limits
- Visual progress bars with color-coded alerts
- Edit and delete budgets

### Deals (`/deals`)
- Search for car parts and mods
- Compare prices across retailers
- View product details and availability
- Direct links to purchase

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **Data Storage**: LocalStorage (client-side)
- **API**: Next.js Route Handlers

## 📂 Project Structure

```
car-finance-tracker/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   └── scrape/          # Web scraping endpoint
│   ├── dashboard/           # Dashboard pages
│   │   ├── goals/          # Savings goals page
│   │   ├── transactions/   # Transactions page
│   │   ├── budget/         # Budget management page
│   │   └── layout.tsx      # Dashboard layout
│   ├── deals/              # Deals finder page
│   ├── globals.css         # Global styles & JDM theme
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── ProgressBar.tsx
│   │   └── index.ts
│   └── Navigation.tsx     # Main navigation component
├── lib/                   # Utility functions
│   ├── storage.ts        # LocalStorage helpers
│   └── utils.ts          # Common utilities
└── types/                # TypeScript type definitions
    └── index.ts
```

## 🎨 Design System

### Color Palette

The app uses a 90s JDM-inspired color scheme:

- **JDM Purple**: `#9b4dff` - Primary brand color
- **JDM Pink**: `#ff3d9a` - Accent color
- **JDM Cyan**: `#00e5ff` - Highlights
- **JDM Orange**: `#ff6b35` - Warnings
- **JDM Yellow**: `#ffd93d` - Success states
- **JDM Red**: `#ff2e63` - Errors/Expenses

### Custom CSS Classes

- `.gradient-text` - Animated gradient text
- `.neon-purple` - Purple neon glow effect
- `.neon-cyan` - Cyan neon glow effect
- `.grid-bg` - Animated grid background
- `.card-hover` - Card hover animation
- `.pulse-glow` - Pulsing glow animation
- `.racing-stripes` - Racing stripe pattern

## 💾 Data Persistence

Currently, the app uses browser LocalStorage for data persistence. Data is stored locally and persists between sessions.

**Storage Keys:**
- `jdm_savings_goals` - Savings goals data
- `jdm_transactions` - Transaction history
- `jdm_budgets` - Budget configurations

**Note**: Data is stored in the browser and will be lost if you clear browser data. For production use, consider implementing:
- Backend database (PostgreSQL, MongoDB)
- User authentication
- Cloud data sync

## 🔧 API Endpoints

### POST `/api/scrape`
Search for deals on car parts and mods.

**Request Body:**
```json
{
  "query": "turbo kit"
}
```

**Response:**
```json
{
  "deals": [...],
  "query": "turbo kit",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Note**: The current implementation returns mock data for demonstration. For production:
1. Implement proper web scraping (respecting robots.txt)
2. Use legitimate APIs from retailers
3. Add rate limiting and caching
4. Handle errors gracefully

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy this app is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LzyMedia/car-finance-tracker)

### Other Platforms

This is a standard Next.js app and can be deployed on:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted with Node.js

## 🔮 Future Enhancements

### Planned Features
- [ ] User authentication and accounts
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real web scraping with legitimate APIs
- [ ] Export data (CSV, PDF reports)
- [ ] Charts and analytics
- [ ] Mobile app (React Native)
- [ ] Dark/Light mode toggle
- [ ] Multi-currency support
- [ ] Goal sharing and community features
- [ ] Notifications and reminders
- [ ] Integration with financial institutions
- [ ] Car valuation tracking
- [ ] Maintenance schedule tracker

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by 90s JDM culture and Initial D
- Built with Next.js and Tailwind CSS
- Icons by Lucide React

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with 💜 for car enthusiasts by car enthusiasts**
