'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { competitions as initialCompetitions, type Competition } from './mock-data';
import { formatPrice } from './utils';

export interface CartItem {
  competitionId: string;
  competitionTitle: string;
  imageUrl: string;
  ticketPrice: number;
  quantity: number;
}

interface StoreContextType {
  competitions: Competition[];
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (competitionId: string) => void;
  updateCartQuantity: (competitionId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => void;
  cartTotal: number;
  cartCount: number;
  lastOrder: CartItem[] | null;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [competitions, setCompetitions] = useState<Competition[]>(
    () => initialCompetitions.map((c) => ({ ...c }))
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<CartItem[] | null>(null);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.competitionId === item.competitionId);
      if (existing) {
        return prev.map((i) =>
          i.competitionId === item.competitionId
            ? { ...i, quantity: item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((competitionId: string) => {
    setCart((prev) => prev.filter((i) => i.competitionId !== competitionId));
  }, []);

  const updateCartQuantity = useCallback((competitionId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.competitionId !== competitionId));
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.competitionId === competitionId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const checkout = useCallback(() => {
    setCompetitions((prev) =>
      prev.map((comp) => {
        const cartItem = cart.find((i) => i.competitionId === comp.id);
        if (!cartItem) return comp;
        const newSold = Math.min(comp.ticketsSold + cartItem.quantity, comp.totalTickets);
        return { ...comp, ticketsSold: newSold };
      })
    );
    setLastOrder([...cart]);
    setCart([]);
    setCartOpen(false);
  }, [cart]);

  const cartTotal = cart.reduce((sum, item) => sum + item.ticketPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        competitions,
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        checkout,
        cartTotal,
        cartCount,
        lastOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function useCompetitions() {
  return useStore().competitions;
}

export function useCompetition(idOrSlug: string) {
  const { competitions } = useStore();
  return competitions.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
}

export { formatPrice };
