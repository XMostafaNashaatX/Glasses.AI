import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CircleDollarSign } from 'lucide-react';
import { FaPaypal } from 'react-icons/fa'; // PayPal icon
import { FaCcVisa } from 'react-icons/fa'; // Visa icon
import { useCart } from '../context/CartContext';

type PaymentMethod = 'credit-card' | 'paypal';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, calculateTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');
  const [total, setTotal] = useState<number>(0);
  const [paypalApprovalUrl, setPaypalApprovalUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotal = async () => {
      const fetchedTotal = await calculateTotal();
      if (fetchedTotal !== null) {
        setTotal(fetchedTotal);
      }
    };

    fetchTotal();
  }, [cartItems, calculateTotal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'paypal') {
      const response = await fetch('http://127.0.0.1:8000/payments/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (data.approval_url) {
        window.location.href = data.approval_url;
      } else {
        alert('Error creating payment');
      }
    } else {
      navigate('/thank-you');
    }
  };

  const handlePaymentSuccess = async (paymentId: string, payerId: string) => {
    const response = await fetch(`http://127.0.0.1:8000/payments/execute/?paymentId=${paymentId}&PayerID=${payerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    });

    const data = await response.json();
    if (data.message === 'Payment successful') {
      clearCart();
      navigate('/thank-you');
    } else {
      alert('Payment failed');
    }
  };

  const handleCancelPayment = async () => {
    const response = await fetch('http://127.0.0.1:8000/payments/cancel/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    });

    const data = await response.json();
    if (data.message) {
      alert(data.message);
    } else {
      alert('Error canceling payment');
    }

    navigate('/cart');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">Checkout</h2>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
        <div className="space-y-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="credit-card"
              checked={paymentMethod === 'credit-card'}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="mr-3"
            />
            <FaCcVisa className="h-6 w-6 mr-2" /> {/* Visa Icon */}
            <span>Credit Card</span>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="mr-3"
            />
            <FaPaypal className="h-6 w-6 mr-2" /> {/* PayPal Icon */}
            <span>PayPal</span>
          </label>
        </div>
      </div>

      {paymentMethod === 'credit-card' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1A32]"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1A32]"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1A32]"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        </form>
      )}

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

      <button
        onClick={handleSubmit}
        className="w-full bg-[#5A1A32] text-white px-6 py-3 rounded-lg hover:bg-[#5A1A32]/90"
      >
        Complete Purchase
      </button>

      {paymentMethod === 'paypal' && (
        <button
          onClick={handleCancelPayment}
          className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg mt-4 hover:bg-gray-600"
        >
          Cancel Payment
        </button>
      )}
    </div>
  );
}
