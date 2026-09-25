import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistItems: Product[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);
const WISHLIST_STORAGE_KEY = 'atelier_wishlist_v1';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to persist wishlist:', e);
    }
  }, [wishlistIds]);

  const isInWishlist = useCallback((productId: string) => wishlistIds.includes(productId), [wishlistIds]);

  const toggleWishlist = useCallback(
    (productId: string) => {
      const product = PRODUCTS.find((p) => p.id === productId);
      setWishlistIds((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast({
            type: 'info',
            title: 'Removed from Saved Works',
            message: product?.name,
          });
          return prev.filter((id) => id !== productId);
        } else {
          showToast({
            type: 'success',
            title: 'Saved to Archive',
            message: product?.name,
          });
          return [...prev, productId];
        }
      });
    },
    [showToast]
  );

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
  }, []);

  const wishlistItems = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        wishlistCount: wishlistIds.length,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
