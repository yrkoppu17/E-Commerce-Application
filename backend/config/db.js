import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import { generateProducts, generateCoupons } from '../utils/dynamicSeederHelper.js';

const seedInMemoryData = async () => {
  try {
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

    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();

    const hashedUsers = await Promise.all(
      usersData.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);
    const adminId = createdUsers[0]._id;
    const johnId = createdUsers[1]._id;

    // Generate products dynamically
    const productsToSeed = generateProducts();
    const createdProducts = await Product.insertMany(productsToSeed);
    console.log(`Dynamic Products Seeded: ${createdProducts.length}`);

    // Generate coupons
    const couponsToSeed = generateCoupons();
    await Coupon.insertMany(couponsToSeed);
    console.log('Dynamic Coupons Seeded!');

    // Generate a few reviews for each product
    const reviewsData = [];
    createdProducts.forEach((prod, pIdx) => {
      // First review
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

      // Second review
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
    console.log(`Dynamic Reviews Seeded: ${reviewsData.length}`);
    console.log('In-Memory Database Seeded with Mock Data!');
  } catch (err) {
    console.error('Error seeding in-memory database:', err.message);
  }
};

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000, // 3 seconds timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Local MongoDB connection failed: ${error.message}`);
    console.log('Starting In-Memory MongoDB Fallback...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      console.log(`In-Memory MongoDB Started at ${uri}`);

      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);

      await seedInMemoryData();
    } catch (memError) {
      console.error(`Fallback failed: ${memError.message}`);
      console.log('Could not load memory-server. Exiting server.');
      process.exit(1);
    }
  }
};

export default connectDB;
