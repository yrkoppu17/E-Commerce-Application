import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, itemsCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (user) {
      navigate('/checkout');
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

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800 text-slate-500">
          <ShoppingBag size={28} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          Before you can check out, you must add some products to your shopping cart.
        </p>
        <Link
          to="/"
          className="inline-flex bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-white mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="glass p-4 rounded-2xl flex items-center justify-between border border-slate-800/80 gap-4"
            >
              {/* Product Thumbnail */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-800">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title and details */}
              <div className="flex-grow min-w-0">
                <Link to={`/product/${item.product}`} className="hover:text-indigo-400 transition-colors font-bold text-slate-100 line-clamp-1">
                  {item.name}
                </Link>
                <div className="text-sm font-semibold text-slate-400 mt-1">
                  ${item.price.toFixed(2)} each
                </div>
              </div>

              {/* Qty and increment/decrement controls */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                <button
                  onClick={() => updateQuantity(item.product, item.qty - 1)}
                  className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <Minus size={12} />
                </button>
                <span className="px-3 text-slate-200 font-semibold text-sm">{item.qty}</span>
                <button
                  onClick={() => updateQuantity(item.product, item.qty + 1)}
                  className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Price total & Remove button */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                <span className="font-extrabold text-slate-100 min-w-[70px] text-right">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-3xl border border-slate-800 sticky top-24 space-y-6">
            <h2 className="text-xl font-bold text-slate-100">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Total Items</span>
                <span className="font-semibold text-slate-200">{itemsCount}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Shipping</span>
                <span className="text-emerald-500 font-bold">FREE</span>
              </div>

              <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center">
                <span className="text-slate-100 font-bold">Total Price</span>
                <span className="text-2xl font-extrabold text-indigo-400">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
