// api.ts

import { TokenPair, TokenStatus } from "@/types";
import { generateMockToken, generateMockTokens } from "./mockData";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Fetch in batches
export const fetchTokensBatch = async (
  status: TokenStatus,
  page: number = 0,
  pageSize: number = 20
): Promise<{ tokens: TokenPair[]; hasMore: boolean; total: number }> => {
  await delay(300);

  const totalTokens = 100;
  const start = page * pageSize;
  const end = Math.min(start + pageSize, totalTokens);

  if (start >= totalTokens) {
    return { tokens: [], hasMore: false, total: totalTokens };
  }

  const statusOffset: Record<TokenStatus, number> = {
    new: 0,
    "final-stretch": 1000,
    migrated: 2000,
    trending: 3000,
  };

  const base = statusOffset[status];
  const tokens: TokenPair[] = [];

  for (let i = 0; i < end - start; i++) {
    tokens.push(generateMockToken(base + start + i, status));
  }

  return {
    tokens,
    hasMore: end < totalTokens,
    total: totalTokens,
  };
};

// Legacy usage
export const fetchTokens = async (): Promise<any[]> => {
  await delay(50);

  const newPairs = generateMockTokens(20, "new");
  const finalStretch = generateMockTokens(20, "final-stretch");
  const migrated = generateMockTokens(20, "migrated");

  return [...newPairs, ...finalStretch, ...migrated];
};

export const fetchTokenById = async (id: string) => {
  await delay(150);
  const tokens = await fetchTokens();
  return tokens.find((t) => t.id === id) || null;
};
