import React, { createContext, useState, useEffect, useContext } from 'react';
import type { Product, CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from local storage
  useEffect(() => {
    const storedCart = localStorage.getItem('grabAllCart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (err) {
        localStorage.removeItem('grabAllCart');
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('grabAllCart', JSON.stringify(items));
  };

  const addToCart = (product: Product, qty: number) => {
    const existingItem = cartItems.find((item) => item._id === product._id);
    if (existingItem) {
      const updatedItems = cartItems.map((item) =>
        item._id === product._id ? { ...item, qty: Math.min(item.qty + qty, product.stock) } : item
      );
      saveCart(updatedItems);
    } else {
      saveCart([...cartItems, { _id: product._id, product, qty }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedItems = cartItems.filter((item) => item._id !== productId);
    saveCart(updatedItems);
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedItems = cartItems.map((item) =>
      item._id === productId ? { ...item, qty: Math.min(qty, item.product.stock) } : item
    );
    saveCart(updatedItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.qty * item.product.salePrice, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
