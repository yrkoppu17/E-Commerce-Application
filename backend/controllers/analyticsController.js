import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get monthly sales & revenue analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'Paid' });
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthlySales = {};
    const monthlyOrders = {};
    const monthlyCustomers = {};

    months.forEach((m) => {
      monthlySales[m] = 0;
      monthlyOrders[m] = 0;
      monthlyCustomers[m] = new Set();
    });

    orders.forEach((o) => {
      const date = new Date(o.createdAt);
      const mName = months[date.getMonth()];
      monthlySales[mName] = parseFloat((monthlySales[mName] + o.totalPrice).toFixed(2));
      monthlyOrders[mName] += 1;
      if (o.user) monthlyCustomers[mName].add(o.user.toString());
    });

    const salesData = months.map((m) => monthlySales[m]);
    const ordersData = months.map((m) => monthlyOrders[m]);
    const customerGrowthData = months.map((m) => monthlyCustomers[m].size);

    res.json({
      months,
      salesData,
      ordersData,
      customerGrowthData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sales breakdown by category
// @route   GET /api/analytics/categories
// @access  Private/Admin
const getCategoryAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'Paid' });
    const categoryBreakdown = {};

    for (const order of orders) {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        const categoryName = product ? product.category : 'Unknown';
        const saleAmount = item.price * item.qty;
        
        categoryBreakdown[categoryName] = parseFloat(
          ((categoryBreakdown[categoryName] || 0) + saleAmount).toFixed(2)
        );
      }
    }

    res.json(categoryBreakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top selling products
// @route   GET /api/analytics/products
// @access  Private/Admin
const getTopProductsAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'Paid' });
    const productSales = {};

    for (const order of orders) {
      for (const item of order.orderItems) {
        const prodId = item.product.toString();
        if (!productSales[prodId]) {
          productSales[prodId] = {
            _id: prodId,
            name: item.name,
            image: item.image,
            quantitySold: 0,
            revenueGenerated: 0
          };
        }
        productSales[prodId].quantitySold += item.qty;
        productSales[prodId].revenueGenerated = parseFloat(
          (productSales[prodId].revenueGenerated + item.price * item.qty).toFixed(2)
        );
      }
    }

    const sortedProducts = Object.values(productSales)
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 10);

    res.json(sortedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inventory low-stock alerts & reports
// @route   GET /api/analytics/inventory
// @access  Private/Admin
const getInventoryReport = async (req, res) => {
  try {
    const totalProductsCount = await Product.countDocuments({});
    
    // Low stock items (stock quantity <= 5)
    const lowStockProducts = await Product.find({ stockQuantity: { $lte: 5 } })
      .select('name stockQuantity category price brand');

    // Out of stock items
    const outOfStockCount = await Product.countDocuments({ stockQuantity: 0 });

    res.json({
      totalProductsCount,
      outOfStockCount,
      lowStockProductsCount: lowStockProducts.length,
      lowStockProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getSalesAnalytics,
  getCategoryAnalytics,
  getTopProductsAnalytics,
  getInventoryReport
};
