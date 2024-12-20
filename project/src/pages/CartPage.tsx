import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const handleUpdateQuantity = (itemId: number, action: "+" | "-") => {
    updateQuantity(itemId, action);
  };

  if (cartItems.length === 0) {
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

  console.log(cartItems);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">Shopping Cart</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map(({ id, book, quantity, price }) => (
            <div
              key={id}
              className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md mb-4"
            >
              <img
                src={book.image_url_l}
                alt={book.title}
                className="w-24 h-32 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-gray-600">{book.author}</p>
                <p className="text-[#5A1A32] font-bold">${price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleUpdateQuantity(id, "-")}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(id, "+")}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(id)}
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
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 font-bold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
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
