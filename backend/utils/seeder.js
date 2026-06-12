import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import { generateProducts, generateCoupons } from './dynamicSeederHelper.js';

dotenv.config();

// Connect to Database
await mongoose.connect(process.env.MONGO_URI);

const usersData = [
  {
    name: 'Admin User',
    email: 'admin@shopez.com',
    password: 'admin123',
    role: 'admin',
    addresses: [
      {
        label: 'Office',
        name: 'Admin Head Office',
        street: '100 Admin Way',
        city: 'Silicon Valley',
        postalCode: '94025',
        country: 'USA'
      }
    ]
  },
  {
    name: 'John Doe',
    email: 'john@gmail.com',
    password: '123456',
    role: 'customer',
    addresses: [
      {
        label: 'Home',
        name: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        country: 'USA'
      }
    ]
  }
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();

    const createdUsers = await User.insertMany(usersData);
    console.log('Users Seeded!');
    const adminId = createdUsers[0]._id;
    const johnId = createdUsers[1]._id;

    // Generate products dynamically
    const productsToSeed = generateProducts();
    const createdProducts = await Product.insertMany(productsToSeed);
    console.log(`Products Seeded: ${createdProducts.length}`);

    // Generate coupons
    const couponsToSeed = generateCoupons();
    await Coupon.insertMany(couponsToSeed);
    console.log('Coupons Seeded!');

    // Generate reviews
    const reviewsData = [];
    createdProducts.forEach((prod, pIdx) => {
      reviewsData.push({
        product: prod._id,
        user: johnId,
        name: 'John Doe',
        rating: Math.max(1, Math.min(5, Math.round(prod.averageRating))),
        comment: `Excellent product! The ${prod.name} operates exactly as described. Outstanding quality and solid brand experience.`,
        isVerified: true,
        helpfulVotes: 5 + (pIdx % 3),
        votedUsers: []
      });

      reviewsData.push({
        product: prod._id,
        user: adminId,
        name: 'Admin Tester',
        rating: Math.max(1, Math.min(5, Math.round(prod.averageRating) - (pIdx % 2))),
        comment: `Highly recommended. Tested this extensively and the material holds up perfectly. Worth every penny!`,
        isVerified: true,
        helpfulVotes: 2,
        votedUsers: []
      });
    });

    await Review.insertMany(reviewsData);
    console.log(`Reviews Seeded: ${reviewsData.length}`);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
