import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import type { Product } from '../types';

const TestComponent = () => {
  const { cartItems, cartCount, cartSubtotal, addToCart, removeFromCart, updateQty, clearCart } = useCart();

  const mockProduct: Product = {
    _id: 'prod123',
    name: 'Test Product',
    description: 'Test Description',
    image: 'https://example.com/test.jpg',
    originalPrice: 100,
    salePrice: 80,
    category: 'Test Category',
    stock: 5,
    discountPercent: 20,
  };

  return (
    <div>
      <div data-testid="count">{cartCount}</div>
      <div data-testid="subtotal">{cartSubtotal}</div>
      <div data-testid="items-length">{cartItems.length}</div>
      
      <button data-testid="add-btn" onClick={() => addToCart(mockProduct, 2)}>
        Add Product
      </button>
      <button data-testid="update-btn" onClick={() => updateQty('prod123', 3)}>
        Update Qty
      </button>
      <button data-testid="remove-btn" onClick={() => removeFromCart('prod123')}>
        Remove Product
      </button>
      <button data-testid="clear-btn" onClick={clearCart}>
        Clear Cart
      </button>
    </div>
  );
};

describe('CartContext', () => {
  it('should start with an empty cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('0');
    expect(screen.getByTestId('items-length')).toHaveTextContent('0');
  });

  it('should add items to the cart and calculate subtotal', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addBtn = screen.getByTestId('add-btn');
    await act(async () => {
      addBtn.click();
    });

    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('160'); // 80 * 2
    expect(screen.getByTestId('items-length')).toHaveTextContent('1');
  });

  it('should respect product stock limit', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addBtn = screen.getByTestId('add-btn');
    
    // Add first time (2 items)
    await act(async () => {
      addBtn.click();
    });
    // Add second time (4 items total)
    await act(async () => {
      addBtn.click();
    });

    expect(screen.getByTestId('count')).toHaveTextContent('4');

    // Add again (6 items total), but should be capped at stock = 5
    await act(async () => {
      addBtn.click();
    });

    expect(screen.getByTestId('count')).toHaveTextContent('5');
  });

  it('should update quantity of an item', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addBtn = screen.getByTestId('add-btn');
    const updateBtn = screen.getByTestId('update-btn');

    await act(async () => {
      addBtn.click();
    });
    await act(async () => {
      updateBtn.click();
    });

    expect(screen.getByTestId('count')).toHaveTextContent('3');
  });

  it('should remove item', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addBtn = screen.getByTestId('add-btn');
    const removeBtn = screen.getByTestId('remove-btn');

    await act(async () => {
      addBtn.click();
    });
    expect(screen.getByTestId('items-length')).toHaveTextContent('1');

    await act(async () => {
      removeBtn.click();
    });
    expect(screen.getByTestId('items-length')).toHaveTextContent('0');
  });
});
