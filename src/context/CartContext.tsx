import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { CartItem, SelectedSeat } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (eventId: string) => void;
  updateSeats: (eventId: string, seats: SelectedSeat[]) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CART_STORAGE_KEY = 'tixorbit_cart';

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(i => i.eventId === item.eventId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          seats: [...updated[existingIndex].seats, ...item.seats],
        };
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (eventId: string) => {
    setItems(prev => prev.filter(item => item.eventId !== eventId));
  };

  const updateSeats = (eventId: string, seats: SelectedSeat[]) => {
    setItems(prev =>
      prev.map(item =>
        item.eventId === eventId ? { ...item, seats } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.seats.length, 0);
  };

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.seats.reduce((sum, seat) => sum + seat.price, 0),
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateSeats,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
