const categories = [
  'Electronics',
  'Fashion',
  'Footwear',
  'Watches',
  'Books',
  'Home Appliances',
  'Sports',
  'Beauty',
  'Grocery',
  'Accessories'
];

const categoryBrands = {
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

const categoryImages = {
  'Electronics': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'
  ],
  'Fashion': [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
  ],
  'Footwear': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
  ],
  'Watches': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=800&auto=format&fit=crop&q=80'
  ],
  'Books': [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&auto=format&fit=crop&q=80'
  ],
  'Home Appliances': [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80'
  ],
  'Sports': [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=800&auto=format&fit=crop&q=80'
  ],
  'Beauty': [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&auto=format&fit=crop&q=80'
  ],
  'Grocery': [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=800&auto=format&fit=crop&q=80'
  ],
  'Accessories': [
    'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
  ]
};

const categoryProductNames = {
  'Electronics': [
    'UltraView 4K Smart TV', 'SoundWave ANC Headset', 'PocketSize Mini Projector', 'Smartcharge Powerbank 20k',
    'VoiceControl Smart Speaker', 'SecureCam WiFi Camera', 'StreamDesk Capture Card', 'NanoSound Bluetooth Earbuds',
    'ProStudio Condenser Microphone', 'VividPix Digital Photo Frame', 'NetShield DualBand Router', 'SafeLink Key Tracker',
    'SpeedyDrive Portable SSD', 'EcoGlow LED Desk Lamp', 'AirClean Desktop Purifier', 'ChargeDock 3-in-1 Station',
    'RetroPlay Handheld Console', 'UltraSlim Wireless Keyboard', 'PrecisionErgo Wireless Mouse', 'ScreenGuard AntiGlare Filter'
  ],
  'Fashion': [
    'Classic Denim Jacket', 'Slim-Fit Chino Pants', 'Premium Cotton Tee Pack', 'Cozy Knit Sweater',
    'Waterproof Hooded Windbreaker', 'Tailored Linen Blazer', 'Athletic Fleece Joggers', 'Vintage Leather Belt',
    'Ribbed Crew Socks Pack', 'Casual Oxford Shirt', 'Summer Floral Sundress', 'Pleated Midi Skirt',
    'Denim Overalls Classic', 'Sherpa-Lined Corduroy Jacket', 'Seamless Workout Leggings', 'Silk Evening Scarf',
    'Double-Breasted Wool Coat', 'Stretch Denim Shorts', 'Relaxed Lounge Pajamas', 'Utility Cargo Pants'
  ],
  'Footwear': [
    'FlexRun Sport Sneakers', 'Premium Leather Loafers', 'All-Weather Hiking Boots', 'Classic Canvas High-Tops',
    'Comfort Cushioned Slides', 'Breathable Mesh Trainers', 'Strap-On Sport Sandals', 'Smart Casual Chelsea Boots',
    'Orthopedic Walking Shoes', 'Waterproof Trail Runners', 'Vintage Leather Brogues', 'Slip-On Espadrilles',
    'Fleece-Lined Slippers', 'Formal Patent Oxfords', 'Platform Sole Sneakers', 'Lightweight Tennis Court Shoes',
    'Flexible Gym Flats', 'Stylish Suede Chukkas', 'Heavy-Duty Work Boots', 'Elegant Ankle Strap Flats'
  ],
  'Watches': [
    'AeroChron Quartz Watch', 'ActiveFit Smart Fitness Band', 'Classic Gold Dress Watch', 'Minimalist Analog Watch',
    'Rugged Outdoor Digital Watch', 'Premium Automatic Skeleton Watch', 'Hybrid Business Smartwatch', 'Diver Chronograph 200m',
    'Slim Titanium Mesh Watch', 'Vintage Mechanical Pocket Watch', 'EcoSolar Power Watch', 'Sport Waterproof Stopwatch',
    'Luxe Diamond Accent Watch', 'Military Field Tactical Watch', 'Classic Leather Strap Watch', 'DualTime Travel Chrono',
    'Minimal Silver Bangle Watch', 'Sleek Carbon Fiber Sports Watch', 'Retro Digital Backlight Watch', 'Rose Gold Chic Watch'
  ],
  'Books': [
    'The Silicon Horizon: A Tech Odyssey', 'Whispers of the Ancient Woods', 'Mastering Modern Coding Patterns', 'Recipes from a Grandmother\'s Kitchen',
    'The Art of Slow Living', 'Mindfulness and the Modern Soul', 'Chronicles of the Star Navigator', 'A Guide to Backyard Bird Watching',
    'The Economics of Everyday Choices', 'Lost in the Streets of Paris', 'Creative Writing for Beginners', 'History of the Forgotten Empires',
    'Yoga Anatomy: A Visual Guide', 'The Midnight Detective Case', 'Breathe: Deep Breathing Techniques', 'Gardening in Small Spaces',
    'The Hidden Logic of Success', 'Stars and Galaxies: Astronomy Guide', 'Simple Finance for Young Adults', 'A Voyage Across the Open Seas'
  ],
  'Home Appliances': [
    'SmartPrep Air Fryer Pro', 'QuietBreeze Tower Fan', 'MultiClean Robot Vacuum', 'Precision Control Electric Kettle',
    'PowerBlend 1000W Blender', 'Compact Countertop Microwave', 'Digital Ceramic Space Heater', 'CoolMist Ultrasonic Humidifier',
    'RapidPress Steam Iron', 'SparkleClean Electric Toothbrush', 'FreshBrew Espresso Machine', 'DualZone Wine Refrigerator',
    'UltraClean UV Sanitizer Box', 'SmartLock Keyless Entry Deadbolt', 'PowerDry Ionic Hair Dryer', 'MultiCooker 10-in-1 Pressure Pot',
    'Precision Sous Vide Cooker', 'DeepClean Carpet Washer', 'Compact Dehumidifier 2L', 'Automatic Bread Maker Machine'
  ],
  'Sports': [
    'ProGrip Yoga Mat', 'Adjustable Dumbbell Set', 'Performance Skipping Rope', 'Waterproof Camping Tent',
    'Double-Sleeping Bag Comfort', 'Heavy-Duty Resistance Bands', 'Aluminum Hiking Trekking Poles', 'ProSpin Table Tennis Paddles',
    'Aerodynamic Frisbee Disc', 'Premium Soccer Ball Size 5', 'Professional Leather Baseball Glove', 'Graphite Tennis Racket Pro',
    'Ergonomic Hydration Backpack', 'Multi-Tool Pocket Survival Gear', 'Portable Camping Grill', 'Polarized Sport Sunglasses',
    'UltraLite Folding Camp Chair', 'Heavy-Duty Gym Duffel Bag', 'Speed-Jump Workout Box', 'Waterproof Bicycle Pannier Bag'
  ],
  'Beauty': [
    'HydraGlow Hyaluronic Serum', 'Vitamin C Brightening Cream', 'Organic Argan Hair Repair Oil', 'Natural Rosewater Face Toner',
    'Gentle Clay Cleansing Mask', 'Smoothing Coconut Body Scrub', 'Shea Butter Daily Hand Lotion', 'Ultimate Length Mascara Black',
    'Matte Longwear Lipstick Crimson', 'Moisturizing Aloe Vera Gel', 'Tea Tree Spot Treatment Gel', 'Hydrating Lip Balm Trio',
    'Bamboo Charcoal Face Wash', 'Anti-Frizz Silk Hair Serum', 'Peppermint Foot Soothing Cream', 'Mineral Sunscreen SPF 50',
    'Exfoliating Clean Scrub Mitt', 'Premium Makeup Brush Set', 'Soothing Lavender Bath Salts', 'Daily Protection Moisturizer SPF30'
  ],
  'Grocery': [
    'Organic Golden Honey', 'Premium Extra Virgin Olive Oil', 'Dark Roast Whole Bean Coffee', 'Himalayan Pink Salt Fine',
    'Gluten-Free Rolled Oats', 'Raw Organic Almonds', 'Pure Maple Syrup Grade A', 'Matcha Green Tea Powder',
    'Organic Quinoa Grain', 'Raw Unfiltered Apple Cider Vinegar', 'Chia Seeds Premium Superfood', 'Cold-Pressed Coconut Oil',
    'Spelt Flour Organic', 'Dried Premium Cranberries', 'Roasted Salted Pistachios', 'Gourmet Dark Chocolate Bar',
    'Herbal Chamomile Tea Bags', 'Organic Ground Turmeric Spice', 'Whole Grain Brown Rice', 'Pure Vanilla Extract Bottle'
  ],
  'Accessories': [
    'Anti-Theft Laptop Backpack', 'RFID Blocking Leather Wallet', 'Hard Shell Travel Suitcase', 'Memory Foam Neck Pillow',
    'Compact Windproof Umbrella', 'Microfiber Travel Towel Set', 'Luggage Tag Set Premium', 'Canvas Tote Bag Casual',
    'Blue Light Blocking Glasses', 'Fleece Touchscreen Gloves', 'Polarized Classic Sunglasses', 'Neoprene Laptop Sleeve',
    'Silicone Cable Organizer Pack', 'Collapsible Water Bottle', 'Stainless Steel Key Ring Organizer', 'Velvet Jewelry Organizer Roll',
    'Leather Passport Holder Cover', 'Packable Travel Duffel', 'Handheld Luggage Weight Scale', 'Comfort Travel Eye Mask'
  ]
};

// Programmatic Generator
export const generateProducts = () => {
  const seededProducts = [];

  categories.forEach((cat) => {
    const names = categoryProductNames[cat];
    const brands = categoryBrands[cat];
    const images = categoryImages[cat];

    names.forEach((name, idx) => {
      // Pick dynamic details
      let brand = brands[idx % brands.length];
      if (cat === 'Accessories') {
        if (name.includes('Backpack') || name.includes('Duffel') || name.includes('Sleeve')) {
          brand = 'Herschel';
        } else if (name.includes('Suitcase') || name.includes('Luggage')) {
          brand = 'Samsonite';
        } else if (name.includes('Sunglasses') || name.includes('Glasses')) {
          brand = 'Ray-Ban';
        } else if (name.includes('Wallet') || name.includes('Passport') || name.includes('Organizer')) {
          brand = 'Bellroy';
        } else if (name.includes('Umbrella') || name.includes('Pillow') || name.includes('Mask')) {
          brand = 'Travelon';
        }
      }
      const imageList = [
        images[idx % images.length],
        images[(idx + 1) % images.length],
        images[(idx + 2) % images.length]
      ];

      // Realistic prices
      let basePrice = 20;
      if (cat === 'Electronics') basePrice = 49 + (idx * 25);
      else if (cat === 'Home Appliances') basePrice = 39 + (idx * 20);
      else if (cat === 'Footwear') basePrice = 30 + (idx * 7);
      else if (cat === 'Watches') basePrice = 45 + (idx * 30);
      else if (cat === 'Fashion') basePrice = 15 + (idx * 5);
      else if (cat === 'Accessories') basePrice = 10 + (idx * 4);
      else if (cat === 'Sports') basePrice = 12 + (idx * 8);
      else if (cat === 'Books') basePrice = 8 + (idx * 1.5);
      else if (cat === 'Beauty') basePrice = 9 + (idx * 2);
      else if (cat === 'Grocery') basePrice = 4 + (idx * 1.2);

      basePrice = parseFloat(basePrice.toFixed(2));

      // Discounts
      let discountPercent = 0;
      const discountRoll = idx % 5; // 20% discount rate
      if (discountRoll === 1) discountPercent = 10;
      else if (discountRoll === 2) discountPercent = 20;
      else if (discountRoll === 3) discountPercent = 30;
      else if (discountRoll === 4) discountPercent = 50;

      const price = parseFloat((basePrice * (1 - discountPercent / 100)).toFixed(2));
      const originalPrice = discountPercent > 0 ? basePrice : price;

      // Deal types
      let dealType = 'None';
      if (idx === 0) dealType = 'TodaysDeals';
      else if (idx === 4) dealType = 'BestDeals';
      else if (idx === 8) dealType = 'MegaSale';
      else if (idx === 12) dealType = 'WeekendOffers';
      else if (idx === 16) dealType = 'ClearanceSale';

      // Variations
      let sizes = [];
      let colors = [];
      let storage = [];
      let weight = [];
      let variants = [];

      if (cat === 'Fashion') {
        sizes = ['S', 'M', 'L', 'XL'];
        colors = ['Black', 'White', 'Navy Blue', 'Olive Green'];
        // Create 4 standard variants
        sizes.forEach((s) => {
          colors.slice(0, 2).forEach((c) => {
            variants.push({
              size: s,
              color: c,
              stockQuantity: 5 + (idx % 5),
              price: price
            });
          });
        });
      } else if (cat === 'Footwear') {
        sizes = ['8', '9', '10', '11'];
        colors = ['Black', 'Brown', 'Grey'];
        sizes.forEach((s) => {
          variants.push({
            size: s,
            color: colors[0],
            stockQuantity: 4 + (idx % 4),
            price: price
          });
        });
      } else if (cat === 'Electronics' || cat === 'Watches') {
        storage = ['128GB', '256GB'];
        colors = ['Space Gray', 'Silver'];
        if (name.includes('Smart TV') || name.includes('Speaker') || name.includes('Purifier') || name.includes('Console')) {
          colors = ['Charcoal Black', 'Arctic White'];
          colors.forEach((c) => {
            variants.push({
              color: c,
              stockQuantity: 3 + (idx % 3),
              price: price
            });
          });
        } else {
          storage.forEach((st) => {
            colors.forEach((col) => {
              variants.push({
                storage: st,
                color: col,
                stockQuantity: 2 + (idx % 4),
                price: st === '256GB' ? parseFloat((price * 1.15).toFixed(2)) : price
              });
            });
          });
        }
      } else if (cat === 'Grocery') {
        weight = ['250g', '500g', '1kg'];
        weight.forEach((wt, wIdx) => {
          variants.push({
            weight: wt,
            stockQuantity: 15 + (idx % 10),
            price: parseFloat((price * (wIdx + 1) * 0.9).toFixed(2)) // bundle discount
          });
        });
      } else {
        // Default variant
        variants.push({
          stockQuantity: 10 + (idx % 8),
          price: price
        });
      }

      // Ratings
      const averageRating = parseFloat((4.0 + ((idx * 7) % 11) / 10).toFixed(1)); // between 4.0 and 5.0

      seededProducts.push({
        name,
        description: `Premium high-performance ${name.toLowerCase()} designed by ${brand} for maximum comfort, durability, and reliability. Perfect for daily use, featuring state-of-the-art materials and styling.`,
        price,
        originalPrice,
        discountPercent,
        category: cat,
        brand,
        stockQuantity: variants.reduce((acc, v) => acc + v.stockQuantity, 0) || 15,
        images: imageList,
        averageRating,
        numReviews: 4,
        sizes,
        colors,
        storage,
        weight,
        variants,
        isFeatured: idx % 6 === 0,
        isTrending: idx % 6 === 1,
        isBestSeller: idx % 6 === 2,
        isNewArrival: idx % 6 === 3,
        dealType
      });
    });
  });

  return seededProducts;
};

// Coupons list
export const generateCoupons = () => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  
  return [
    {
      code: 'WELCOME50',
      discountType: 'Flat',
      discountValue: 50,
      expiryDate: nextMonth,
      minPurchaseAmount: 150,
      isActive: true
    },
    {
      code: 'SAVE10',
      discountType: 'Percentage',
      discountValue: 10,
      expiryDate: nextMonth,
      minPurchaseAmount: 50,
      isActive: true
    },
    {
      code: 'MEGA25',
      discountType: 'Percentage',
      discountValue: 25,
      expiryDate: nextMonth,
      minPurchaseAmount: 200,
      isActive: true
    },
    {
      code: 'FLAT20',
      discountType: 'Flat',
      discountValue: 20,
      expiryDate: nextMonth,
      minPurchaseAmount: 80,
      isActive: true
    }
  ];
};
