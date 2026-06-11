import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Star, ArrowLeft, Plus, Minus, MessageSquare, ShieldAlert } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data.product);
      setReviews(data.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleQtyChange = (val) => {
    setQty(Math.max(1, Math.min(val, product.stockQuantity)));
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return;
    setReviewSubmitLoading(true);
    setReviewError('');
    setReviewSuccess(false);

    try {
      await api.post(`/api/products/${id}/reviews`, { rating, comment });
      setComment('');
      setRating(5);
      setReviewSuccess(true);
      // Re-fetch product data to show new review and updated average rating
      fetchProductDetails();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitLoading(false);
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
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-8">
        <div className="bg-slate-800 h-6 w-24 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800 rounded-2xl aspect-square"></div>
          <div className="space-y-6">
            <div className="bg-slate-800 h-8 rounded w-3/4"></div>
            <div className="bg-slate-800 h-6 rounded w-1/4"></div>
            <div className="bg-slate-800 h-24 rounded"></div>
            <div className="bg-slate-800 h-10 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-400 text-lg mb-4">Product not found.</p>
        <Link to="/" className="inline-flex items-center space-x-2 text-indigo-400 hover:underline">
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-indigo-400 transition-colors mb-8">
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Back to Shop</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Product Image */}
        <div className="glass rounded-3xl overflow-hidden aspect-square bg-slate-900 flex items-center justify-center border border-slate-800">
          <img
            src={getImageUrl(product.images[0])}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details Info */}
        <div className="flex flex-col justify-center">
          <span className="text-sm font-bold tracking-wider uppercase text-pink-500 mb-2">
            {product.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.round(product.averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-700'
                  }
                />
              ))}
            </div>
            <span className="text-sm text-slate-200 font-semibold">{product.averageRating.toFixed(1)}</span>
            <span className="text-slate-500 text-sm">|</span>
            <span className="text-sm text-slate-400">{product.numReviews} Reviews</span>
          </div>

          <div className="border-t border-b border-slate-800/80 py-4 mb-6">
            <span className="text-3xl font-extrabold text-white">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Stock & Cart actions */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400 font-medium">Availability:</span>
              <span className={`text-sm font-bold ${isOutOfStock ? 'text-red-500' : 'text-emerald-500'}`}>
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stockQuantity} available)`}
              </span>
            </div>

            {!isOutOfStock && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-400 font-medium">Quantity:</span>
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQtyChange(qty - 1)}
                    className="p-3 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-slate-200 font-semibold text-sm">{qty}</span>
                  <button
                    onClick={() => handleQtyChange(qty + 1)}
                    className="p-3 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full md:w-auto md:px-12 py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-lg ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:shadow-indigo-600/40'
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-slate-900 pt-12">
        {/* Review Form */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center space-x-2">
            <MessageSquare size={20} className="text-indigo-400" />
            <span>Submit a Review</span>
          </h2>

          {user ? (
            <form onSubmit={handleReviewSubmit} className="glass p-6 rounded-2xl border border-slate-800 space-y-4">
              {reviewSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-xs">
                  Review submitted successfully!
                </div>
              )}
              {reviewError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs flex items-center space-x-1.5">
                  <ShieldAlert size={14} />
                  <span>{reviewError}</span>
                </div>
              )}

              {/* Rating selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className="text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star size={24} className={num <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Comment
                </label>
                <textarea
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 placeholder-slate-600 rounded-xl p-3 outline-none text-sm transition-all"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={reviewSubmitLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/30"
              >
                {reviewSubmitLoading ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          ) : (
            <div className="glass p-6 rounded-2xl border border-slate-800 text-center">
              <p className="text-slate-400 text-sm mb-4">Please log in to write a review for this product.</p>
              <Link
                to="/login"
                className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Customer Reviews</h2>

          {reviews.length === 0 ? (
            <div className="glass p-8 rounded-2xl border border-slate-800 text-center">
              <p className="text-slate-400 text-sm">There are no reviews for this product yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="glass p-6 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm">{rev.name}</h4>
                      <span className="text-xs text-slate-500">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {/* Stars */}
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
