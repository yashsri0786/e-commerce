import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { NeuralNarrativeEcommercePart } from '../types/neural_narrative_ecommerce-types';

interface CartItem extends NeuralNarrativeEcommercePart {
  quantity: number;
}

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: NeuralNarrativeEcommercePart) => void;
  removeFromCart: (productId: string) => void; // Corrected type here.
  updateQuantity: (productId: string, quantity: number) => void; // Corrected type here.
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: NeuralNarrativeEcommercePart) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => { // Corrected type here.
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => { // Corrected type here.
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0) // Remove items with 0 quantity
    );
  }, []);

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>
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