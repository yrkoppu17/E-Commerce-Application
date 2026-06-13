import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Heart, ShoppingCart, Trash2, ArrowLeft, ArrowRight, Loader2, Star } from 'lucide-react';
import api from '../utils/api';

const Wishlist = () => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/api/users/wishlist');
      setWishlistItems(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch wishlist items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (id, name) => {
    try {
      await api.post(`/api/users/wishlist/${id}`);
      setWishlistItems(wishlistItems.filter((item) => item._id !== id));
      showToast(`${name} removed from wishlist.`, 'success');
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (err) {
      showToast('Failed to remove item', 'error');
    }
  };

  const handleMoveToCart = async (product) => {
    try {
      // 1. Add to cart
      addToCart(product, 1);
      // 2. Remove from wishlist
      await api.post(`/api/users/wishlist/${product._id}`);
      setWishlistItems(wishlistItems.filter((item) => item._id !== product._id));
      showToast(`${product.name} moved to shopping cart!`, 'success');
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (err) {
      showToast('Failed to move item to cart', 'error');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center space-x-2 dark:bg-slate-900 transition-colors">
        <Loader2 size={24} className="animate-spin text-indigo-650" />
        <span className="text-slate-500 font-bold dark:text-slate-400">Loading your wishlist...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 dark:bg-slate-900 transition-colors">
      
      {/* Breadcrumb back */}
      <Link to="/" className="inline-flex items-center space-x-2 text-slate-500 hover:text-indigo-650 transition-colors mb-8 text-left">
        <ArrowLeft size={16} />
        <span className="text-xs font-bold uppercase tracking-wider">Continue Shopping</span>
      </Link>

      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-2">
          <Heart className="fill-pink-500 text-pink-500 w-8 h-8" />
          <span>My Saved Wishlist</span>
        </h1>
        <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-250/50 dark:border-slate-700">
          {wishlistItems.length} Products
        </span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-750 p-8 space-y-5 max-w-lg mx-auto shadow-sm">
          <Heart className="mx-auto text-slate-300 dark:text-slate-700 w-16 h-16 stroke-1 animate-pulse" />
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Your wishlist is empty</h3>
            <p className="text-xs text-slate-450 dark:text-slate-500 max-w-xs mx-auto leading-relaxed">Save items you like here to track pricing, stock updates, and checkout later.</p>
          </div>
          <Link
            to="/"
            className="bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-extrabold uppercase px-6 py-3.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 inline-flex items-center gap-1.5"
          >
            <span>Explore Products</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-left">
          {wishlistItems.map((item) => {
            const isOutOfStock = item.stockQuantity <= 0;
            return (
              <div key={item._id} className="bg-white dark:bg-slate-800 group rounded-3xl overflow-hidden flex flex-col h-full border border-slate-200/85 dark:border-slate-750 shadow-md hover:shadow-lg transition-all relative">
                
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(item._id, item.name)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/95 dark:bg-slate-900/90 shadow-md flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>

                {/* Product Image */}
                <div className="relative overflow-hidden aspect-square bg-slate-50/50 dark:bg-slate-850 flex items-center justify-center border-b border-slate-100 dark:border-slate-750 p-4">
                  <Link to={`/product/${item._id}`} className="w-full h-full flex items-center justify-center">
                    <img
                      src={getImageUrl(item.images[0])}
                      alt={item.name}
                      className="h-full object-contain group-hover:scale-102 transition-transform duration-500"
                    />
                  </Link>
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                      <span className="bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-pink-650 dark:text-pink-400 mb-1">
                    {item.category}
                  </span>
                  
                  <Link to={`/product/${item._id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm line-clamp-1 mb-1 leading-snug">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="flex items-center space-x-1.5 mb-3">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={i < Math.round(item.averageRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-450 font-semibold">({item.numReviews})</span>
                  </div>

                  <p className="text-slate-800 dark:text-slate-150 font-extrabold text-base mb-5 mt-auto">
                    ₹{item.price.toFixed(2)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 border-t border-slate-50 dark:border-slate-750 pt-4 mt-auto">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={isOutOfStock}
                      className={`flex-grow py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
                        isOutOfStock
                          ? 'bg-slate-100 dark:bg-slate-755 text-slate-400 cursor-not-allowed'
                          : 'bg-indigo-650 hover:bg-indigo-500 text-white shadow shadow-indigo-600/10'
                      }`}
                    >
                      <ShoppingCart size={12} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Wishlist;
