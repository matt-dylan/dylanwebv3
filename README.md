# ₿ Sats Calculator

A sleek, mobile-first Bitcoin calculator for converting between **USD**, **BTC**, and **Sats** in real-time. Built with React + Vite + Tailwind CSS v4.

![Sats Calculator Screenshot](./public/screenshot.png)

## Features

- 💱 **Bidirectional conversion** — Switch freely between USD, BTC, and Sats
- ⚡ **Real-time price updates** — Fetches live Bitcoin price from CoinGecko API (refreshes every 60 seconds)
- 📱 **Mobile responsive** — Optimized for phones and tablets
- 🌙 **Dark theme** — Sleek dark UI with Bitcoin orange accents
- 🔢 **Smart input validation** — Sats accept integers only, USD allows 2 decimals, BTC supports up to 8 decimal places

## Live Price

The app pulls the current Bitcoin price from [CoinGecko's public API](https://www.coingecko.com/en/api) with no API key required. Prices auto-refresh every minute for accuracy.

### Quick math reference
1 BTC = 100,000,000 sats (1 sat = 0.00000001 BTC)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd sats-calculator
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or whatever port Vite assigns).

### Production Build

```bash
npm run build
```

This creates an optimized production bundle in the `dist/` directory.

## Tech Stack

- **React** — UI framework
- **Vite** — Build tool and dev server
- **Tailwind CSS v4** — Utility-first CSS framework with zero-JS approach
- **CoinGecko API** — Free, no-API-key Bitcoin price data

## Project Structure

```
sats-calculator/
├── dist/                  # Production build output
├── public/                # Static assets
│   └── screenshot.png     # App preview screenshot
├── src/
│   ├── App.jsx            # Main application component
│   ├── index.css          # Tailwind CSS entry point
│   └── main.jsx           # React entry point
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
├── package.json
└── README.md
```

## License

MIT © [matt-dylan](https://github.com/matt-dylan)
