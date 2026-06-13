import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { 
  CreditCard, 
  Truck, 
  Lock, 
  CheckCircle, 
  ShieldAlert, 
  MapPin, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Tag,
  Wallet,
  Smartphone,
  Info,
  Loader2
} from 'lucide-react';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  // Load applied coupon from Cart state if passed
  const initialCoupon = location.state?.appliedCoupon || null;

  // Checkout Steps
  // Step 1: Address Select/Create
  // Step 2: Order Review & Coupon Confirmation
  // Step 3: Payment Simulation Panel
  // Step 4: Success Confirmation Details
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(initialCoupon);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'USA'
  });

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState('CreditCard'); // CreditCard, UPI, COD, Wallet
  
  // Credit card details
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UPI simulator state
  const [upiId, setUpiId] = useState('');

  // Wallet simulation state
  const [walletBalance, setWalletBalance] = useState(550.00);

  // Fetch addresses on load
  const fetchUserAddresses = async () => {
    try {
      const { data } = await api.get('/api/users/profile');
      setAddresses(data.addresses || []);
      if (data.addresses?.length > 0) {
        setSelectedAddressId(data.addresses[0]._id);
      } else {
        setShowNewAddressForm(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }
    fetchUserAddresses();
  }, [user]);

  // Handle saving new address
  const handleAddNewAddressSubmit = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.postalCode) {
      showToast('Please fill out all address fields.', 'warning');
      return;
    }

    try {
      const { data } = await api.post('/api/users/addresses', newAddress);
      setAddresses(data);
      // Select the last added address
      const added = data[data.length - 1];
      if (added) {
        setSelectedAddressId(added._id);
      }
      setShowNewAddressForm(false);
      showToast('Address added successfully!', 'success');
      setNewAddress({
        label: 'Home',
        name: '',
        street: '',
        city: '',
        postalCode: '',
        country: 'USA'
      });
    } catch (err) {
      showToast('Failed to add address', 'error');
    }
  };

  // Coupon code checks
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponError('');
    try {
      const { data } = await api.post('/api/coupons/validate', {
        code: couponCodeInput.trim(),
        cartTotal: totalPrice
      });
      setAppliedCoupon(data);
      showToast(`Coupon "${data.code}" applied!`, 'success');
      setCouponCodeInput('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    }
  };

  // Final Order placement
  const handlePlaceOrder = async () => {
    // Check address
    const selectedAddress = addresses.find(a => a._id === selectedAddressId);
    if (!selectedAddress) {
      showToast('Please select a shipping address.', 'warning');
      setStep(1);
      return;
    }

    // Check payment validation
    if (paymentMethod === 'CreditCard') {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        showToast('Please fill out card details.', 'warning');
        return;
      }
    } else if (paymentMethod === 'UPI') {
      if (!upiId) {
        showToast('Please enter your UPI ID.', 'warning');
        return;
      }
    } else if (paymentMethod === 'Wallet') {
      const finalPrice = totalPrice - (appliedCoupon?.discountAmount || 0);
      if (walletBalance < finalPrice) {
        showToast('Insufficient wallet balance.', 'error');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      // Simulate payment processing delays
      await new Promise(resolve => setTimeout(resolve, 2000));

      const finalPrice = parseFloat((totalPrice - (appliedCoupon?.discountAmount || 0)).toFixed(2));

      // Mock transaction details
      const mockResult = {
        id: `tx_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: user.email
      };

      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.image,
          product: item.product
        })),
        shippingAddress: {
          street: selectedAddress.street,
          city: selectedAddress.city,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country
        },
        paymentMethod: paymentMethod === 'CreditCard' ? 'Card Simulation' : paymentMethod,
        totalPrice: finalPrice,
        paymentResult: mockResult,
        couponApplied: appliedCoupon ? {
          code: appliedCoupon.code,
          discountAmount: appliedCoupon.discountAmount
        } : undefined
      };

      const { data } = await api.post('/api/orders', orderPayload);
      setOrderId(data._id);
      
      // Deduct wallet balance if wallet used
      if (paymentMethod === 'Wallet') {
        setWalletBalance(prev => prev - finalPrice);
      }

      // Success routines
      clearCart();
      showToast('Order placed successfully!', 'success');
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Order submission failed.');
      showToast('Failed to place order.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `http://localhost:5000${imagePath}`;
  };

  const finalOrderPrice = parseFloat((totalPrice - (appliedCoupon?.discountAmount || 0)).toFixed(2));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 dark:bg-slate-900 transition-colors text-slate-800 dark:text-slate-100 text-left">
      
      {/* 1. Checkout Steps header timeline */}
      <div className="flex flex-wrap items-center justify-center space-x-4 mb-10 text-xs font-semibold">
        <button
          onClick={() => step > 1 && step < 4 && setStep(1)}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 1 ? 'bg-indigo-650 text-white' : 'bg-slate-200 text-slate-500'
          }`}>1</div>
          <span className={`text-xs uppercase tracking-wider font-bold ${step >= 1 ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-400'}`}>Address</span>
        </button>
        <div className="h-[1.5px] w-12 bg-slate-200 dark:bg-slate-750"></div>
        
        <button
          onClick={() => step > 2 && step < 4 && setStep(2)}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 2 ? 'bg-indigo-650 text-white' : 'bg-slate-200 text-slate-500'
          }`}>2</div>
          <span className={`text-xs uppercase tracking-wider font-bold ${step >= 2 ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-400'}`}>Review</span>
        </button>
        <div className="h-[1.5px] w-12 bg-slate-200 dark:bg-slate-750"></div>

        <button
          onClick={() => step > 3 && step < 4 && setStep(3)}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 3 ? 'bg-indigo-650 text-white' : 'bg-slate-200 text-slate-500'
          }`}>3</div>
          <span className={`text-xs uppercase tracking-wider font-bold ${step >= 3 ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-400'}`}>Payment</span>
        </button>
        <div className="h-[1.5px] w-12 bg-slate-200 dark:bg-slate-750"></div>

        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step === 4 ? 'bg-indigo-650 text-white' : 'bg-slate-200 text-slate-500'
          }`}>4</div>
          <span className={`text-xs uppercase tracking-wider font-bold ${step === 4 ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-400'}`}>Complete</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-150 dark:border-red-900/35 text-red-655 p-4 rounded-2xl text-xs mb-6 flex items-center space-x-2 max-w-xl mx-auto font-semibold">
          <ShieldAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Interactive form fields */}
        <div className="lg:col-span-2">
          
          {/* STEP 1: Address selection or new addresses inputs */}
          {step === 1 && (
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[32px] border border-slate-200/80 dark:border-slate-750 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-750 pb-3">
                <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-2">
                  <MapPin size={20} className="text-indigo-650" />
                  <span>Choose Shipping Address</span>
                </h2>
                <button
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:underline"
                >
                  {showNewAddressForm ? 'Select Saved Address' : '+ Add Address'}
                </button>
              </div>

              {showNewAddressForm ? (
                /* Inline Add Address Form */
                <form onSubmit={handleAddNewAddressSubmit} className="space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">Label</label>
                      <select
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl p-3 outline-none"
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">Contact Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl p-3 outline-none focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 123 Main St"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl p-3 outline-none focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">City</label>
                      <input
                        type="text"
                        required
                        placeholder="New York"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl p-3 outline-none focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">ZIP / Postal Code</label>
                      <input
                        type="text"
                        required
                        placeholder="10001"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl p-3 outline-none focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md mt-4"
                  >
                    Save Address details
                  </button>
                </form>
              ) : (
                /* Select Saved Address Grid */
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <p className="text-slate-400 text-xs py-4 text-center">No addresses saved. Click "+ Add Address" to configure shipping details.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr._id;
                        return (
                          <button
                            key={addr._id}
                            onClick={() => setSelectedAddressId(addr._id)}
                            className={`w-full text-left p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                              isSelected
                                ? 'bg-indigo-50/20 border-indigo-600 shadow-md ring-2 ring-indigo-500/10'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                            }`}
                          >
                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-750 dark:text-slate-200 font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded w-fit mb-3">
                              {addr.label}
                            </span>
                            <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm leading-snug">{addr.name}</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mt-1">{addr.street}, {addr.city}</p>
                            <p className="text-slate-400 text-[11px] mt-0.5">{addr.postalCode}, {addr.country}</p>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (!selectedAddressId) {
                        showToast('Please configure/select a shipping destination.', 'warning');
                        return;
                      }
                      setStep(2);
                    }}
                    className="w-full bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-bold uppercase py-4 rounded-xl transition-all shadow-md shadow-indigo-600/10 mt-6 flex items-center justify-center gap-1"
                  >
                    <span>Proceed to Order Review</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Order Summary & Coupon verification */}
          {step === 2 && (
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[32px] border border-slate-200/80 dark:border-slate-750 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-750 pb-3">
                <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-indigo-650" />
                  <span>Review Ordered Items</span>
                </h2>
                <button onClick={() => setStep(1)} className="text-xs text-indigo-660 font-bold hover:underline">Edit Shipping</button>
              </div>

              {/* Items Detail */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex gap-4 items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={getImageUrl(item.image)} alt="" className="w-12 h-12 object-contain bg-slate-50 border p-1 rounded-xl" />
                      <div>
                        <h4 className="font-extrabold text-slate-850 dark:text-slate-200 truncate max-w-sm">{item.name}</h4>
                        <p className="text-slate-450 font-bold mt-0.5">Qty: {item.qty} &bull; ₹{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon inputs directly inline */}
              <div className="border-t border-slate-100 dark:border-slate-750 pt-6 space-y-3">
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm flex items-center gap-1">
                  <Tag size={14} className="text-indigo-650" />
                  <span>Promotional Coupon Code</span>
                </h3>
                
                <form onSubmit={handleApplyCoupon} className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    placeholder="Enter Coupon code (e.g. WELCOME50)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="flex-grow bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-slate-800 dark:text-slate-100 text-xs rounded-xl p-3 outline-none"
                  />
                  <button type="submit" className="bg-slate-800 text-white font-bold text-xs px-4 rounded-xl">Apply</button>
                </form>

                {couponError && <p className="text-xs text-rose-500 font-bold">{couponError}</p>}
                
                {appliedCoupon && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 border border-emerald-150 p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold w-fit">
                    <span>Applied: {appliedCoupon.code} (-₹{appliedCoupon.discountAmount?.toFixed(2)})</span>
                    <button type="button" onClick={() => setAppliedCoupon(null)} className="text-red-500 ml-4 font-bold">Remove</button>
                  </div>
                )}
              </div>

              {/* Navigation button */}
              <div className="flex gap-3 mt-8 border-t border-slate-100 dark:border-slate-750 pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-bold uppercase py-3.5 px-5 rounded-xl flex items-center gap-1"
                >
                  <ChevronLeft size={14} />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-grow bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-bold uppercase py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1"
                >
                  <span>Proceed to Payment Simulation</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Simulation Panel */}
          {step === 3 && (
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[32px] border border-slate-200/80 dark:border-slate-750 shadow-sm space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-750 pb-3">
                <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-2">
                  <Lock size={20} className="text-indigo-650" />
                  <span>Gateway Payment Simulator</span>
                </h2>
                <button onClick={() => setStep(2)} className="text-xs text-indigo-650 font-bold hover:underline">Edit Order</button>
              </div>

              {/* Payment Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { id: 'CreditCard', label: 'Credit Card', icon: CreditCard },
                  { id: 'UPI', label: 'UPI QR', icon: Smartphone },
                  { id: 'Wallet', label: 'Shop Wallet', icon: Wallet },
                  { id: 'COD', label: 'Cash On Delivery', icon: Truck }
                ].map((method) => {
                  const IconComponent = method.icon;
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4.5 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center text-xs font-bold transition-all focus:outline-none ${
                        isSelected
                          ? 'bg-indigo-50/20 border-indigo-600 text-indigo-650 dark:text-indigo-400 shadow shadow-indigo-650/10'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-350'
                      }`}
                    >
                      <IconComponent size={20} />
                      <span className="text-[10px] tracking-wide uppercase leading-none">{method.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Method Panel Render */}
              <div className="bg-slate-50 dark:bg-slate-850/50 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-750 text-xs font-semibold">
                
                {/* METHOD A: Credit Card with visual CC preview card */}
                {paymentMethod === 'CreditCard' && (
                  <div className="space-y-6">
                    {/* Visual Preview Credit Card */}
                    <div className="w-full max-w-[320px] h-[190px] rounded-2xl bg-gradient-to-br from-indigo-650 via-purple-700 to-pink-650 p-6 text-white flex flex-col justify-between shadow-2xl mx-auto tracking-widest relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold uppercase italic text-sm">ShopEZ Premium</span>
                        <CreditCard size={24} />
                      </div>
                      
                      <div className="text-lg font-mono font-bold leading-normal text-center select-all py-1">
                        {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• 4242'}
                      </div>

                      <div className="flex justify-between items-center font-mono text-[10px] uppercase">
                        <div>
                          <p className="text-[8px] opacity-75">Card Holder</p>
                          <p className="font-bold truncate max-w-[150px]">{cardName || 'YOUR FULL NAME'}</p>
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <p className="text-[8px] opacity-75">Expires</p>
                            <p className="font-bold">{cardExpiry || 'MM/YY'}</p>
                          </div>
                          <div>
                            <p className="text-[8px] opacity-75">CVV</p>
                            <p className="font-bold">{cardCvv || '•••'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50/70 border border-indigo-150 text-indigo-700 p-3.5 rounded-xl space-y-1">
                      <p className="font-bold uppercase tracking-wider text-[10px]">💳 Sandbox Validations Info:</p>
                      <p className="leading-relaxed text-[11px]">Type mock credentials to complete payment (e.g. Card: 4242 4242 4242 4242, Expiry: 12/29, CVV: 123).</p>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4 text-left">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 focus:border-indigo-500 text-slate-800 dark:text-slate-100 rounded-xl p-3 outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">Card Number</label>
                        <input
                          type="text"
                          required
                          maxLength="16"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="4242424242424242"
                          className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 focus:border-indigo-500 text-slate-800 dark:text-slate-100 rounded-xl p-3 outline-none text-xs font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">Expiry MM/YY</label>
                          <input
                            type="text"
                            required
                            maxLength="5"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/29"
                            className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 focus:border-indigo-500 text-slate-800 dark:text-slate-100 rounded-xl p-3 outline-none text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">CVV / CVC</label>
                          <input
                            type="password"
                            required
                            maxLength="3"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="123"
                            className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 focus:border-indigo-500 text-slate-800 dark:text-slate-100 rounded-xl p-3 outline-none text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* METHOD B: UPI Simulator Panel */}
                {paymentMethod === 'UPI' && (
                  <div className="space-y-6 text-center">
                    <p className="text-xs text-slate-550 dark:text-slate-400 font-semibold mb-2">Scan the simulated QR Code or enter your UPI Address to finalize.</p>
                    
                    {/* Simulated QR block */}
                    <div className="bg-white border p-4 rounded-2xl w-44 h-44 flex flex-col items-center justify-center mx-auto shadow-inner relative group border-slate-250">
                      <div className="grid grid-cols-4 gap-1.5 w-32 h-32 opacity-75">
                        {[...Array(16)].map((_, i) => (
                          <div key={i} className={`rounded ${i % 3 === 0 ? 'bg-slate-900' : 'bg-slate-100'}`} />
                        ))}
                      </div>
                      <span className="absolute text-[10px] bg-slate-900 text-amber-300 font-bold uppercase px-2 py-0.5 rounded shadow top-18">ShopEZ Scan</span>
                    </div>

                    <div className="max-w-xs mx-auto text-left space-y-3">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1">Enter UPI App ID Address</label>
                      <input
                        type="text"
                        placeholder="e.g. john@okaxis"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 focus:border-indigo-500 text-slate-800 dark:text-slate-100 rounded-xl p-3 outline-none text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* METHOD C: Wallet Balance simulation */}
                {paymentMethod === 'Wallet' && (
                  <div className="space-y-4 text-left">
                    <h4 className="font-extrabold text-sm text-indigo-650 flex items-center gap-1">
                      <Wallet size={16} />
                      <span>ShopEZ Wallet Profile</span>
                    </h4>
                    <div className="bg-white dark:bg-slate-800 border p-5 rounded-2xl border-slate-250 dark:border-slate-700 flex justify-between items-center shadow-sm">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Available Wallet Balance</p>
                        <p className="text-xl font-extrabold text-slate-850 dark:text-slate-100">₹{walletBalance.toFixed(2)}</p>
                      </div>
                      {walletBalance < finalOrderPrice && (
                        <span className="text-[10px] bg-red-50 text-red-550 border border-red-150 px-2 py-0.5 rounded font-extrabold uppercase">
                          Insufficient Funds
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-450 flex items-center gap-1">
                      <Info size={11} />
                      <span>Your mock balance gets updated upon successful checkout.</span>
                    </p>
                  </div>
                )}

                {/* METHOD D: Cash on Delivery checkbox */}
                {paymentMethod === 'COD' && (
                  <div className="space-y-4 text-left flex items-start gap-3 bg-white dark:bg-slate-800 border p-5 rounded-2xl border-slate-250 dark:border-slate-700 shadow-sm">
                    <Truck className="text-indigo-600 flex-shrink-0 w-8 h-8" />
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-150 text-sm">Cash on Delivery Confirmation</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-1">Payment will be collected at your door upon shipping delivery verification. Please keep exact change ready.</p>
                    </div>
                  </div>
                )}

              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-8 border-t border-slate-100 dark:border-slate-750 pt-6">
                <button
                  onClick={() => setStep(2)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-bold uppercase py-3.5 px-5 rounded-xl flex items-center gap-1"
                >
                  <ChevronLeft size={14} />
                  <span>Back</span>
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || (paymentMethod === 'Wallet' && walletBalance < finalOrderPrice)}
                  className={`flex-grow py-3.5 rounded-xl transition-all shadow-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                    loading || (paymentMethod === 'Wallet' && walletBalance < finalOrderPrice)
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-indigo-650 hover:bg-indigo-500 text-white shadow-indigo-600/15'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Verifying simulation credentials...</span>
                    </>
                  ) : (
                    <span>Confirm & Pay ₹{finalOrderPrice.toFixed(2)}</span>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* STEP 4: Success confirmation screen */}
          {step === 4 && (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[36px] border border-slate-200 dark:border-slate-750 shadow-md text-center space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle size={32} />
              </div>
              <div className="space-y-2.5">
                <h2 className="text-2xl font-black text-slate-850 dark:text-slate-100">Order Dispatched Successfully!</h2>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed max-w-sm mx-auto">
                  Thank you for shopping with ShopEZ. Your simulated transaction has completed, and inventory stocks have been updated.
                </p>
                <div className="bg-slate-50 dark:bg-slate-850/50 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-1.5 mt-4">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Transaction Invoice</p>
                  <p className="text-xs text-slate-750 dark:text-slate-200">Order ID: <span className="font-mono text-indigo-650 dark:text-indigo-400 font-bold">{orderId}</span></p>
                  <p className="text-xs text-slate-750 dark:text-slate-200">Shipping Mode: <span className="font-bold text-slate-800 dark:text-slate-100">ShopEZ Standard Express (FREE)</span></p>
                  <p className="text-xs text-slate-750 dark:text-slate-200">Amount Paid: <span className="font-extrabold text-slate-800 dark:text-slate-100">₹{finalOrderPrice.toFixed(2)}</span></p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <button
                  onClick={() => navigate('/profile?tab=orders')}
                  className="bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-extrabold uppercase py-3.5 px-6 rounded-xl transition-all shadow-md shadow-indigo-650/15"
                >
                  Track Order Status
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-slate-100 border border-slate-250 hover:bg-slate-200 text-slate-650 text-xs font-extrabold uppercase py-3.5 px-6 rounded-xl transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right order summary column (Not shown in Success stage) */}
        {step !== 4 && (
          <div className="lg:col-span-1 sticky top-24 space-y-4">
            
            {/* Short review summary */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-750 shadow-sm space-y-4 text-xs font-semibold">
              <h3 className="font-bold text-slate-800 dark:text-slate-150 text-sm border-b border-slate-100 dark:border-slate-750 pb-3">
                Items Checklist
              </h3>
              
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex justify-between items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium line-clamp-1 flex-grow">
                      {item.name} <span className="text-xs font-bold text-indigo-650">x{item.qty}</span>
                    </span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-750 pt-4 space-y-2.5">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Shipping delivery</span>
                  <span className="text-emerald-600 font-bold uppercase">FREE</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 text-[11px]">
                    <span>Coupon: {appliedCoupon.code}</span>
                    <span>-₹{appliedCoupon.discountAmount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm border-t border-slate-100 dark:border-slate-750 pt-3">
                  <span className="text-slate-800 dark:text-slate-100 font-bold">Grand Total</span>
                  <span className="text-xl font-black text-indigo-650 dark:text-indigo-400">
                    ₹{finalOrderPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Security disclaimer */}
            <div className="bg-slate-50 dark:bg-slate-850/50 p-4 border border-slate-200 dark:border-slate-750 rounded-2xl flex items-start gap-2.5 text-[10px] leading-relaxed text-slate-450 font-medium">
              <Lock size={14} className="text-slate-400 flex-shrink-0" />
              <span>Checkout security verified. Simulated transaction triggers automated database operations instantly.</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Checkout;
