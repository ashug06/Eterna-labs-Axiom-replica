// mockData.ts

import { TokenPair, TokenBadge, TokenStatus } from "@/types";

// Real tokens list
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

const r = (min: number, max: number) => Math.random() * (max - min) + min;
const ri = (min: number, max: number) => Math.floor(r(min, max));

const generateBadges = (liq: number): TokenBadge[] => {
  const out: TokenBadge[] = [];
  if (liq > 500_000) out.push({ type: "verified" });
  if (Math.random() > 0.75) out.push({ type: "bagholder", label: "Trending" });
  return out;
};

// Generate ONE token
export const generateMockToken = (
  index: number,
  status: TokenStatus
): TokenPair => {
  const token = REAL_TOKENS[index % REAL_TOKENS.length];

  return {
    id: `mock-${status}-${index}`,
    symbol: token.symbol,
    name: token.name,
    image: token.image,
    marketCap: Math.pow(10, r(7, 10)),
    liquidity: Math.pow(10, r(6, 9)),
    volume24h: Math.pow(10, r(5, 8)),
    price: r(1, 50000),
    priceChange24h: r(-20, 80),
    txns: {
      buys: ri(100, 10000),
      sells: ri(80, 8000),
    },
    holders: ri(5000, 200000),
    age: `${ri(1, 30)}d`,
    badges: generateBadges(Math.pow(10, 6)),
    links: {
      website: "https://example.org",
      twitter: "https://twitter.com/example"
    },
    status,
  };
};

// Generate SIMPLE list (legacy)
export const generateMockTokens = (
  count: number = 20,
  category: TokenStatus = "new"
) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${category}-${i}`,
    name: `${category}-token-${i}`,
    price: Math.random() * 100,
    change: (Math.random() - 0.5) * 10,
    volume: Math.random() * 100000,
    category,
  }));
};
