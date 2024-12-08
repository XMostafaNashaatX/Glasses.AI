import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const { state, dispatch } = useCart();

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { bookId, quantity } });
  };

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link
          to="/books"
          className="inline-block bg-[#5A1A32] text-white px-6 py-2 rounded-lg hover:bg-[#5A1A32]/90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">Shopping Cart</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {state.items.map(({ book, quantity }) => (
            <div
              key={book.id}
              className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md mb-4"
            >
              <img
                src={book.cover}
                alt={book.title}
                className="w-24 h-32 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-gray-600">{book.author}</p>
                <p className="text-[#5A1A32] font-bold">${book.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(book.id, quantity - 1)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(book.id, quantity + 1)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: book.id })}
                    className="ml-4 p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${state.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 font-bold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Link
            to="/checkout"
            className="block w-full bg-[#5A1A32] text-white text-center px-6 py-2 rounded-lg hover:bg-[#5A1A32]/90"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}