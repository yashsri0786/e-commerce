
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { PlumbingPart } from "../types/plumbing-types";

interface CartItem extends PlumbingPart {
  quantity: number;
}

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: PlumbingPart) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setPhoneNumber: (phoneNumber: string) => void; // ADDED
  userPhone: string;  // ADDED
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });
  const [userPhone, setUserPhone] = useState<string>(''); // Add userPhone state

  // Persist cart changes to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
     if (userPhone) {
         updateBackendCart(userPhone, cartItems); // Send updates whenever cart changes
     }
  }, [cartItems, userPhone]);

  const addToCart = useCallback((product: PlumbingPart) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id,
      );
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setCartItems((prevItems) =>
        prevItems
          .map((item) => (item.id === productId ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0),
      );
    },
    [],
  );
    // Function to update the backend cart
  const updateBackendCart = useCallback(async (phone: string, items: CartItem[]) => {
      try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ phone, cartItems: items }),
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to update cart.');
          }

          const responseData = await response.json();
          console.log('Cart updated on backend:', responseData);

      } catch (error) {
          console.error('Error updating cart on backend:', error);
      }
  }, []);

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    setPhoneNumber: setUserPhone, // Use the state setter
    userPhone: userPhone,          // Provide the state value

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