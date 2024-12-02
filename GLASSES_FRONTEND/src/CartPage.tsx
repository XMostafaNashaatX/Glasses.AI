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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

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

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      // Place order logic - sending order details to the backend
      const response = await fetch("http://127.0.0.1:8000/stores/Add/order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,  // Include all cart items in the order
        }),
        credentials: "include",  // Send cookies with the request
      });

      const data = await response.json();
      if (response.ok) {
        setOrderSuccess(true);
        setCartItems([]); // Clear the cart after successful order
        alert('Order placed successfully!');
      } else {
        setError(data.error || 'Failed to place the order.');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError('An error occurred while placing the order.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    setCartItems([]); // Empty the cart when canceling
    alert('Order has been canceled.');
  };

  const handleUpdateOrder = () => {
    // Update order logic (e.g., send updates to backend)
    console.log('Order updated with new details.');
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

          {/* Order Buttons */}
          {orderSuccess ? (
            <button className="order-success-button" disabled>
              Order Successfully Placed
            </button>
          ) : (
            <>
              <button
                className="checkout-button"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
              <button className="cancel-button" onClick={handleCancelOrder}>
                Cancel Order
              </button>
            </>
          )}
        </div>
      </section>

      <footer className="cart-footer">
        <p>&copy; 2024 Glasses.AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CartPage;
