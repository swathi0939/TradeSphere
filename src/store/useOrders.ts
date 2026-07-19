import { useCallback, useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import * as ordersService from '@/services/ordersService';
import type { OrderStatus } from '@/types';

export function useOrders(status?: OrderStatus) {
  const asyncState = useAsync(() => ordersService.getOrders(status), [status]);
  return asyncState;
}

export function useCancelOrder() {
  const [isCancelling, setIsCancelling] = useState(false);

  const cancel = useCallback(async (orderId: string) => {
    setIsCancelling(true);
    try {
      return await ordersService.cancelOrder(orderId);
    } finally {
      setIsCancelling(false);
    }
  }, []);

  return { cancel, isCancelling };
}

export function usePlaceOrder() {
  const [isPlacing, setIsPlacing] = useState(false);

  const place = useCallback(async (payload: ordersService.PlaceOrderPayload) => {
    setIsPlacing(true);
    try {
      return await ordersService.placeOrder(payload);
    } finally {
      setIsPlacing(false);
    }
  }, []);

  return { place, isPlacing };
}
