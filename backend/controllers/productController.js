import Product from '../models/Product.js';
import Review from '../models/Review.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    // Combine filters
    const products = await Product.find({ ...keyword, ...category });
    res.json(products);
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Fetch reviews for this product
      const reviews = await Review.find({ product: req.params.id }).populate('user', 'name');
      res.json({ product, reviews });
    } else {
      res.status(404);
      res.json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      // Clean up reviews too
      await Review.deleteMany({ product: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      res.json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stockQuantity, images } = req.body;

    const product = new Product({
      name: name || 'Sample Name',
      price: price || 0,
      description: description || 'Sample Description',
      category: category || 'Sample Category',
      stockQuantity: stockQuantity || 0,
      images: images || ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
      averageRating: 0,
      numReviews: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400);
    res.json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, stockQuantity, images } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name !== undefined ? name : product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description !== undefined ? description : product.description;
      product.category = category !== undefined ? category : product.category;
      product.stockQuantity = stockQuantity !== undefined ? stockQuantity : product.stockQuantity;
      product.images = images !== undefined ? images : product.images;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      res.json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400);
    res.json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = await Review.findOne({
        product: req.params.id,
        user: req.user._id,
      });

      if (alreadyReviewed) {
        res.status(400);
        res.json({ message: 'Product already reviewed' });
        return;
      }

      const review = new Review({
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        product: req.params.id,
      });

      await review.save();

      // Recalculate product rating and count
      const productReviews = await Review.find({ product: req.params.id });
      product.numReviews = productReviews.length;
      product.averageRating =
        productReviews.reduce((acc, item) => item.rating + acc, 0) /
        productReviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404);
      res.json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
