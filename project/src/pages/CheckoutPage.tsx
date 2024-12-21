import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaypal, FaCcVisa } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

type PaymentMethod = 'credit-card' | 'paypal';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, calculateTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');
  const [total, setTotal] = useState<number>(0);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const fetchedTotal = await calculateTotal();
        setTotal(fetchedTotal || 0);
      } catch (error) {
        console.error('Error fetching total:', error);
      }
    };

    fetchTotal();
  }, [cartItems, calculateTotal]);

  const handlePaymentCreation = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) throw new Error('Payment creation failed');

      return await response.json();
    } catch (error) {
      console.error('Error creating payment:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'paypal') {
      const data = await handlePaymentCreation('http://127.0.0.1:8000/payments/create/');
      if (data?.approval_url) {
        window.location.href = data.approval_url;
      } else {
        alert('Error creating PayPal payment');
      }
    } else if (paymentMethod === 'credit-card') {
      if (!stripe || !elements) {
        alert('Stripe has not loaded yet.');
        return;
      }

      const data = await handlePaymentCreation('http://127.0.0.1:8000/payments/create_visa/');
      if (data?.client_secret) {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          alert('Invalid card details.');
          return;
        }

        const result = await stripe.confirmCardPayment(data.client_secret, {
          payment_method: { card: cardElement },
        });

        if (result.error) {
          alert('Payment failed: ' + result.error.message);
        } else if (result.paymentIntent?.status === 'succeeded') {
          clearCart();
          navigate('/');
        }
      } else {
        alert('Error creating Visa payment');
      }
    }
  };

  const handleCancelPayment = () => {
    alert('Payment canceled.');
    navigate('/cart');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">Checkout</h2>

      {/* Payment Method Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
        <div className="space-y-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="credit-card"
              checked={paymentMethod === 'credit-card'}
              onChange={() => setPaymentMethod('credit-card')}
              className="mr-3"
            />
            <FaCcVisa className="h-6 w-6 mr-2" />
            <span>Credit Card</span>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={() => setPaymentMethod('paypal')}
              className="mr-3"
            />
            <FaPaypal className="h-6 w-6 mr-2" />
            <span>PayPal</span>
          </label>
        </div>
      </div>

      {/* Credit Card Form */}
      {paymentMethod === 'credit-card' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Details</label>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#32325d',
                    '::placeholder': { color: '#aab7c4' },
                  },
                },
              }}
            />
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-[#5A1A32] text-white px-6 py-3 rounded-lg hover:bg-[#5A1A32]/90"
          >
            Pay Now
          </button>
        </form>
      )}

      {/* PayPal Buttons */}
      {paymentMethod === 'paypal' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <button
            onClick={handleSubmit}
            className="w-full bg-[#0070BA] text-white px-6 py-3 rounded-lg hover:bg-[#005C99]"
          >
            Pay with PayPal
          </button>
          <button
            onClick={handleCancelPayment}
            className="mt-4 w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            Cancel Payment
          </button>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
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
      </div>
    </div>
  );
}
