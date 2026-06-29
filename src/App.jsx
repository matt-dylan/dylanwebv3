import { useState, useEffect } from 'react';

const SATS_PER_BTC = 100_000_000;
const PRICE_REFRESH_INTERVAL = 60_000; // Refresh every 60 seconds

function App() {
  const [btcPriceUSD, setBtcPriceUSD] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMode, setActiveMode] = useState('usd'); // 'usd', 'btc', or 'sats'

  // USD input values (always in cents to avoid floating point issues)
  const [usdCents, setUsdCents] = useState(0);
  const [btcSatoshi, setBtcSatoshi] = useState(0);
  const [inputValue, setInputValue] = useState('');

  // Fetch BTC price from CoinGecko (public API, no key needed)
  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
        );
        if (!response.ok) throw new Error('Failed to fetch BTC price');
        const data = await response.json();
        setBtcPriceUSD(data.bitcoin.usd);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Could not load BTC price. Will retry...');
        setLoading(false);
      }
    }

    fetchPrice();
    const interval = setInterval(fetchPrice, PRICE_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Convert between units based on active mode and current value
  function convert(newInputValue) {
    if (!btcPriceUSD || btcPriceUSD <= 0) return;

    const num = parseFloat(newInputValue);
    if (isNaN(num)) {
      setUsdCents(0);
      setBtcSatoshi(0);
      return;
    }

    let newUsdCents, newBtcSatoshi, newInputVal;

    switch (activeMode) {
      case 'usd':
        // Input is USD → calculate BTC and Sats
        const usd = num;
        const satsFromUsd = Math.round((usd / btcPriceUSD) * SATS_PER_BTC);
        const btcFromUsd = (usd / btcPriceUSD) * 100_000_000; // in satoshi precision
        
        newUsdCents = Math.round(usd * 100);
        newBtcSatoshi = satsFromUsd;
        
        // Format input display based on mode
        if (activeMode === 'usd') {
          newInputVal = num.toFixed(2);
        } else if (activeMode === 'btc') {
          newInputVal = btcFromUsd.toFixed(8);
        } else {
          newInputVal = satsFromUsd.toLocaleString('en-US');
        }
        break;

      case 'btc':
        // Input is BTC → calculate USD and Sats
        const btc = num;
        const usdFromBtc = btc * btcPriceUSD;
        const satsFromBtc = Math.round(btc * SATS_PER_BTC);
        
        newUsdCents = Math.round(usdFromBtc * 100);
        newBtcSatoshi = satsFromBtc;
        newInputVal = btc.toFixed(8);
        break;

      case 'sats':
        // Input is Sats → calculate USD and BTC
        const sats = num;
        const usdFromSats = (sats / SATS_PER_BTC) * btcPriceUSD;
        const btcFromSats = sats / SATS_PER_BTC;
        
        newUsdCents = Math.round(usdFromSats * 100);
        newBtcSatoshi = sats;
        newInputVal = num.toLocaleString('en-US');
        break;

      default:
        return;
    }

    setUsdCents(newUsdCents);
    setBtcSatoshi(newBtcSatoshi);
  }

  function handleInputChange(value) {
    // Remove commas and any non-numeric chars except period
    const cleaned = value.replace(/[^0-9.]/g, '');
    
    // If empty or just a period, reset to zero state
    if (!cleaned || cleaned === '.') {
      setInputValue('');
      setUsdCents(0);
      setBtcSatoshi(0);
      return;
    }

    let finalValue = '';
    const numValue = parseFloat(cleaned);
    
    if (activeMode === 'sats') {
      // Sats should be integers only - remove decimal part entirely
      const noDecimal = cleaned.split('.')[0];
      finalValue = noDecimal || '';
      
      if (noDecimal && !isNaN(parseInt(noDecimal))) {
        convert(parseInt(noDecimal));
      } else {
        setUsdCents(0);
        setBtcSatoshi(0);
      }
    } else if (activeMode === 'usd') {
      // USD can have decimals but limit to 2 decimal places
      const parts = cleaned.split('.');
      let formatted = parts[0] || '';
      if (parts.length > 1) {
        formatted += '.' + parts.slice(1).join('').slice(0, 2);
      }
      finalValue = formatted;
      
      if (!isNaN(numValue)) {
        convert(numValue);
      } else {
        setUsdCents(0);
        setBtcSatoshi(0);
      }
    } else if (activeMode === 'btc') {
      // BTC can have up to 8 decimal places
      const parts = cleaned.split('.');
      let formatted = parts[0] || '';
      if (parts.length > 1) {
        formatted += '.' + parts.slice(1).join('').slice(0, 8);
      }
      finalValue = formatted;
      
      if (!isNaN(numValue)) {
        convert(numValue);
      } else {
        setUsdCents(0);
        setBtcSatoshi(0);
      }
    }

    setInputValue(finalValue);
  }

  function switchMode(mode) {
    setActiveMode(mode);
    
    // Reset display based on current conversion values
    if (mode === 'usd') {
      const usdValue = (usdCents / 100).toFixed(2);
      setInputValue(usdValue);
    } else if (mode === 'btc') {
      const btcValue = (btcSatoshi / SATS_PER_BTC).toFixed(8);
      setInputValue(btcValue);
    } else if (mode === 'sats') {
      setInputValue(btcSatoshi.toLocaleString('en-US'));
    }
  }

  function formatBTCFromSats(sats) {
    return (sats / SATS_PER_BTC).toFixed(8);
  }

  function formatUSD(cents) {
    const usd = cents / 100;
    if (usd === 0) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usd);
  }

  function formatSats(sats) {
    if (sats === 0) return '0 sats';
    return new Intl.NumberFormat('en-US').format(sats).concat(' sats');
  }

  function formatBTC(btcValue) {
    // btcValue is in satoshi precision already
    const btc = btcValue / SATS_PER_BTC;
    if (btc < 0.001) return btc.toFixed(8) + ' BTC';
    if (btc < 1) return btc.toFixed(6) + ' BTC';
    return btc.toFixed(4) + ' BTC';
  }

  // Loading state while fetching price
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-orange-500 animate-pulse text-xl font-bold">
          Loading Bitcoin Price...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Main container */}
      <div className="w-full max-w-md mx-auto">
        {/* Header with Bitcoin price */}
        <div className="mb-6 text-center">
          <h1 className="text-orange-500 font-bold text-3xl mb-2 flex items-center justify-center gap-2">
            <span role="img" aria-label="Bitcoin">₿</span>
            Sats Calculator
          </h1>
          
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          
          {/* Live BTC price display */}
          {btcPriceUSD > 0 && (
            <div className="bg-gray-900 rounded-xl p-3 border border-orange-500/20">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Bitcoin Price</p>
              <p className="text-green-400 font-bold text-lg tabular-nums">
                {formatUSD(btcPriceUSD * 100)}
              </p>
            </div>
          )}
        </div>

        {/* Mode switcher */}
        <div className="bg-gray-900 rounded-xl p-1 flex mb-6 border border-orange-500/20">
          {[
            { mode: 'usd', label: 'USD', icon: '$' },
            { mode: 'btc', label: 'BTC', icon: '₿' },
            { mode: 'sats', label: 'SATS', icon: '⚡' }
          ].map(({ mode, label, icon }) => (
            <button
              key={mode}
              onClick={() => switchMode(mode)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                activeMode === mode
                  ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-1">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Main input */}
        <div className="bg-gray-900 rounded-xl p-6 mb-4 border border-orange-500/20">
          <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
            {activeMode === 'usd' && 'Enter USD Amount'}
            {activeMode === 'btc' && 'Enter BTC Amount'}
            {activeMode === 'sats' && 'Enter Sats Amount'}
          </label>
          
          <div className="relative">
            <input
              type="text"
              inputMode={activeMode === 'sats' ? 'numeric' : 'decimal'}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={activeMode === 'usd' ? '$0.00' : activeMode === 'btc' ? '₿0.00000000' : '⚡0'}
              className="w-full bg-gray-950 text-white text-3xl font-bold py-4 pr-16 rounded-lg border border-orange-500/20 focus:border-orange-500 focus:outline-none transition-colors tabular-nums"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 font-bold">
              {activeMode === 'usd' && '$'}
              {activeMode === 'btc' && '₿'}
              {activeMode === 'sats' && '⚡'}
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-900 rounded-xl p-6 border border-orange-500/20 space-y-4">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Equivalents</p>
          
          {/* USD equivalent */}
          {usdCents > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400 text-sm flex items-center gap-1">
                💵 USD
              </span>
              <span className="text-green-400 font-bold tabular-nums">
                {formatUSD(usdCents)}
              </span>
            </div>
          )}

          {/* BTC equivalent */}
          {btcSatoshi > 0 && (
            <>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  ₿ BTC
                </span>
                <span className="text-orange-500 font-bold tabular-nums">
                  {formatBTC(btcSatoshi)}
                </span>
              </div>

              {/* Sats equivalent */}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  ⚡ SATS
                </span>
                <span className="text-orange-500 font-bold tabular-nums">
                  {formatSats(btcSatoshi)}
                </span>
              </div>
            </>
          )}

          {/* Zero state */}
          {usdCents === 0 && btcSatoshi === 0 && (
            <p className="text-gray-500 text-center py-4 italic">
              Enter an amount above to see conversions...
            </p>
          )}

          {/* Current rate display */}
          {btcPriceUSD > 0 && btcSatoshi > 0 && (
            <div className="pt-3 border-t border-gray-800 text-center">
              <p className="text-gray-500 text-xs">
                At current price • Refreshes every minute
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-xs">
            Price from CoinGecko API • 1 BTC = {SATS_PER_BTC.toLocaleString()} sats
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
