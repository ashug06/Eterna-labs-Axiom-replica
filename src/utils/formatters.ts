
export const formatCompactNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toFixed(0);
};


export const formatCurrency = (num: number): string => {
  return `$${formatCompactNumber(num)}`;
};

export const formatPrice = (price: number): string => {
  if (price < 0.01) {
    return `$${price.toFixed(6)}`;
  }
  if (price < 1) {
    return `$${price.toFixed(4)}`;
  }
  if (price < 100) {
    return `$${price.toFixed(2)}`;
  }
  return formatCurrency(price);
};


export const formatPercentage = (percent: number): string => {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};


export const getPercentageColor = (percent: number): string => {
  if (percent > 0) return 'text-green-500';
  if (percent < 0) return 'text-red-500';
  return 'text-gray-400';
};


export const formatTxns = (buys: number, sells: number): string => {
  return `${buys} / ${sells}`;
};
