# shopEZ - Full-Stack E-Commerce Marketplace (MERN)

This document provides a comprehensive walkthrough of the features and architectures implemented in the **shopEZ** platform, verifying compliance with the system specifications.

---

## 1. Architecture & Core Tech Stack

- **Backend (Node.js & Express)**: Located in [backend/](file:///d:/project444444/backend). Centralized error handling, input validation, and RESTful routing structure.
- **Database (MongoDB/Mongoose)**: Models defined in [backend/models/](file:///d:/project444444/backend/models) representing:
  - [User](file:///d:/project444444/backend/models/User.js) (with shipping addresses, wishlist array, and roles)
  - [Product](file:///d:/project444444/backend/models/Product.js) (with rating aggregation, variants, and stock control)
  - [Order](file:///d:/project444444/backend/models/Order.js) (with pricing breakdowns, status timeline, and payment info)
  - [Review](file:///d:/project444444/backend/models/Review.js) (verified purchase indicator, star rating, and helpful vote tracks)
  - [Coupon](file:///d:/project444444/backend/models/Coupon.js) (active dates, type, discount values)
- **Database Seeder**: The application features a dynamic seeder [db.js](file:///d:/project444444/backend/config/db.js) which starts an **In-Memory MongoDB fallback server** via `mongodb-memory-server` if a local connection isn't available. It auto-seeds the system with mock customers, products, reviews, and active coupon codes.
- **Frontend (React + Vite + Tailwind CSS)**: Premium, responsive, mobile-first design using HSL tailored dark-and-light-mode compatible palettes, Outfit/Inter typography, and subtle transitions. Built using functional components and Context state providers.

---

## 2. Core Feature Walkthrough

### 2.1 User Authentication & Authorization (RBAC)
- **Register / Login**: Secure registration and session creation with JWT tokens.
- **Role-Based Access Control**:
  - Enforced in the backend via JWT checking in [authMiddleware.js](file:///d:/project444444/backend/middleware/authMiddleware.js) (`protect`, `admin`).
  - Guarded in React routes via [ProtectedRoute.jsx](file:///d:/project444444/frontend/src/components/ProtectedRoute.jsx).
- **Profile Dashboard**: Built in [ProfileDashboard.jsx](file:///d:/project444444/frontend/src/pages/ProfileDashboard.jsx). Users can edit profiles, manage multiple saved shipping addresses (add, edit, remove, set default), and view account configurations.

### 2.2 Product Catalog & Search/Filters
- **Listing & Details**: High-fidelity product card layouts with ratings summaries, discount/sale badges, stock warnings, and specification lists.
- **Detail View**: Interactive thumbnail selector on the product detail page with related products carousel, stock status, delivery estimation checker, and double-review prevention.
- **Full-Text Filter & Search**: Custom search inputs with category dropdown select, price ranges, minimum ratings filter, availability toggle, and sort configurations (low-to-high, high-to-low, newest, ratings).
- **Autocomplete Suggestions**: Auto-filters based on live name inputs.

### 2.3 Cart & Wishlist Lifecycle
- **Persistent Cart**: Integrated with Context state. Handles quantities, stock checks, and tax calculations.
- **Saved Wishlist**: A custom space where users add/remove favorites. Includes a drop-in option to "Move to Cart" which transfers items and clears them from the wishlist in one tap.

### 2.4 Checkout & Mock Stripe Payments
- **Multi-Step Checkout**: Addresses, shipping speeds, code validation, order totals preview, and payment card inputs.
- **Coupons**: Interactive promo code entry during checkout. Auto-validates active coupon codes against database values, applying fixed or percentage discounts with itemized tax and shipping fees.
- **Mock Payment Intent**: Uses a custom `/api/payment/create-intent` endpoint representing a production Stripe handshake returning a client secret to proceed safely.

### 2.5 Order Management & Tracking
- **Timeline Tracking**: Visual stepper track illustrating order processing history (`Placed` &rarr; `Confirmed` &rarr; `Packed` &rarr; `Shipped` &rarr; `Out for Delivery` &rarr; `Delivered`).
- **Invoice Overview**: Order history details, itemized totals, discount summary, and delivery statuses.

### 2.6 Interactive Customer Reviews
- **Verified Purchase**: Automatically flags reviews left by users who actually purchased the product.
- **Upvote System**: Customers can vote reviews as "Helpful" which dynamically counts and highlights the helpful tally.

---

## 3. Administrative Control Ledger
Inside [AdminDashboard.jsx](file:///d:/project444444/frontend/src/pages/AdminDashboard.jsx):
- **Live Sales & Growth Charts**: Chart.js representations of monthly revenue, category breakdown performance, active user growth trend, and low stock warnings.
- **Interactive Tables**:
  - **Products**: Complete CRUD controls for titles, prices, descriptions, and stock quantities (with alert thresholds).
  - **Orders**: A live fulfillment selector allowing administrative status overriding.
  - **Customers**: Toggles for blocking or unblocking customer accounts instantly.
  - **Coupons**: Custom coupon manager supporting creation, editing, status toggles, and deletion.

---

## 4. Verification & Clean Builds
- **Vite Build**: Compiled successfully in `2.81s`, outputting standard `dist` production chunks:
  ```bash
  dist/index.html                   0.47 kB
  dist/assets/index-FhdFM_lc.css   58.46 kB
  dist/assets/index-t8kN6ACC.js   660.89 kB
  ```
- **Code Health**: All imports, Route paths, Context states (Auth, Cart, Toast), and Tailwind configurations are verified and clean.
