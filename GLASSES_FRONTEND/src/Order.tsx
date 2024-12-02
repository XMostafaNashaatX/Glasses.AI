// Order.tsx
import React, { useState } from 'react';
import './Order.css';

const OrderPage: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethod: '',
    cardNumber: '',
    cvv: '',
    paypalEmail: '',
  });
  const [errors, setErrors] = useState({
    paymentMethod: '',
    cardNumber: '',
    cvv: '',
    paypalEmail: '',
  });

  const pricePerItem = 50; // Assuming each item costs $50
  const itemQuantity = 1; // Default quantity, assuming only one item in the order

  const handleOrder = () => {
    setErrors({
      paymentMethod: '',
      cardNumber: '',
      cvv: '',
      paypalEmail: '',
    });

    let isValid = true;
    let newErrors = { ...errors };

    // Validate payment method
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Fill this';
      isValid = false;
    }

    // If PayPal is selected, validate PayPal email
    if (formData.paymentMethod === 'paypal' && !formData.paypalEmail) {
      newErrors.paypalEmail = 'Fill this';
      isValid = false;
    }

    // If Credit Card is selected, validate card number and CVV
    if (formData.paymentMethod === 'creditCard') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Fill this';
        isValid = false;
      }
      if (!formData.cvv) {
        newErrors.cvv = 'Fill this';
        isValid = false;
      }
    }

    // If the form is valid, proceed with the animation, otherwise show errors
    if (isValid) {
      if (!isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
        }, 10000); // Reset the animation after 10 seconds
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Calculate total price based on the fixed quantity
  const calculateTotalPrice = () => {
    return pricePerItem * itemQuantity;
  };

  return (
    <div className="order-page-container">
      <header className="order-header">
        <h1>Welcome to Glasses.AI</h1>
        <p>Your perfect pair of glasses is just one click away.</p>
      </header>

      <section className="order-section">
        <h2>Payment and Order</h2>
        <p>Select your favorite style and place your order. We’ll take care of the rest!</p>

        <div className="order-form">
          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleSelectChange}
            >
              <option value="">Select payment method</option>
              <option value="creditCard">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
            {errors.paymentMethod && <div className="error-message">{errors.paymentMethod}</div>}
          </div>

          {formData.paymentMethod === 'creditCard' && (
            <>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  maxLength={16}
                />
                {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  maxLength={3}
                />
                {errors.cvv && <div className="error-message">{errors.cvv}</div>}
              </div>
            </>
          )}

          {formData.paymentMethod === 'paypal' && (
            <div className="form-group">
              <label htmlFor="paypalEmail">PayPal Email</label>
              <input
                type="email"
                id="paypalEmail"
                name="paypalEmail"
                value={formData.paypalEmail}
                onChange={handleInputChange}
              />
              {errors.paypalEmail && <div className="error-message">{errors.paypalEmail}</div>}
            </div>
          )}

          <div className="total-price">
            <p>Total Price: ${calculateTotalPrice()}</p>
          </div>
        </div>

        <button
          className={`order ${isAnimating ? 'animate' : ''}`}
          onClick={handleOrder}
          disabled={isAnimating}
        >
          <span className="default">Complete Order</span>
          <span className="success">
            Order Placed
            <svg viewBox="0 0 12 10">
              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
            </svg>
          </span>
          <div className="box"></div>
          <div className="truck">
            <div className="back"></div>
            <div className="front">
              <div className="window"></div>
            </div>
            <div className="light top"></div>
            <div className="light bottom"></div>
          </div>
          <div className="lines"></div>
        </button>
      </section>

      <footer className="order-footer">
        <p>&copy; 2024 Glasses.AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default OrderPage;
