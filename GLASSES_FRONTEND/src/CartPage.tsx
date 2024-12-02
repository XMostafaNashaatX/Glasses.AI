import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Glasses Frame', price: 50, quantity: 1 },
    { id: 2, name: 'Blue Light Filter', price: 30, quantity: 2 },
  ]);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) return; // Prevent removing items through quantity
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    // Redirect to the OrderPage or handle checkout logic here
    alert('Proceeding to checkout...');
  };

  return (
    <div className="cart-page-container">
      <header className="cart-header">
        <h1>Your Cart</h1>
        <p>Review your items before proceeding to checkout.</p>
      </header>

      {/* Cart Items Section */}
      <section className="cart-section">
        {cartItems.length > 0 ? (
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">${item.price}</span>
                </div>
                <div className="item-quantity">
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button className="remove-item" onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}

        {/* Cart Summary */}
        <div className="cart-summary">
          <p className="total-price-text">Total Price: ${calculateTotalPrice()}</p> {/* Class for Total Price */}
          <Link to="/order">
            <button className="checkout-button">Proceed to Checkout</button>
          </Link>
        </div>
      </section>

      <footer className="cart-footer">
        <p>&copy; 2024 Glasses.AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CartPage;
