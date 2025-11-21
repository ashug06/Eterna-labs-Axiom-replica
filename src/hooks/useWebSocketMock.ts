/**
 * Mock WebSocket hook for real-time price updates
 * Fixed to support Infinite Query structures and multiple column keys
 */

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store/hooks';
import { updatePrice } from '@/store/slices/tokensSlice';
import { TokenPair, PriceUpdate } from '@/types';

// 800ms is fast but safe. 5ms will crash your browser.
const UPDATE_INTERVAL = 100; 
const VOLATILITY = 0.02; 

export const useWebSocketMock = (enabled: boolean = true) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      // 1. Use setQueriesData to target ALL queries starting with ['tokens']
      // This covers ['tokens', 'new'], ['tokens', 'final-stretch'], etc.
      queryClient.setQueriesData({ queryKey: ['tokens'] }, (oldData: any) => {
        // Check if data exists and has the Infinite Query 'pages' structure
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            tokens: page.tokens.map((token: TokenPair) => {
              // 2. Randomly select ~20% of tokens to update per tick
              if (Math.random() > 0.2) return token;

              // 3. Calculate movement
              const move = (Math.random() - 0.5) * 2 * VOLATILITY;
              const newPrice = Math.max(0.000001, token.price * (1 + move));
              const newChange = token.priceChange24h + (move * 100);
              
              // 4. Create Update Object
              const priceUpdate: PriceUpdate = {
                id: token.id,
                price: newPrice,
                timestamp: Date.now(),
                direction: move > 0 ? 'up' : 'down',
              };

              // 5. Dispatch to Redux (for UI flashing effects)
              dispatch(updatePrice(priceUpdate));

              // 6. Return updated token for React Query Cache
              return {
                ...token,
                price: newPrice,
                priceChange24h: newChange,
                // Add some volume volume for effect
                volume24h: token.volume24h + (Math.random() * 5000),
                txns: {
                  buys: token.txns.buys + (move > 0 ? 1 : 0),
                  sells: token.txns.sells + (move < 0 ? 1 : 0),
                }
              };
            })
          }))
        };
      });

    }, UPDATE_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, queryClient, dispatch]);
};