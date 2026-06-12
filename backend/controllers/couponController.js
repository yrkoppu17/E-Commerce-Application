import Coupon from '../models/Coupon.js';

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  const { code, discountType, discountValue, expiryDate, minPurchaseAmount, isActive } = req.body;

  try {
    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      expiryDate,
      minPurchaseAmount,
      isActive
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
  const { code, discountType, discountValue, expiryDate, minPurchaseAmount, isActive } = req.body;

  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    coupon.code = code ? code.toUpperCase() : coupon.code;
    coupon.discountType = discountType || coupon.discountType;
    coupon.discountValue = discountValue !== undefined ? discountValue : coupon.discountValue;
    coupon.expiryDate = expiryDate || coupon.expiryDate;
    coupon.minPurchaseAmount = minPurchaseAmount !== undefined ? minPurchaseAmount : coupon.minPurchaseAmount;
    coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    await Coupon.deleteOne({ _id: req.params.id });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
  const { code, cartTotal } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or inactive coupon code' });
    }

    // Check expiry
    const now = new Date();
    if (new Date(coupon.expiryDate) < now) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    // Check min purchase
    if (cartTotal < coupon.minPurchaseAmount) {
      return res.status(400).json({
        message: `Minimum purchase amount of $${coupon.minPurchaseAmount} is required for this coupon.`
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'Percentage') {
      discountAmount = parseFloat(((cartTotal * coupon.discountValue) / 100).toFixed(2));
    } else {
      discountAmount = Math.min(coupon.discountValue, cartTotal);
    }

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
};
