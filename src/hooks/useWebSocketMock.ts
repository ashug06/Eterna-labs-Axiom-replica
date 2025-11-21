
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store/hooks';
import { updatePrice } from '@/store/slices/tokensSlice';
import { TokenPair, PriceUpdate } from '@/types';

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
      queryClient.setQueriesData({ queryKey: ['tokens'] }, (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            tokens: page.tokens.map((token: TokenPair) => {
              if (Math.random() > 0.2) return token;

              const move = (Math.random() - 0.5) * 2 * VOLATILITY;
              const newPrice = Math.max(0.000001, token.price * (1 + move));
              const newChange = token.priceChange24h + (move * 100);
              
              const priceUpdate: PriceUpdate = {
                id: token.id,
                price: newPrice,
                timestamp: Date.now(),
                direction: move > 0 ? 'up' : 'down',
              };

              dispatch(updatePrice(priceUpdate));

              return {
                ...token,
                price: newPrice,
                priceChange24h: newChange,
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