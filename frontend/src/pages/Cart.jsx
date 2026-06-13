import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Bookmark, 
  Tag, 
  Truck, 
  Sparkle, 
  RotateCcw, 
  Heart,
  ChevronRight,
  X
} from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, itemsCount, addToCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Save for Later state
  const [saveLaterItems, setSaveLaterItems] = useState([]);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountAmount, discountPercent }
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Recommendations state
  const [recommendations, setRecommendations] = useState([]);

  // Load Save for Later items
  useEffect(() => {
    const saved = localStorage.getItem('saveLaterItems');
    if (saved) {
      setSaveLaterItems(JSON.parse(saved));
    }
  }, []);

  // Fetch recommendations based on cart categories
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        let category = 'Electronics';
        if (cartItems.length > 0) {
          category = cartItems[0].category;
        }
        const { data } = await api.get(`/api/products?category=${encodeURIComponent(category)}`);
        // Filter out items already in cart
        const cartIds = cartItems.map(item => item.product);
        const filtered = data.filter(p => !cartIds.includes(p._id)).slice(0, 4);
        setRecommendations(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecommendations();
  }, [cartItems]);

  // Recalculate coupon discount if cart total changes
  useEffect(() => {
    if (appliedCoupon) {
      if (totalPrice < 50) { // e.g., if total falls below a minimum limit
        setAppliedCoupon(null);
        setCouponError('Cart total fell below the minimum purchase requirement for this coupon.');
        showToast('Coupon removed.', 'warning');
      } else {
        // Re-calculate flat or percent discount
        let discount = 0;
        if (appliedCoupon.discountType === 'Percentage') {
          discount = parseFloat(((totalPrice * appliedCoupon.discountValue) / 100).toFixed(2));
        } else {
          discount = Math.min(appliedCoupon.discountValue, totalPrice);
        }
        setAppliedCoupon({
          ...appliedCoupon,
          discountAmount: discount
        });
      }
    }
  }, [totalPrice]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (!user) {
      showToast('Please login to apply coupons.', 'info');
      return;
    }

    setCouponLoading(true);
    setCouponError('');
    try {
      const { data } = await api.post('/api/coupons/validate', {
        code: couponCode.trim(),
        cartTotal: totalPrice
      });
      setAppliedCoupon(data);
      showToast(`Coupon "${data.code}" applied successfully!`, 'success');
      setCouponCode('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Failed to apply coupon');
      showToast('Invalid coupon code.', 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  const handleSaveForLater = (item) => {
    // 1. Remove from cart
    removeFromCart(item.product);
    
    // 2. Add to Save for Later
    const updated = [...saveLaterItems, item];
    setSaveLaterItems(updated);
    localStorage.setItem('saveLaterItems', JSON.stringify(updated));
    showToast(`${item.name} saved for later.`, 'success');
  };

  const handleMoveToCart = (item) => {
    // 1. Remove from Save for Later
    const updated = saveLaterItems.filter((x) => x.product !== item.product);
    setSaveLaterItems(updated);
    localStorage.setItem('saveLaterItems', JSON.stringify(updated));

    // 2. Add back to cart
    addToCart({
      _id: item.product,
      name: item.name,
      images: [item.image],
      price: item.price,
      stockQuantity: item.stockQuantity || 15
    }, item.qty || 1);

    showToast(`${item.name} moved back to cart!`, 'success');
  };

  const handleRemoveFromLater = (productId, name) => {
    const updated = saveLaterItems.filter((x) => x.product !== productId);
    setSaveLaterItems(updated);
    localStorage.setItem('saveLaterItems', JSON.stringify(updated));
    showToast(`${name} removed from Save for Later shelf.`, 'success');
  };

  const handleCheckout = () => {
    if (user) {
      navigate('/checkout', {
        state: {
          appliedCoupon: appliedCoupon
        }
      });
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `http://localhost:5000${imagePath}`;
  };

  // Estimate delivery Tuesday next week
  const getDeliveryEstimation = () => {
    const today = new Date();
    const est = new Date();
    est.setDate(today.getDate() + 4);
    return est.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  if (cartItems.length === 0 && saveLaterItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center dark:bg-slate-900 transition-colors">
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200 dark:border-slate-700 text-slate-400 shadow-sm">
          <ShoppingBag size={28} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-slate-550 dark:text-slate-400 mb-8 max-w-sm mx-auto text-xs">
          Before you can check out, you must add some premium products to your shopping cart.
        </p>
        <Link
          to="/"
          className="bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-bold uppercase px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/10"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 dark:bg-slate-900 transition-colors text-slate-800 dark:text-slate-100 text-left">
      <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        Shopping Cart ({cartItems.length} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Items & Save for Later */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Cart Items List */}
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between border border-slate-200/80 dark:border-slate-750 gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-4 flex-grow">
                    {/* Product Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-850 flex-shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="max-h-full object-contain"
                      />
                    </div>

                    {/* Title and details */}
                    <div className="min-w-0">
                      <Link to={`/product/${item.product}`} className="hover:text-indigo-650 dark:hover:text-indigo-400 font-extrabold text-slate-800 dark:text-slate-100 text-base leading-snug line-clamp-1">
                        {item.name}
                      </Link>
                      <div className="text-xs font-semibold text-slate-450 dark:text-slate-500 mt-1">
                        ₹{item.price.toFixed(2)} each
                      </div>
                      
                      {/* Estimate item delivery */}
                      <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                        <Truck size={10} />
                        <span>Delivery by: {getDeliveryEstimation()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                    {/* Qty and increment/decrement controls */}
                    <div className="flex items-center bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product, item.qty - 1)}
                        className="p-2.5 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-slate-700 dark:text-slate-200 font-extrabold text-sm">{item.qty}</span>
                      <button
                        onClick={() => updateQuantity(item.product, item.qty + 1)}
                        className="p-2.5 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price total & Action Buttons */}
                    <div className="flex items-center space-x-4">
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-base min-w-[70px] text-right">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        {/* Save for later icon link */}
                        <button
                          onClick={() => handleSaveForLater(item)}
                          className="p-2 text-slate-400 hover:text-indigo-650 dark:text-slate-500 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50"
                          title="Save for Later"
                        >
                          <Bookmark size={14} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="p-2 text-slate-400 hover:text-red-500 dark:text-slate-500 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-750 text-center text-slate-450 text-xs shadow-sm">
              All items are saved for later. Click "Move to Cart" below to proceed.
            </div>
          )}

          {/* Save for Later Shelf */}
          {saveLaterItems.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-850 pt-8">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5">
                <Bookmark size={18} className="text-indigo-600 fill-indigo-100" />
                <span>Save for Later ({saveLaterItems.length} items)</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {saveLaterItems.map((item) => (
                  <div key={item.product} className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-750 rounded-2xl p-4 flex gap-4 shadow-sm relative group hover:border-indigo-300">
                    <button
                      onClick={() => handleRemoveFromLater(item.product, item.name)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>

                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-850 rounded-xl overflow-hidden flex-shrink-0 border p-1 border-slate-100">
                      <img src={getImageUrl(item.image)} alt="" className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-grow min-w-0 text-xs">
                      <h4 className="font-bold text-slate-800 dark:text-slate-150 truncate pr-4">{item.name}</h4>
                      <p className="text-slate-500 dark:text-slate-400 font-semibold mt-1">₹{item.price.toFixed(2)}</p>
                      
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="mt-3 bg-slate-150 hover:bg-slate-200 dark:bg-slate-750 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-250 font-bold uppercase tracking-wider text-[9px] px-3.5 py-1.5 rounded-lg transition-colors"
                      >
                        Move to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended products shelf */}
          {recommendations.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-850 pt-8">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-1.5">
                <Sparkle className="text-indigo-650" />
                <span>Recommended Additions</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recommendations.map(p => (
                  <div key={p._id} className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-750 rounded-2xl p-3 flex flex-col justify-between text-xs relative group shadow-sm">
                    <Link to={`/product/${p._id}`} className="w-full aspect-square flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-850 rounded-xl mb-2.5 p-2">
                      <img src={getImageUrl(p.images[0])} alt="" className="max-h-full object-contain" />
                    </Link>
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-150 truncate leading-snug">{p.name}</h4>
                      <p className="text-slate-800 dark:text-slate-200 font-black mt-1">₹{p.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(p, 1);
                        showToast(`${p.name} added to cart!`, 'success');
                      }}
                      className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold py-2 rounded-lg text-[9px] uppercase tracking-wider"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Order Summary & Coupon */}
        <div className="lg:col-span-1 sticky top-24 space-y-6">
          
          {/* Coupon input */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-750 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm flex items-center gap-1.5">
              <Tag size={16} className="text-indigo-650" />
              <span>Apply Coupon Discount</span>
            </h3>

            {user ? (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME50"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-slate-850 dark:text-slate-100 text-xs rounded-xl p-3 outline-none"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponCode.trim()}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow"
                >
                  Apply
                </button>
              </form>
            ) : (
              <p className="text-[11px] text-slate-450 dark:text-slate-500 leading-normal">Please login to access promotional coupons.</p>
            )}

            {couponError && (
              <p className="text-xs text-rose-600 font-semibold">{couponError}</p>
            )}

            {appliedCoupon && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 border border-emerald-150 dark:border-emerald-900/35 p-3 rounded-xl flex items-center justify-between text-xs font-semibold">
                <div className="space-y-0.5">
                  <p className="font-extrabold uppercase">Coupon Applied: {appliedCoupon.code}</p>
                  <p className="text-[10px] text-emerald-600">Saved: -₹{appliedCoupon.discountAmount?.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-red-500 hover:underline text-[10px]"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Cart totals */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-750 shadow-sm space-y-6">
            <h2 className="text-lg font-extrabold text-slate-850 dark:text-slate-100">Order Summary</h2>

            <div className="space-y-4 text-xs font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>Items Count</span>
                <span className="font-extrabold text-slate-700 dark:text-slate-200">{itemsCount}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="text-emerald-600 font-extrabold uppercase">FREE</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon discount ({appliedCoupon.code})</span>
                  <span>-₹{appliedCoupon.discountAmount?.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-slate-100 dark:border-slate-750 pt-4 flex justify-between items-center text-sm">
                <span className="text-slate-800 dark:text-slate-100 font-bold">Estimated Total</span>
                <span className="text-2xl font-black text-indigo-650 dark:text-indigo-400">
                  ₹{(totalPrice - (appliedCoupon?.discountAmount || 0)).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className={`w-full py-4 rounded-xl transition-all flex items-center justify-center space-x-1 shadow-lg font-bold text-xs uppercase tracking-wider ${
                cartItems.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-indigo-650 hover:bg-indigo-500 text-white shadow-indigo-600/15 hover:shadow-indigo-600/35 hover:-translate-y-0.5'
              }`}
            >
              <span>Proceed to Checkout</span>
              <ChevronRight size={14} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
