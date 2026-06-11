import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { CreditCard, Truck, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Shipping details state
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [country, setCountry] = useState(user?.address?.country || '');
  const [saveAddress, setSaveAddress] = useState(false);

  // Card simulation state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!street || !city || !postalCode || !country) {
      setError('Please fill out all address fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvc) {
      setError('Please fill out all payment fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // 1. Simulating payment intent call on backend
      const intentRes = await api.post('/api/payment/create-intent', {
        amount: Math.round(totalPrice * 100),
      });

      const { clientSecret } = intentRes.data;

      // 2. Simulate payment processing logic
      // In a real app, you would pass this client secret to Stripe.js elements
      await new Promise((resolve) => setTimeout(resolve, 1500)); // processing delay

      const mockPaymentResult = {
        id: `ch_mock_${Math.random().toString(36).substr(2, 9)}`,
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: user.email,
      };

      // 3. Save Address to User Profile if checked
      if (saveAddress) {
        await updateProfile({
          name: user.name,
          email: user.email,
          address: { street, city, postalCode, country },
        });
      }

      // 4. Create the order
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.image,
          product: item.product,
        })),
        shippingAddress: { street, city, postalCode, country },
        paymentMethod: 'Card Simulation',
        totalPrice,
        paymentResult: mockPaymentResult,
      };

      const { data } = await api.post('/api/orders', orderData);
      setOrderId(data._id);
      clearCart();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment simulation failed');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-slate-400 mb-4">Your cart is empty. Cannot checkout.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl transition-all"
        >
          Go Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Checkout Steps Header */}
      <div className="flex items-center justify-center space-x-4 mb-10">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}>1</div>
          <span className={`text-sm font-semibold ${step >= 1 ? 'text-slate-200' : 'text-slate-500'}`}>Shipping</span>
        </div>
        <div className="h-[1px] w-12 bg-slate-800"></div>
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}>2</div>
          <span className={`text-sm font-semibold ${step >= 2 ? 'text-slate-200' : 'text-slate-500'}`}>Payment</span>
        </div>
        <div className="h-[1px] w-12 bg-slate-800"></div>
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}>3</div>
          <span className={`text-sm font-semibold ${step === 3 ? 'text-slate-200' : 'text-slate-500'}`}>Complete</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 flex items-center space-x-2 max-w-xl mx-auto">
          <ShieldAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form Side */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="glass p-6 rounded-3xl border border-slate-800 space-y-6">
              <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2 mb-4">
                <Truck size={20} className="text-indigo-400" />
                <span>Shipping Address</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="123 Main St"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 rounded-xl p-3 outline-none text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 rounded-xl p-3 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="10001"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 rounded-xl p-3 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="USA"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 rounded-xl p-3 outline-none text-sm transition-all"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <label htmlFor="saveAddress" className="text-sm text-slate-400 select-none">
                    Save address to my profile
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/30"
              >
                Proceed to Payment
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="glass p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                  <CreditCard size={20} className="text-indigo-400" />
                  <span>Stripe Card Simulation</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Edit Address
                </button>
              </div>

              <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-4 text-xs space-y-2 text-slate-300">
                <p className="font-bold text-indigo-400">💳 Mock Details for Successful Sandbox Checkout:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Card Number: <span className="font-mono text-slate-100">4242 4242 4242 4242</span></li>
                  <li>Expiry: <span className="font-mono text-slate-100">12/29</span>, CVC: <span className="font-mono text-slate-100">123</span></li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 font-mono rounded-xl p-3 outline-none text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/29"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 font-mono rounded-xl p-3 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 font-mono rounded-xl p-3 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-slate-500 pt-2 justify-center">
                  <Lock size={12} />
                  <span>Payments encrypted securely via mock gateway API</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20"
              >
                <span>{loading ? 'Processing Mock Stripe Charge...' : `Pay $${totalPrice.toFixed(2)}`}</span>
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="glass p-8 rounded-3xl border border-slate-800 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Order Placed Successfully!</h2>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                  Thank you for shopping with ShopEZ. Your payment was validated, and your inventory items have been dispatched.
                </p>
                <p className="text-xs text-slate-500">
                  Order Reference: <span className="font-mono text-indigo-400 font-bold">{orderId}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <button
                  onClick={() => navigate('/my-orders')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/10"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-sm font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary Side */}
        {step !== 3 && (
          <div className="lg:col-span-1">
            <div className="glass p-5 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-100 text-base border-b border-slate-850 pb-3">
                Items Summary
              </h3>
              
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex justify-between items-center text-sm gap-2">
                    <span className="text-slate-400 line-clamp-1 flex-grow">
                      {item.name} <span className="text-xs font-bold text-indigo-400">x{item.qty}</span>
                    </span>
                    <span className="font-semibold text-slate-200 whitespace-nowrap">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-800/80 pt-4 space-y-2">
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>Shipping</span>
                  <span className="text-emerald-500 font-bold">FREE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-200">Total Price</span>
                  <span className="text-lg font-extrabold text-indigo-400">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
