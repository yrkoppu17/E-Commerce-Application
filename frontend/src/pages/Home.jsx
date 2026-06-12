import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useToast } from '../context/ToastContext';
import { 
  Search, 
  Tv, 
  Smartphone, 
  Watch, 
  Book, 
  Tv as HomeAppIcon, 
  Dumbbell, 
  Sparkles, 
  Apple, 
  Compass,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Percent,
  Clock,
  ThumbsUp,
  RotateCcw,
  Sparkle
} from 'lucide-react';

const categoriesList = [
  { name: 'Electronics', icon: Tv },
  { name: 'Fashion', icon: Smartphone },
  { name: 'Footwear', icon: FootwearIcon },
  { name: 'Watches', icon: Watch },
  { name: 'Books', icon: Book },
  { name: 'Home Appliances', icon: HomeAppIcon },
  { name: 'Sports', icon: Dumbbell },
  { name: 'Beauty', icon: Sparkles },
  { name: 'Grocery', icon: Apple },
  { name: 'Accessories', icon: Compass }
];

function FootwearIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 18c0-2.5 1.5-4 4-4h2.5c1.5 0 2.5 1.5 3 3.5.5 1.5.5 2.5-.5 2.5H4c-1 0-1-.5-1-2Z" />
      <path d="M12 14c2-5 3.5-7 7.5-7 1.5 0 2.5 1 2.5 2.5 0 4.5-3.5 8.5-10 8.5" />
    </svg>
  );
}

const brandOptions = {
  'All': ['Sony', 'Nike', 'Samsung', 'Casio', 'Dyson', 'Lululemon', 'L\'Oreal', 'Nature\'s Own', 'Samsonite', 'Zara'],
  'Electronics': ['Sony', 'Bose', 'Samsung', 'Anker', 'Xiaomi', 'Logitech', 'Canon'],
  'Fashion': ['Levi\'s', 'Zara', 'H&M', 'Nike', 'Adidas', 'Calvin Klein', 'Tommy Hilfiger'],
  'Footwear': ['Puma', 'Nike', 'Adidas', 'Reebok', 'Timberland', 'Clarks', 'Crocs'],
  'Watches': ['Seiko', 'Fossil', 'Casio', 'Citizen', 'Rolex', 'Apple', 'Fitbit'],
  'Books': ['Penguin', 'HarperCollins', 'O\'Reilly', 'Pearson', 'Macmillan', 'Scholastic'],
  'Home Appliances': ['Dyson', 'Philips', 'Instant Pot', 'Keurig', 'Panasonic', 'Ninja', 'Samsung'],
  'Sports': ['Lululemon', 'Under Armour', 'Decathlon', 'Wilson', 'Everlast', 'Coleman', 'Spalding'],
  'Beauty': ['L\'Oreal', 'Neutrogena', 'The Ordinary', 'CeraVe', 'Estee Lauder', 'Clinique', 'Nivea'],
  'Grocery': ['Nature\'s Own', 'Bertolli', 'Starbucks', 'Kirkland', 'Quaker', 'Heinz', 'Hershey\'s'],
  'Accessories': ['Samsonite', 'Herschel', 'Ray-Ban', 'Travelon', 'Bellroy', 'Oakley', 'Tile']
};

const testimonials = [
  { name: 'Sarah Jenkins', role: 'Verified Purchaser', quote: 'The delivery was faster than expected! The sneakers fit perfectly and the customer support was extremely responsive.', rating: 5 },
  { name: 'Marcus Chen', role: 'Gadget Enthusiast', quote: 'ShopEZ has become my favorite tech sandbox store. The ANC headphones have top-tier sound resolution for the price.', rating: 5 },
  { name: 'Elena Rostova', role: 'Style Blogger', quote: 'Stunning design and smooth checkout experience. Adding variants and tracking my shipping progress felt premium.', rating: 4 }
];

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  // Search parameter queries
  const searchQueryParam = searchParams.get('search') || '';
  const categoryQueryParam = searchParams.get('category') || '';

  // Data states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryQueryParam || 'All');
  const [keyword, setKeyword] = useState(searchQueryParam || '');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000);
  const [ratingMin, setRatingMin] = useState(0);
  const [availability, setAvailability] = useState(''); // 'inStock' | 'outOfStock' | ''
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [sortOption, setSortOption] = useState('newest');

  // Timer countdown for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 34, seconds: 12 });

  // Hero carousel slide state
  const [heroIndex, setHeroIndex] = useState(0);
  const heroAutoplayRef = useRef(null);

  const heroSlides = [
    {
      title: 'A New Paradigm of Audio.',
      subtitle: 'ShopEZ Premium ANC Headset',
      description: 'Experience active noise cancellation, deep-bass subwoofers, and 40-hour lossless playback.',
      link: '/product/', // Will resolve to the headphones
      badge: 'Today\'s Deal - 20% OFF',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      bgColor: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white'
    },
    {
      title: 'Smart Health, Reimagined.',
      subtitle: 'EZ-Fit Pro Smart Watch',
      description: '7-day battery life, continuous cardiac sensors, and integrated swim-proof step tracking.',
      link: '/product/', // Will resolve to the smartwatch
      badge: 'Best Selling Watch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      bgColor: 'bg-gradient-to-r from-indigo-900 via-purple-950 to-pink-900 text-white'
    },
    {
      title: 'Timeless Style & Form.',
      subtitle: 'Minimalist Grain Leather Backpack',
      description: 'Handcrafted full-grain leather shell featuring waterproof utility compartments for active professionals.',
      link: '/product/',
      badge: 'New Arrival - Limited Stock',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      bgColor: 'bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white'
    }
  ];

  // Auto-sliding hero timer
  useEffect(() => {
    heroAutoplayRef.current = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(heroAutoplayRef.current);
  }, [heroSlides.length]);

  // Flash Sale countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Synchronize category or search from SearchParams (Navbar mega menu or autocomplete)
  useEffect(() => {
    if (categoryQueryParam) {
      setSelectedCategory(categoryQueryParam);
      // scroll to product catalog section
      const catalogEl = document.getElementById('catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (searchQueryParam) {
      setKeyword(searchQueryParam);
      const catalogEl = document.getElementById('catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [categoryQueryParam, searchQueryParam]);

  // Fetch products based on filters
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/products?keyword=${encodeURIComponent(keyword)}&sort=${sortOption}`;
      
      if (selectedCategory && selectedCategory !== 'All') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (selectedBrands.length > 0) {
        url += `&brand=${encodeURIComponent(selectedBrands.join(','))}`;
      }
      if (priceMin > 0) url += `&priceMin=${priceMin}`;
      if (priceMax < 1000) url += `&priceMax=${priceMax}`;
      if (ratingMin > 0) url += `&ratingMin=${ratingMin}`;
      if (availability) url += `&availability=${availability}`;
      if (onlyDiscounted) url += `&discounted=true`;

      const { data } = await api.get(url);
      setProducts(data);
    } catch (err) {
      console.error(err);
      showToast('Error loading catalog products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, selectedBrands, priceMin, priceMax, ratingMin, availability, onlyDiscounted, sortOption, searchQueryParam]);

  const handleBrandChange = (brandName) => {
    if (selectedBrands.includes(brandName)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brandName));
    } else {
      setSelectedBrands([...selectedBrands, brandName]);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setKeyword('');
    setSelectedBrands([]);
    setPriceMin(0);
    setPriceMax(1000);
    setRatingMin(0);
    setAvailability('');
    setOnlyDiscounted(false);
    setSortOption('newest');
    setSearchParams({});
  };

  const handleCategoryShortcutClick = (catName) => {
    setSelectedCategory(catName);
    setSelectedBrands([]); // Reset category specific brands
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sections filtering helpers (using local states since backend seeded all data tags)
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const todaysDeals = products.filter((p) => p.dealType === 'TodaysDeals').slice(0, 4);
  const flashSaleProduct = products.find((p) => p.discountPercent === 50) || products[0];

  const formatTime = (t) => {
    return `${t.hours.toString().padStart(2, '0')}:${t.minutes.toString().padStart(2, '0')}:${t.seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* 1. Promotional sliding Hero Banner */}
      <div className="relative h-[480px] md:h-[520px] w-full overflow-hidden shadow-sm">
        {heroSlides.map((slide, index) => {
          const isActive = index === heroIndex;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-between ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              } ${slide.bgColor}`}
            >
              <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-8">
                {/* Text Description */}
                <div className="space-y-4 md:space-y-6 text-left">
                  <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-white/20">
                    {slide.badge}
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
                    {slide.subtitle}
                  </h1>
                  <h2 className="text-xl md:text-2xl text-slate-300 font-semibold leading-snug">
                    {slide.title}
                  </h2>
                  <p className="text-sm text-slate-400 max-w-md leading-relaxed hidden sm:block">
                    {slide.description}
                  </p>
                  
                  {/* Action Link (Navigate to detail using a seeded placeholder ID if matching) */}
                  <div className="pt-2">
                    <Link
                      to="/"
                      onClick={(e) => {
                        e.preventDefault();
                        const p = products.find(prod => prod.name.includes(slide.subtitle.split(' ')[0]));
                        if (p) navigate(`/product/${p._id}`);
                        else {
                          const catEl = document.getElementById('catalog-section');
                          if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="bg-white text-indigo-950 hover:bg-slate-100 px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 w-fit shadow-lg shadow-black/10 hover:shadow-black/20"
                    >
                      <span>Shop Now</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="hidden md:flex justify-center items-center h-full">
                  <img
                    src={slide.image}
                    alt={slide.subtitle}
                    className="h-64 lg:h-80 object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.5)] transform hover:scale-103 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroIndex(index)}
              className={`w-3.5 h-1.5 rounded-full transition-all duration-350 ${
                index === heroIndex ? 'bg-white w-7' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Sliders Control Arrows */}
        <button
          onClick={() => setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-black/45 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setHeroIndex((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-black/45 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 2. Horizontal Categories Shortcuts Showcase */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-1.5">
          <Sparkle className="text-indigo-600 dark:text-indigo-400 w-5 h-5 fill-indigo-650" />
          <span>Shop by Category</span>
        </h2>
        <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar py-3">
          {categoriesList.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryShortcutClick(cat.name)}
                className="flex flex-col items-center space-y-2.5 flex-shrink-0 group focus:outline-none"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/25 scale-105 border-2 border-indigo-700' 
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-indigo-650 border border-slate-200/60 dark:border-slate-750 shadow-sm'
                }`}>
                  <CatIcon size={20} />
                </div>
                <span className={`text-xs font-bold tracking-wide transition-colors ${isActive ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800'}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Flash Sale Section with CountDown Timer */}
      {flashSaleProduct && (
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="bg-gradient-to-br from-pink-650 via-purple-700 to-indigo-800 text-white rounded-[32px] p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Clock & Copy */}
            <div className="space-y-4 md:space-y-6 text-left z-10 flex-grow max-w-xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-white/20 border border-white/20 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1">
                  <Percent size={12} />
                  <span>Flash Sale Offer</span>
                </span>
                <span className="bg-amber-400 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Clock size={12} />
                  <span>Ends In: {formatTime(timeLeft)}</span>
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                {flashSaleProduct.name}
              </h2>
              <p className="text-sm text-slate-200/90 leading-relaxed line-clamp-3">
                {flashSaleProduct.description}
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl">
                  <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Before</p>
                  <p className="text-sm font-semibold line-through text-slate-200">${flashSaleProduct.originalPrice?.toFixed(2)}</p>
                </div>
                <div className="bg-white/20 border border-white/25 px-5 py-2.5 rounded-2xl shadow-inner">
                  <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Flash Sale Price</p>
                  <p className="text-2xl font-extrabold text-amber-400">${flashSaleProduct.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/product/${flashSaleProduct._id}`}
                  className="bg-white text-indigo-950 hover:bg-slate-100 px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wide transition-all shadow-md shadow-black/15 inline-flex items-center gap-1.5"
                >
                  <span>Grab The Deal</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Product Image */}
            <div className="z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 w-72 h-72 flex items-center justify-center flex-shrink-0 relative group shadow-2xl">
              <img
                src={flashSaleProduct.images[0]}
                alt={flashSaleProduct.name}
                className="h-56 object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute -top-3.5 -right-3.5 bg-amber-400 text-slate-950 font-black text-xs px-3 py-2 rounded-2xl shadow-md rotate-6">
                50% OFF
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Product Segments Carousels (Featured, Best Selling, Trending) */}
      {!loading && products.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mb-16 space-y-16">
          {/* Today's Deals Section */}
          {todaysDeals.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b border-slate-250 dark:border-slate-800 pb-4 mb-6">
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <span className="bg-rose-500 text-white p-1 rounded-lg"><Percent size={16} /></span>
                  <span>Today's Top Deals</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {todaysDeals.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}

          {/* Best Sellers Section */}
          {bestSellers.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b border-slate-250 dark:border-slate-800 pb-4 mb-6">
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <span className="bg-indigo-650 text-white p-1 rounded-lg"><ThumbsUp size={16} /></span>
                  <span>Best Selling Products</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {bestSellers.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}

          {/* Trending Now Section */}
          {trendingProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b border-slate-250 dark:border-slate-800 pb-4 mb-6">
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <span className="bg-purple-650 text-white p-1 rounded-lg"><Sparkles size={16} className="fill-white" /></span>
                  <span>Trending Now</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {trendingProducts.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Complete Catalog Grid with Collapsible Sidebar Filters */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 dark:border-slate-850 scroll-mt-20" id="catalog-section">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Search & Browse Catalog</h3>
            <p className="text-slate-550 dark:text-slate-450 text-xs mt-1">Refine and purchase from all {products.length} matching products.</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-750 text-slate-750 dark:text-slate-200 text-xs font-bold uppercase py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <Filter size={14} />
              <span>{sidebarOpen ? 'Hide Filters' : 'Filters'}</span>
            </button>
            
            {/* Sorting */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-750 text-slate-750 dark:text-slate-200 text-xs font-bold py-2.5 px-3 rounded-xl outline-none focus:border-indigo-500 shadow-sm"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Filters Sidebar (Collapsible) */}
          <div className={`w-full lg:w-64 bg-white dark:bg-slate-800 border border-slate-200/85 dark:border-slate-750 p-6 rounded-3xl space-y-6 shadow-md transition-all duration-300 ${
            sidebarOpen ? 'block' : 'hidden lg:block'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-750 pb-3">
              <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm tracking-wide uppercase">Refine Selection</h4>
              <button onClick={resetFilters} className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1 hover:underline">
                <RotateCcw size={10} />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Keyword</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Headphones"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-xl py-2 pl-8 pr-3 outline-none focus:bg-white focus:border-indigo-500 transition-colors shadow-inner"
                />
                <Search size={12} className="absolute left-2.5 top-2.5 text-slate-450" />
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedBrands([]); // Reset brands when category changes
                }}
                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl p-2 outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="All">All Categories</option>
                {categoriesList.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Brands Checkbox checklist */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Brands</label>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 no-scrollbar border border-slate-100 dark:border-slate-750 p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-850/50">
                {(brandOptions[selectedCategory] || brandOptions['All']).map((bName) => {
                  const isChecked = selectedBrands.includes(bName);
                  return (
                    <button
                      key={bName}
                      onClick={() => handleBrandChange(bName)}
                      className="w-full flex items-center justify-between text-left text-xs py-1 px-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-750 text-slate-700 dark:text-slate-250 transition-colors"
                    >
                      <span>{bName}</span>
                      {isChecked && <Check size={12} className="text-indigo-650 dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Max Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Max Price</label>
                <span className="text-xs font-bold text-slate-750 dark:text-slate-250">${priceMax}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-indigo-650"
              />
            </div>

            {/* Rating Stars filter */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Min Rating</label>
              <div className="flex justify-between items-center gap-1 bg-slate-50 dark:bg-slate-850 p-1.5 rounded-xl border border-slate-150 dark:border-slate-700">
                {[1, 2, 3, 4, 5].map((stars) => {
                  const isActive = ratingMin >= stars;
                  return (
                    <button
                      key={stars}
                      onClick={() => setRatingMin(stars === ratingMin ? 0 : stars)}
                      className="flex-grow hover:scale-105 transition-transform"
                    >
                      <Star
                        size={18}
                        className={`mx-auto ${isActive ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Availability</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAvailability(availability === 'inStock' ? '' : 'inStock')}
                  className={`text-center font-bold text-[10px] uppercase py-2 rounded-lg border transition-all ${
                    availability === 'inStock'
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 text-emerald-600 dark:text-emerald-400'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-350'
                  }`}
                >
                  In Stock
                </button>
                <button
                  onClick={() => setAvailability(availability === 'outOfStock' ? '' : 'outOfStock')}
                  className={`text-center font-bold text-[10px] uppercase py-2 rounded-lg border transition-all ${
                    availability === 'outOfStock'
                      ? 'bg-rose-50 dark:bg-rose-950 border-rose-300 text-rose-600 dark:text-rose-455'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-350'
                  }`}
                >
                  Out of Stock
                </button>
              </div>
            </div>

            {/* Discounted only checkbox */}
            <button
              onClick={() => setOnlyDiscounted(!onlyDiscounted)}
              className="w-full flex items-center justify-between text-left text-xs py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-750 dark:text-slate-250 transition-colors"
            >
              <span className="font-semibold">Discounted Items Only</span>
              <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                onlyDiscounted ? 'bg-indigo-650 border-indigo-600 text-white' : 'border-slate-300 bg-white'
              }`}>
                {onlyDiscounted && <Check size={10} />}
              </div>
            </button>
          </div>

          {/* Product Grid Column */}
          <div className="flex-grow w-full">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 h-[380px] rounded-3xl border border-slate-200/80 dark:border-slate-750"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200/80 dark:border-slate-750 shadow-sm text-slate-400 p-8 space-y-4">
                <Compass size={48} className="mx-auto text-slate-300 animate-spin duration-3000" />
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">No matching products found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Try resetting your brand, price filters, or category keyword queries in the sidebar.</p>
                <button
                  onClick={resetFilters}
                  className="bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-bold uppercase px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="animate-fade-slide-up">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 6. Customer Testimonials */}
      <div className="bg-slate-100 dark:bg-slate-850 py-16 transition-colors border-t border-b border-slate-200/50 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">Customer Testimonials</h2>
          <p className="text-xs text-slate-450 dark:text-slate-500 mb-10">Read from verified ShopEZ patrons about our products and quick integrations.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-750 flex flex-col justify-between text-left space-y-4">
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed italic flex-grow">
                  "{t.quote}"
                </p>
                <div>
                  <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm leading-snug">{t.name}</h4>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Home;
