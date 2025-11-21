// mockData.ts

import { TokenPair, TokenBadge, TokenStatus } from "@/types";

// Real tokens list
const REAL_TOKENS = [
  { symbol: "BTC", name: "Bitcoin", image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  { symbol: "ETH", name: "Ethereum", image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
  { symbol: "SOL", name: "Solana", image: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
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
