import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { 
  Star, 
  ArrowLeft, 
  Plus, 
  Minus, 
  MessageSquare, 
  ShieldAlert, 
  Truck, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Image,
  Upload,
  Heart,
  HelpCircle,
  Vote,
  Sparkle
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  // Product data states
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Variant states
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [qty, setQty] = useState(1);

  // ZIP Delivery Check states
  const [zipCode, setZipCode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState('');

  // Bundle states
  const [bundleProduct, setBundleProduct] = useState(null);

  // Compare states
  const [compareList, setCompareList] = useState([]);

  // Image Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Review submission states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [uploadUrlInput, setUploadUrlInput] = useState('');
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Fetch product data
  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data.product);
      setReviews(data.reviews || []);
      
      // Initialize variant selectors
      const p = data.product;
      setCurrentPrice(p.price);
      setCurrentStock(p.stockQuantity);
      
      if (p.sizes?.length > 0) setSelectedSize(p.sizes[0]);
      if (p.colors?.length > 0) setSelectedColor(p.colors[0]);
      if (p.storage?.length > 0) setSelectedStorage(p.storage[0]);
      if (p.weight?.length > 0) setSelectedWeight(p.weight[0]);

      // Fetch related products
      const relRes = await api.get(`/api/products/${id}/related`);
      setRelatedProducts(relRes.data);
      if (relRes.data.length > 0) {
        setBundleProduct(relRes.data[0]);
        // Seed comparison with related products
        setCompareList([p, relRes.data[0], relRes.data[1]].filter(Boolean));
      }

      // Check if wishlisted
      if (user) {
        const wishRes = await api.get('/api/users/wishlist');
        const exists = (wishRes.data || []).some((item) => item && item._id === p._id);
        setIsWishlisted(exists);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load product details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [id]);

  // Recalculate price and stock based on variant selection
  useEffect(() => {
    if (!product || !product.variants || product.variants.length === 0) return;

    // Find variant matches
    const matched = product.variants.find((v) => {
      const sizeMatch = selectedSize ? v.size === selectedSize : true;
      const colorMatch = selectedColor ? v.color === selectedColor : true;
      const storageMatch = selectedStorage ? v.storage === selectedStorage : true;
      const weightMatch = selectedWeight ? v.weight === selectedWeight : true;
      return sizeMatch && colorMatch && storageMatch && weightMatch;
    });

    if (matched) {
      setCurrentPrice(matched.price || product.price);
      setCurrentStock(matched.stockQuantity);
    } else {
      // Fallback
      setCurrentPrice(product.price);
      setCurrentStock(product.stockQuantity);
    }
    setQty(1);
  }, [selectedSize, selectedColor, selectedStorage, selectedWeight, product]);

  const handleQtyChange = (val) => {
    setQty(Math.max(1, Math.min(val, currentStock)));
  };

  const handleAddToCart = () => {
    const customizedProduct = {
      ...product,
      price: currentPrice,
      stockQuantity: currentStock,
      // Record specifications
      selectedSpec: {
        size: selectedSize,
        color: selectedColor,
        storage: selectedStorage,
        weight: selectedWeight
      }
    };
    addToCart(customizedProduct, qty);
    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleAddBundleToCart = () => {
    // Add main product
    addToCart({
      ...product,
      price: currentPrice,
      stockQuantity: currentStock
    }, 1);

    // Add bundle product
    if (bundleProduct) {
      addToCart(bundleProduct, 1);
    }

    showToast('Bundle package added to cart!', 'success');
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      showToast('Please login to wishlist products.', 'info');
      return;
    }

    try {
      await api.post(`/api/users/wishlist/${product._id}`);
      const nextState = !isWishlisted;
      setIsWishlisted(nextState);
      showToast(
        nextState ? `${product.name} added to wishlist!` : `${product.name} removed from wishlist.`,
        'success'
      );
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (err) {
      showToast('Wishlist operation failed', 'error');
    }
  };

  const handleCheckDelivery = (e) => {
    e.preventDefault();
    if (!zipCode.trim()) return;

    // Simulate validation
    if (/^\d{5,6}$/.test(zipCode.trim())) {
      const dates = ['Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const pickDate = dates[zipCode.charCodeAt(0) % dates.length];
      setDeliveryResult(`Guaranteed delivery by next ${pickDate} (Standard shipping).`);
    } else {
      setDeliveryResult('Invalid ZIP Code. Please enter a 5 or 6 digit number.');
    }
  };

  const handleAddReviewImage = () => {
    if (uploadUrlInput.trim()) {
      setReviewImages([...reviewImages, uploadUrlInput.trim()]);
      setUploadUrlInput('');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return;
    setReviewSubmitLoading(true);
    setReviewError('');

    try {
      await api.post(`/api/products/${id}/reviews`, {
        rating,
        comment,
        images: reviewImages
      });
      
      setComment('');
      setRating(5);
      setReviewImages([]);
      showToast('Thank you! Review posted successfully.', 'success');
      fetchProductDetails();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
      showToast('Failed to post review.', 'error');
    } finally {
      setReviewSubmitLoading(false);
    }
  };

  const handleVoteHelpful = async (reviewId) => {
    if (!user) {
      showToast('Please login to vote on reviews.', 'info');
      return;
    }

    try {
      const { data } = await api.post(`/api/products/${id}/reviews/${reviewId}/vote`);
      // Update reviews local state
      setReviews(reviews.map((rev) => 
        rev._id === reviewId ? { ...rev, helpfulVotes: data.helpfulVotes } : rev
      ));
      showToast('Thank you for voting!', 'success');
    } catch (err) {
      showToast('Voted failed', 'error');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `http://localhost:5000${imagePath}`;
  };

  // Compute Review Star percentages
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse space-y-8 dark:bg-slate-900 transition-colors duration-300">
        <div className="bg-slate-200 dark:bg-slate-800 h-6 w-24 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-200 dark:bg-slate-800 rounded-3xl aspect-square"></div>
          <div className="space-y-6">
            <div className="bg-slate-200 dark:bg-slate-800 h-8 rounded w-3/4"></div>
            <div className="bg-slate-200 dark:bg-slate-800 h-6 rounded w-1/4"></div>
            <div className="bg-slate-200 dark:bg-slate-800 h-24 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center dark:bg-slate-900">
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">Product not found.</p>
        <Link to="/" className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:underline">
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = currentStock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 dark:bg-slate-900 transition-colors duration-300">
      
      {/* 1. Header Back Button */}
      <Link to="/" className="inline-flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-indigo-650 transition-colors mb-8">
        <ArrowLeft size={16} />
        <span className="text-xs font-bold uppercase tracking-wider">Back to Shop</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16 items-start">
        
        {/* Gallery Image Display */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl overflow-hidden aspect-square border border-slate-250/60 dark:border-slate-750 flex items-center justify-center shadow-md">
            <img
              src={getImageUrl(product.images[activeImageIndex])}
              alt={product.name}
              className="max-h-[360px] object-contain"
            />
          </div>
          
          {/* Thumbnails Row */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 justify-center">
              {product.images.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border p-1 bg-white dark:bg-slate-800 transition-all ${
                    i === activeImageIndex ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-250'
                  }`}
                >
                  <img src={getImageUrl(imgUrl)} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Specs Selection Info */}
        <div className="flex flex-col text-left">
          
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-pink-650 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/10 px-3 py-1.5 rounded-full border border-pink-100 dark:border-pink-950/20">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {product.brand}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 mt-4 leading-tight mb-3">
            {product.name}
          </h1>

          {/* Ratings Summary */}
          <div className="flex items-center space-x-2 mb-6 text-sm">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(product.averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200 dark:text-slate-700'
                  }
                />
              ))}
            </div>
            <span className="text-slate-800 dark:text-slate-200 font-extrabold">{product.averageRating?.toFixed(1)}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 dark:text-slate-450 font-semibold">{reviews.length} Reviews</span>
          </div>

          {/* Pricing */}
          <div className="border-t border-b border-slate-200/80 dark:border-slate-750 py-4 mb-6 flex items-baseline space-x-3">
            <span className="text-3xl font-black text-slate-800 dark:text-slate-100">
              ${currentPrice.toFixed(2)}
            </span>
            {product.discountPercent > 0 && (
              <>
                <span className="text-slate-400 line-through font-bold text-lg">
                  ${product.originalPrice?.toFixed(2)}
                </span>
                <span className="text-xs bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 font-extrabold uppercase px-2.5 py-1 rounded-full">
                  {product.discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Dynamic Variant Attributes Selection */}
          <div className="space-y-4 mb-8">
            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Select Size</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        selectedSize === s
                          ? 'bg-indigo-650 border-indigo-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-800 border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Select Color</span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        selectedColor === c
                          ? 'bg-indigo-650 border-indigo-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-800 border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage options */}
            {product.storage?.length > 0 && (
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Select Storage</span>
                <div className="flex flex-wrap gap-2">
                  {product.storage.map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStorage(st)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        selectedStorage === st
                          ? 'bg-indigo-650 border-indigo-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-800 border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Weight options */}
            {product.weight?.length > 0 && (
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Select Weight</span>
                <div className="flex flex-wrap gap-2">
                  {product.weight.map((w) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        selectedWeight === w
                          ? 'bg-indigo-650 border-indigo-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-800 border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Blocks */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-slate-450 font-bold uppercase tracking-wider">Availability:</span>
              <span className={`text-sm font-extrabold ${isOutOfStock ? 'text-rose-500' : 'text-emerald-600'}`}>
                {isOutOfStock ? 'Out of Stock' : `In Stock (${currentStock} items left!)`}
              </span>
            </div>

            {!isOutOfStock && (
              <div className="flex items-center space-x-4">
                <span className="text-xs text-slate-450 font-bold uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => handleQtyChange(qty - 1)}
                    className="p-3 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-4 text-slate-700 dark:text-slate-200 font-extrabold text-sm">{qty}</span>
                  <button
                    onClick={() => handleQtyChange(qty + 1)}
                    className="p-3 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-grow py-4 rounded-2xl font-bold tracking-wide transition-all shadow-lg ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-indigo-650 hover:bg-indigo-500 text-white shadow-indigo-650/15 hover:shadow-indigo-600/30'
                }`}
              >
                Add to Shopping Cart
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`w-full sm:w-auto p-4 rounded-2xl border font-bold flex items-center justify-center gap-1.5 transition-all bg-white dark:bg-slate-800 ${
                  isWishlisted 
                    ? 'border-pink-300 text-pink-650 hover:bg-pink-50/20' 
                    : 'border-slate-250 dark:border-slate-700 text-slate-650 dark:text-slate-350 hover:bg-slate-50'
                }`}
              >
                <Heart size={18} className={isWishlisted ? 'fill-pink-500 text-pink-500' : ''} />
                <span className="text-xs uppercase tracking-wider">{isWishlisted ? 'Saved' : 'Wishlist'}</span>
              </button>
            </div>
          </div>

          {/* 3. ZIP Code mock delivery estimation */}
          <div className="mt-8 border-t border-slate-200/80 dark:border-slate-850 pt-6">
            <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm flex items-center gap-1.5 mb-3">
              <Truck size={16} className="text-indigo-600" />
              <span>Delivery Estimation Check</span>
            </h4>
            <form onSubmit={handleCheckDelivery} className="flex gap-2 max-w-sm">
              <input
                type="text"
                maxLength="6"
                placeholder="Enter ZIP code (e.g. 10001)"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="flex-grow bg-white dark:bg-slate-850 border border-slate-250 dark:border-slate-700 focus:border-indigo-500 text-slate-800 dark:text-slate-100 text-xs rounded-xl p-3 outline-none"
              />
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow"
              >
                Check
              </button>
            </form>
            {deliveryResult && (
              <p className={`text-xs mt-3 font-semibold ${deliveryResult.includes('Guaranteed') ? 'text-emerald-600' : 'text-rose-500'}`}>
                {deliveryResult}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* 4. Frequently Bought Together bundles widget */}
      {bundleProduct && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-750 rounded-3xl p-6 md:p-8 mb-16 text-left shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100 mb-6 flex items-center gap-1.5">
            <TrendingUp size={18} className="text-pink-650" />
            <span>Frequently Bought Together</span>
          </h3>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-4 md:gap-6 flex-wrap">
              {/* Main Product */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-750 p-3.5 rounded-2xl w-60">
                <img src={getImageUrl(product.images[0])} alt="" className="w-12 h-12 object-contain" />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{product.name}</h4>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">${currentPrice.toFixed(2)}</p>
                </div>
              </div>

              <span className="text-slate-400 font-bold text-lg">+</span>

              {/* Bundle Product */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-750 p-3.5 rounded-2xl w-60">
                <img src={getImageUrl(bundleProduct.images[0])} alt="" className="w-12 h-12 object-contain" />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{bundleProduct.name}</h4>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">${bundleProduct.price.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="bg-slate-50 dark:bg-slate-850/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-750 flex flex-col md:flex-row items-center gap-6 z-10">
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Package Price</p>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
                  ${(currentPrice + bundleProduct.price).toFixed(2)}
                </p>
              </div>
              <button
                onClick={handleAddBundleToCart}
                className="bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-extrabold uppercase px-6 py-3.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 flex items-center gap-1.5"
              >
                <span>Add Bundle to Cart</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Product Compare Tray/Grid */}
      {compareList.length > 1 && (
        <div className="border-t border-slate-200 dark:border-slate-850 pt-12 mb-16 text-left">
          <h3 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 mb-6 flex items-center gap-1.5">
            <HelpCircle size={20} className="text-indigo-600" />
            <span>Compare with Similar Items</span>
          </h3>

          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-750 rounded-[28px] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-750 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[10px]">
                    <th className="p-4">Features</th>
                    {compareList.map((item) => (
                      <th key={item._id} className="p-4 font-extrabold text-slate-700 dark:text-slate-200 max-w-[200px] truncate">{item.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-650 dark:text-slate-350">
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-4 font-bold text-slate-500 dark:text-slate-400">Price</td>
                    {compareList.map((item) => (
                      <td key={item._id} className="p-4 font-extrabold text-slate-800 dark:text-slate-150">
                        ${item._id === product._id ? currentPrice.toFixed(2) : item.price.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-4 font-bold text-slate-500 dark:text-slate-400">Brand</td>
                    {compareList.map((item) => (
                      <td key={item._id} className="p-4 font-semibold">{item.brand || 'ShopEZ'}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-4 font-bold text-slate-500 dark:text-slate-400">Rating</td>
                    {compareList.map((item) => (
                      <td key={item._id} className="p-4 font-semibold text-amber-500">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span>{item.averageRating?.toFixed(1)} ({item.numReviews})</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-4 font-bold text-slate-500 dark:text-slate-400">Stock Availability</td>
                    {compareList.map((item) => {
                      const stock = item._id === product._id ? currentStock : item.stockQuantity;
                      return (
                        <td key={item._id} className={`p-4 font-bold ${stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. Advanced Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-slate-200 dark:border-slate-850 pt-12 text-left">
        
        {/* Rating Breakdown & Form */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 flex items-center space-x-2">
            <MessageSquare size={18} className="text-indigo-600" />
            <span>Customer Rating Stats</span>
          </h2>

          {/* Rating Breakdown Metrics */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-750 shadow-sm space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars] || 0;
              const percent = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={stars} className="flex items-center text-xs font-semibold gap-3">
                  <span className="w-14 text-slate-500 dark:text-slate-400">{stars} Stars</span>
                  <div className="flex-grow bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="w-8 text-right text-slate-400">{percent}%</span>
                </div>
              );
            })}
          </div>

          {/* Review form */}
          {user ? (
            <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-750 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Write a Verified Review</h3>
              
              {reviewError && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-950/50 text-red-655 p-3 rounded-lg text-xs flex items-center space-x-1.5 font-semibold">
                  <ShieldAlert size={14} />
                  <span>{reviewError}</span>
                </div>
              )}

              {/* Rating */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className="text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star size={22} className={num <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Comment</label>
                <textarea
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your detailed experience..."
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl p-3 outline-none text-xs"
                  required
                ></textarea>
              </div>

              {/* Review Images URL input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Attach Review Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste image URL here"
                    value={uploadUrlInput}
                    onChange={(e) => setUploadUrlInput(e.target.value)}
                    className="flex-grow bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-xl p-2.5 outline-none focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddReviewImage}
                    className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold px-3 rounded-xl border border-slate-250 dark:border-slate-700"
                  >
                    Add
                  </button>
                </div>

                {/* Added Review Images List */}
                {reviewImages.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {reviewImages.map((url, idx) => (
                      <div key={idx} className="relative w-12 h-12 rounded-lg border overflow-hidden">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setReviewImages(reviewImages.filter((_, i) => i !== idx))}
                          className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center text-[10px] font-bold"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={reviewSubmitLoading}
                className="w-full bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-bold uppercase py-3 rounded-xl transition-all shadow shadow-indigo-600/10"
              >
                {reviewSubmitLoading ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          ) : (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-750 text-center">
              <p className="text-slate-500 text-xs mb-4">Please log in to write a review for this product.</p>
              <Link
                to="/login"
                className="inline-block bg-slate-800 text-white font-extrabold text-xs uppercase px-4 py-2.5 rounded-xl shadow"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 mb-6">Customer Reviews ({reviews.length})</h2>

          {reviews.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-750 text-center text-slate-450 text-sm shadow-sm">
              No reviews for this product yet. Be the first to share your experience!
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-750 shadow-sm relative">
                  
                  {/* Verified purchase indicator badge */}
                  {rev.isVerified && (
                    <span className="absolute top-6 right-6 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <CheckCircle size={10} />
                      <span>Verified Purchase</span>
                    </span>
                  )}

                  <div className="flex items-center justify-between mb-3 pr-28">
                    <div>
                      <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm leading-snug">{rev.name}</h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Stars */}
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200 dark:text-slate-700'
                        }
                      />
                    ))}
                  </div>

                  <p className="text-slate-650 dark:text-slate-350 text-xs leading-relaxed mb-4">{rev.comment}</p>

                  {/* Review Image Attachments */}
                  {rev.images?.length > 0 && (
                    <div className="flex gap-2.5 mb-4">
                      {rev.images.map((url, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            // Open image in blank window
                            window.open(url, '_blank');
                          }}
                          className="w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-zoom-in bg-slate-50 shadow-sm transition-transform hover:scale-102"
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Helpful Voting count */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleVoteHelpful(rev._id)}
                      className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-350 border border-slate-250 dark:border-slate-700 text-[10px] font-extrabold uppercase py-1.5 px-3 rounded-full flex items-center gap-1 transition-colors"
                    >
                      <Vote size={12} />
                      <span>Helpful ({rev.helpfulVotes || 0})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 7. Related / Recommended Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-850 pt-16 mt-16 text-left">
          <h3 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 mb-6 flex items-center gap-1.5">
            <Sparkle className="text-indigo-600 dark:text-indigo-400 fill-indigo-650" />
            <span>Recommended Products For You</span>
          </h3>
          <div className="flex space-x-6 overflow-x-auto no-scrollbar py-3 scroll-smooth">
            {relatedProducts.map((prod) => (
              <div key={prod._id} className="w-[260px] flex-shrink-0">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
