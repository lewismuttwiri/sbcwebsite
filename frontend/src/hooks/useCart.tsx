import React from "react";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  brandName: string;
}

const CART_STORAGE_KEY = "sbc_cart";

const useCartStorage = () => {
  const loadCart = useCallback((): CartItem[] => {
    if (typeof window === "undefined") return [];

    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        return Array.isArray(parsedCart) ? parsedCart : [];
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
    return [];
  }, []);

  const saveCart = useCallback((cart: CartItem[]) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, []);

  return { loadCart, saveCart };
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (id: string) => boolean;
  getItemQuantity: (id: string) => number;
  isInitialized: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { loadCart, saveCart } = useCartStorage();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = loadCart();
    setCart(savedCart);
    setIsInitialized(true);
  }, [loadCart]);

  // Save cart to localStorage whenever it changes (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveCart(cart);
    }
  }, [cart, isInitialized, saveCart]);

  // Cart manipulation functions
  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(
          (cartItem) => cartItem.id === item.id
        );

        if (existingItemIndex >= 0) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + quantity,
          };
          return updatedCart;
        }

        return [...prevCart, { ...item, quantity }];
      });
    },
    []
  );

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback(
    (itemId: string, newQuantity: number) => {
      if (newQuantity < 1) {
        removeFromCart(itemId);
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    },
    [removeFromCart]
  );

  const incrementQuantity = useCallback((itemId: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decrementQuantity = useCallback((itemId: string) => {
    setCart((prevCart) => {
      return prevCart.reduce((acc, item) => {
        if (item.id === itemId) {
          if (item.quantity <= 1) {
            // Remove item if quantity would be 0
            return acc;
          } else {
            // Decrease quantity
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Utility functions
  const isInCart = useCallback(
    (itemId: string) => {
      return cart.some((item) => item.id === itemId);
    },
    [cart]
  );

  const getItemQuantity = useCallback(
    (itemId: string) => {
      return cart.find((item) => item.id === itemId)?.quantity || 0;
    },
    [cart]
  );

  // Calculated values using useMemo for performance
  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      incrementQuantity,
      decrementQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isInCart,
      getItemQuantity,
      isInitialized,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      incrementQuantity,
      decrementQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isInCart,
      getItemQuantity,
      isInitialized,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
