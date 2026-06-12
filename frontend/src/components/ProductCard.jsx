import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import api from '../utils/api';

const ProductCard = ({ product, onWishlistUpdate }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Helper to format image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `http://localhost:5000${imagePath}`;
  };

  const isOutOfStock = product.stockQuantity <= 0;

  // Check if item in wishlist on mount
  useEffect(() => {
    const checkWishlist = async () => {
      if (user) {
        try {
          const { data } = await api.get('/api/users/wishlist');
          const exists = data.some((item) => item._id === product._id);
          setInWishlist(exists);
        } catch (err) {
          console.error(err);
        }
      }
    };
    checkWishlist();

    const handleWishlistChange = () => checkWishlist();
    window.addEventListener('wishlist-updated', handleWishlistChange);
    return () => window.removeEventListener('wishlist-updated', handleWishlistChange);
  }, [user, product._id]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in to wishlist products.', 'info');
      return;
    }

    setWishlistLoading(true);
    try {
      await api.post(`/api/users/wishlist/${product._id}`);
      const nextState = !inWishlist;
      setInWishlist(nextState);
      showToast(
        nextState ? `${product.name} added to wishlist!` : `${product.name} removed from wishlist.`,
        'success'
      );
      
      // Dispatch custom event to notify Navbar
      window.dispatchEvent(new Event('wishlist-updated'));
      if (onWishlistUpdate) onWishlistUpdate();
    } catch (err) {
      showToast(err.response?.data?.message || 'Wishlist operation failed', 'error');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <div className="bg-white dark:bg-slate-800 group rounded-3xl overflow-hidden flex flex-col h-full border border-slate-200/80 dark:border-slate-750 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 shadow-md hover:shadow-xl dark:shadow-slate-950/20 relative">
      
      {/* Discount Badge */}
      {product.discountPercent > 0 && (
        <span className="absolute top-4 left-4 z-10 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md">
          {product.discountPercent}% OFF
        </span>
      )}

      {/* Wishlist Heart Toggle */}
      <button
        onClick={handleWishlistToggle}
        disabled={wishlistLoading}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-md flex items-center justify-center text-slate-450 hover:text-pink-650 hover:scale-105 transition-all dark:text-slate-400"
        title="Toggle Wishlist"
      >
        <Heart
          size={16}
          className={`${inWishlist ? 'fill-pink-500 text-pink-500 scale-105' : 'text-slate-500 dark:text-slate-400'}`}
        />
      </button>

      {/* Image container */}
      <div className="relative overflow-hidden aspect-square bg-slate-50/50 dark:bg-slate-850 flex items-center justify-center border-b border-slate-100 dark:border-slate-750">
        <Link to={`/product/${product._id}`} className="w-full h-full flex items-center justify-center p-4">
          <img
            src={getImageUrl(product.images[0])}
            alt={product.name}
            className="h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-red-500/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold tracking-wider uppercase text-pink-650 dark:text-pink-400">
            {product.category}
          </span>
          {product.brand && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide">
              {product.brand}
            </span>
          )}
        </div>
        
        <Link to={`/product/${product._id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base line-clamp-1 mb-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1.5 mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.round(product.averageRating || 0)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200 dark:text-slate-700'
                }
              />
            ))}
          </div>
          <span className="text-[11px] text-slate-450 dark:text-slate-400 font-bold">
            {product.averageRating?.toFixed(1)} ({product.numReviews || 0})
          </span>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-4 flex-grow leading-relaxed">
          {product.description}
        </p>

        {/* Price & Add button */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline space-x-2">
            <span className="text-slate-800 dark:text-slate-100 font-extrabold text-lg">
              ${product.price.toFixed(2)}
            </span>
            {product.discountPercent > 0 && (
              <span className="text-slate-400 dark:text-slate-500 line-through text-xs font-semibold">
                ${product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
              isOutOfStock
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-650 hover:bg-indigo-500 text-white shadow-md shadow-indigo-650/15 hover:shadow-indigo-650/35 hover:-translate-y-0.5'
            }`}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
