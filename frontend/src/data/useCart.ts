import { useState, useEffect } from "react";

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

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [cart, isInitialized]);

  // Add item to cart or update quantity if already exists
  const addToCart = (
    item: Omit<CartItem, "quantity">,
    quantity: number = 1
  ) => {
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
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Increment item quantity
  const incrementQuantity = (itemId: string) => {
    updateQuantity(
      itemId,
      (cart.find((item) => item.id === itemId)?.quantity || 0) + 1
    );
  };

  // Decrement item quantity
  const decrementQuantity = (itemId: string) => {
    const item = cart.find((item) => item.id === itemId);
    if (item) {
      if (item.quantity <= 1) {
        removeFromCart(itemId);
      } else {
        updateQuantity(itemId, item.quantity - 1);
      }
    }
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate total items in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Check if an item is in the cart
  const isInCart = (itemId: string) => {
    return cart.some((item) => item.id === itemId);
  };

  // Get quantity of a specific item in cart
  const getItemQuantity = (itemId: string) => {
    return cart.find((item) => item.id === itemId)?.quantity || 0;
  };

  return {
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
  };
};

export default useCart;
