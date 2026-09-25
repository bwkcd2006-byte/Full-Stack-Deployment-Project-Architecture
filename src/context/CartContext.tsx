import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CartItem, Product, ProductColor, Order, ShippingAddress, ShippingMethod } from '../types';
import { PROMO_CODES } from '../data/products';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  promoCode: string | null;
  promoError: string | null;
  appliedPromo: { code: string; description: string; discountPercent?: number; discountFixed?: number } | null;
  isCartOpen: boolean;
  addToCart: (product: Product, color: ProductColor, quantity?: number) => void;
  updateQuantity: (productId: string, colorName: string, quantity: number) => void;
  removeFromCart: (productId: string, colorName: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  createOrder: (address: ShippingAddress, method: ShippingMethod, paymentMethod: string) => Order;
  orders: Order[];
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'atelier_cart_v1';
const ORDERS_STORAGE_KEY = 'atelier_orders_v1';
const FREE_SHIPPING_THRESHOLD = 150;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Load initial cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Load orders history from localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  // Persist orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders:', e);
    }
  }, [orders]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addToCart = useCallback(
    (product: Product, color: ProductColor, quantity = 1) => {
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product.id === product.id && item.selectedColor.name === color.name
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = updated[existingIndex].quantity + quantity;
          // check stock limit
          const finalQty = Math.min(newQty, product.stockCount);
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: finalQty,
          };
          return updated;
        } else {
          return [...prev, { product, selectedColor: color, quantity: Math.min(quantity, product.stockCount) }];
        }
      });

      showToast({
        type: 'success',
        title: 'Added to Bag',
        message: `${product.name} (${color.name})`,
      });

      // Subtle open cart drawer to provide direct tactile feedback
      setIsCartOpen(true);
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (productId: string, colorName: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, colorName);
        return;
      }

      setCart((prev) =>
        prev.map((item) => {
          if (item.product.id === productId && item.selectedColor.name === colorName) {
            const capped = Math.min(quantity, item.product.stockCount);
            return { ...item, quantity: capped };
          }
          return item;
        })
      );
    },
    []
  );

  const removeFromCart = useCallback(
    (productId: string, colorName: string) => {
      setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedColor.name === colorName)));
      showToast({
        type: 'info',
        title: 'Item Removed',
        message: 'Item has been removed from your shopping bag',
      });
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setPromoCode(null);
  }, []);

  const applyPromoCode = useCallback(
    (code: string): boolean => {
      const clean = code.trim().toUpperCase();
      const match = PROMO_CODES[clean];

      if (!match) {
        setPromoError('Invalid promo code. Try CAPSTONE15 or WELCOME10.');
        return false;
      }

      setPromoCode(clean);
      setPromoError(null);
      showToast({
        type: 'success',
        title: 'Promo Applied',
        message: `${match.description}`,
      });
      return true;
    },
    [showToast]
  );

  const removePromoCode = useCallback(() => {
    setPromoCode(null);
    setPromoError(null);
  }, []);

  // Compute financial totals
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const appliedPromo = useMemo(() => {
    if (!promoCode || !PROMO_CODES[promoCode]) return null;
    return PROMO_CODES[promoCode];
  }, [promoCode]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.minOrder && subtotal < appliedPromo.minOrder) return 0;
    if (appliedPromo.discountPercent) {
      return (subtotal * appliedPromo.discountPercent) / 100;
    }
    if (appliedPromo.discountFixed) {
      return Math.min(appliedPromo.discountFixed, subtotal);
    }
    return 0;
  }, [appliedPromo, subtotal]);

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - (subtotal - discount));
  const shippingCost = subtotal === 0 || subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : 25;
  const tax = useMemo(() => {
    const taxableAmount = Math.max(0, subtotal - discount);
    return Math.round(taxableAmount * 0.08 * 100) / 100; // 8% state and regional craft tax
  }, [subtotal, discount]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + shippingCost + tax);
  }, [subtotal, discount, shippingCost, tax]);

  const createOrder = useCallback(
    (address: ShippingAddress, method: ShippingMethod, paymentMethod: string): Order => {
      const orderId = `ATL-${Math.floor(100000 + Math.random() * 900000)}`;
      const deliveryDays = method === 'express' ? 2 : method === 'white-glove' ? 4 : 5;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

      const newOrder: Order = {
        id: orderId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: [...cart],
        shippingAddress: address,
        shippingMethod: method,
        shippingCost: method === 'white-glove' ? 65 : method === 'express' ? 35 : shippingCost,
        subtotal,
        discount,
        tax,
        total: total + (method === 'white-glove' ? 65 : method === 'express' ? 35 : 0),
        status: 'In Production',
        trackingNumber: `1Z9999999${Math.floor(10000000 + Math.random() * 90000000)}`,
        estimatedDelivery: deliveryDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        }),
        paymentMethod,
      };

      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
      return newOrder;
    },
    [cart, shippingCost, subtotal, discount, tax, total, clearCart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        discount,
        shippingCost,
        tax,
        total,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
        promoCode,
        promoError,
        appliedPromo,
        isCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
        openCart,
        closeCart,
        toggleCart,
        createOrder,
        orders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
