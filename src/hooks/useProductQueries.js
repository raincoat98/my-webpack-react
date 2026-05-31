import { useQuery } from '@tanstack/react-query';
import { fetchProductDetail, fetchProductHistory, fetchProductMemo } from '@/api/productApi';

export const PRODUCT_KEYS = {
  detail: (id) => ['product', 'detail', id],
  history: (id) => ['product', 'history', id],
  memo: (id) => ['product', 'memo', id],
};

export function useProductDetail(productId, options = {}) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(productId),
    queryFn: () => fetchProductDetail(productId),
    enabled: !!productId,
    ...options,
  });
}

export function useProductHistory(productId, options = {}) {
  return useQuery({
    queryKey: PRODUCT_KEYS.history(productId),
    queryFn: () => fetchProductHistory(productId),
    enabled: !!productId,
    ...options,
  });
}

export function useProductMemo(productId, options = {}) {
  return useQuery({
    queryKey: PRODUCT_KEYS.memo(productId),
    queryFn: () => fetchProductMemo(productId),
    enabled: !!productId,
    ...options,
  });
}
