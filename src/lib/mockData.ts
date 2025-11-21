

import { TokenPair, TokenBadge, TokenStatus } from "@/types";

const REAL_TOKENS = [
  { symbol: "BTC", name: "Bitcoin", image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  { symbol: "ETH", name: "Ethereum", image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
  { symbol: "SOL", name: "Solana", image: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
  { symbol: "USDT", name: "Tether", image: "https://assets.coingecko.com/coins/images/325/large/Tether.png" },
  { symbol: "USDC", name: "USD Coin", image: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png" },
  { symbol: "BNB", name: "BNB", image: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png" },
  { symbol: "XRP", name: "XRP", image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png" },
  { symbol: "ADA", name: "Cardano", image: "https://assets.coingecko.com/coins/images/975/large/cardano.png" },
  { symbol: "DOGE", name: "Dogecoin", image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png" },
  { symbol: "AVAX", name: "Avalanche", image: "https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png" },
  { symbol: "DOT", name: "Polkadot", image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png" },
  { symbol: "SHIB", name: "Shiba Inu", image: "https://assets.coingecko.com/coins/images/11939/large/shiba.png" },
  { symbol: "LINK", name: "Chainlink", image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png" },
  { symbol: "TRX", name: "TRON", image: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png" },
  { symbol: "WBTC", name: "Wrapped Bitcoin", image: "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png" },
  { symbol: "LTC", name: "Litecoin", image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png" },
  { symbol: "MATIC", name: "Polygon", image: "https://assets.coingecko.com/coins/images/4713/large/polygon.png" },
  { symbol: "ATOM", name: "Cosmos", image: "https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png" },
  { symbol: "ETC", name: "Ethereum Classic", image: "https://assets.coingecko.com/coins/images/453/large/ethereum-classic-logo.png" },
  { symbol: "APT", name: "Aptos", image: "https://assets.coingecko.com/coins/images/26455/large/aptos.png" },
];

// Random helpers
const r = (min: number, max: number) => Math.random() * (max - min) + min;
const ri = (min: number, max: number) => Math.floor(r(min, max));

const generateAge = (): string => {
  const x = Math.random();
  if (x < 0.5) return `${ri(1, 59)}m`;
  if (x < 0.8) return `${ri(1, 23)}h`;
  return `${ri(1, 14)}d`;
};

const generateBadges = (liq: number): TokenBadge[] => {
  const out: TokenBadge[] = [];
  if (liq > 500_000) out.push({ type: "verified" });
  if (Math.random() > 0.75) out.push({ type: "bagholder", label: "Trending" });
  return out;
};


export const generateMockToken = (
  index: number,
  status: TokenStatus = "active"
): TokenPair => {
  const token = REAL_TOKENS[index % REAL_TOKENS.length];

  // Basic token math
  const marketCap = Math.pow(10, r(7, 10)); // 10M to 10B
  const liquidity = marketCap * r(0.05, 0.25);
  const volume24h = liquidity * r(0.7, 3.5);

  // Real tokens have stable price zones
  let base = r(0.01, 10);
  if (token.symbol === "BTC") base = 100000;
  if (token.symbol === "ETH") base = 5000;
  if (token.symbol === "SOL") base = 200;

  const price = base * r(0.9, 1.1);

  return {
    id: `mock-${token.symbol}-${index}`,
    symbol: token.symbol,
    name: token.name,
    image: token.image || "https://ui-avatars.com/api/?background=random",

    marketCap,
    liquidity,
    volume24h,
    price,
    priceChange24h: r(-20, 80),

    txns: {
      buys: ri(100, 10000),
      sells: ri(80, 8000),
    },

    holders: ri(5000, 200000),
    age: generateAge(),
    badges: generateBadges(liquidity),

    links: {
      website: `https://www.${token.symbol.toLowerCase()}.org`,
      twitter: `https://twitter.com/${token.symbol}`,
    },

    status,
  };
};

// Generate LIST
export const generateMockTokens = (count: number = 20): TokenPair[] => {
  return Array.from({ length: count }, (_, i) => {
    const status: TokenStatus = Math.random() < 0.5 ? "pumping" : "active";
    return generateMockToken(i, status);
  });
};
