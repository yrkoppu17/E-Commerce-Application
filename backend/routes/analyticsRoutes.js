import express from 'express';
import {
  getSalesAnalytics,
  getCategoryAnalytics,
  getTopProductsAnalytics,
  getInventoryReport
} from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/sales', protect, admin, getSalesAnalytics);
router.get('/categories', protect, admin, getCategoryAnalytics);
router.get('/products', protect, admin, getTopProductsAnalytics);
router.get('/inventory', protect, admin, getInventoryReport);

export default router;
