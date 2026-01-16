# Vendor Management System (Admin–Vendor–Order Portal)

A **full-stack role-based vendor management system** where:

- **Admins** manage vendors, products, and orders
- **Vendors** can add products only after admin approval
- **Orders** are visible to admin in a centralized order list

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Usage Guide](#-usage-guide)
- [Troubleshooting](#-troubleshooting)

---

##  Features

### Authentication & Authorization

- User Registration & Login
- JWT-based authentication
- Role-based access control (ADMIN / VENDOR)
- Secure password hashing with bcrypt

### Admin Dashboard

- Approve / De-approve vendors
- Block / Unblock products
- View all vendors with approval status
- View all products with status
- View all orders (Order List)
- Create new orders
- View sales statistics
- Search and filter capabilities

### Vendor Dashboard

- Vendor registration (requires admin approval)
- Add products (only if approved)
- Update existing products
- View own products list
- View sales/orders for their products
- Download invoices for completed orders (PDF)
- Automatically restricted if de-approved

### Orders Management

- Admin can create orders
- Admin can view all orders
- Order list shows:
  - Order ID
  - Product name
  - Vendor name
  - Quantity
  - Total price
  - Order date
- Vendors can view their own orders
- Invoice generation and download (PDF)

---

##  Tech Stack

### Frontend

- **React** (Vite) - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router DOM** - Routing

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** (jsonwebtoken) - Authentication
- **bcrypt** - Password hashing
- **PDFKit** - Invoice generation

---

##  Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**
- **MySQL** (v5.7 or higher) or **MariaDB**


---

##  Installation

### Step 1: Clone or Download the Repository


# Or extract the downloaded ZIP file
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
# Copy the .env.example or create manually
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

---

##  Database Setup

### Step 1: Create Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE vendor_portal;
USE vendor_portal;
```

### Step 2: Create Tables

Run the following SQL commands to create all required tables:

```sql
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN','VENDOR') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors table
CREATE TABLE vendors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  approved BOOLEAN DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vendor_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status ENUM('ACTIVE','BLOCKED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vendor_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

### Step 3: Create Admin User (Optional)

To create an admin user directly in the database:

```sql
-- Insert admin user (password: admin123 - change this!)
-- Password hash is for 'admin123' - generate your own hash for production
INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@example.com', '$2b$10$YourHashedPasswordHere', 'ADMIN');
```

**Note:** For production, register admin through the registration endpoint and manually update the role in the database, or use a secure password hashing method.

---

##  Environment Variables

Create a `.env` file inside the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=vendor_portal

# JWT Secret (use a strong random string in production)
JWT_SECRET=your_secret_key_here_change_in_production

# Node Environment
NODE_ENV=development
```

### Example `.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=vendor_portal
JWT_SECRET=my_super_secret_jwt_key_12345
NODE_ENV=development
```

** Important:**

- Never commit `.env` file to version control
- Use strong, random strings for `JWT_SECRET` in production
- Change default database credentials

---

## ▶️ Running the Project

### Backend Server

```bash
# Navigate to backend directory
cd backend

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run on: **http://localhost:5000**

### Frontend Server

Open a **new terminal** window:

```bash
# Navigate to frontend directory
cd frontend

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

---

## 📁 Project Structure

```
peppermint/
│
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── auth.controllers.js
│   │   └── vendor.controller.js
│   ├── middlewares/
│   │   ├── admin.middleware.js
│   │   ├── auth.middleware.js
│   │   └── vendor.middleware.js
│   ├── models/
│   │   ├── Invoice.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Vendor.js
│   ├── routes/
│   │   ├── admin.route.js
│   │   ├── auth.route.js
│   │   └── vendor.route.js
│   ├── utils/
│   │   └── generateInvoice.js
│   ├── index.js               # Entry point
│   ├── package.json
│   └── .env                   # Environment variables (create this)
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js      # API configuration
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── AdminOrders.jsx
│   │   │   ├── vendor/
│   │   │   │   ├── VendorDashboard.jsx
│   │   │   │   ├── MyProducts.jsx
│   │   │   │   └── AddProduct.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── App.jsx            # Main app component
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

##  API Endpoints

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Vendor registered, waiting for admin approval"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "VENDOR"
  }
}
```

#### Get All Users (Admin Only)

```http
GET /api/auth/allusers
Authorization: Bearer <admin_jwt_token>
```

---

### Admin Endpoints

All admin endpoints require:

- `Authorization: Bearer <jwt_token>` header
- User role must be `ADMIN`

#### Get All Vendors

```http
GET /api/admin/vendors
Authorization: Bearer <admin_jwt_token>
```

#### Toggle Vendor Approval

```http
PUT /api/admin/vendor-toggle/:id
Authorization: Bearer <admin_jwt_token>
```

#### Get All Products

```http
GET /api/admin/products
Authorization: Bearer <admin_jwt_token>
```

#### Toggle Product Status (Block/Unblock)

```http
PUT /api/admin/product-toggle/:id
Authorization: Bearer <admin_jwt_token>
```

#### Get All Orders

```http
GET /api/admin/orders
Authorization: Bearer <admin_jwt_token>
```

#### Create Order

```http
POST /api/admin/orders
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "product_id": 1,
  "vendor_id": 1,
  "quantity": 2
}
```

**Response:**

```json
{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "vendor_id": 1,
    "product_id": 1,
    "quantity": 2,
    "total_price": 200.0,
    "created_at": "2024-01-01T00:00:00.000Z",
    "product_name": "Product Name",
    "vendor_name": "Vendor Name"
  }
}
```

#### Get Sales Statistics

```http
GET /api/admin/sales
Authorization: Bearer <admin_jwt_token>
```

---

### Vendor Endpoints

All vendor endpoints require:

- `Authorization: Bearer <jwt_token>` header
- User role must be `VENDOR`
- Vendor must be approved (for product operations)

#### Add Product

```http
POST /api/vendor/product
Authorization: Bearer <vendor_jwt_token>
Content-Type: application/json

{
  "name": "Product Name",
  "price": 100.00
}
```

#### Update Product

```http
PUT /api/vendor/product/:id
Authorization: Bearer <vendor_jwt_token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 150.00
}
```

#### Get My Products

```http
GET /api/vendor/products
Authorization: Bearer <vendor_jwt_token>
```

#### Get My Orders

```http
GET /api/vendor/orders
Authorization: Bearer <vendor_jwt_token>
```

#### Download Invoice

```http
GET /api/vendor/invoice/:orderId
Authorization: Bearer <vendor_jwt_token>
```

Returns a PDF file download.

---

## Usage Guide

### For Admins

1. **Login/Register**

   - If no admin exists, register and manually update role to `ADMIN` in database
   - Or login with existing admin credentials

2. **Approve Vendors**

   - Navigate to Vendors tab
   - Click "Approve" on pending vendors
   - Vendors can only add products after approval

3. **Manage Products**

   - View all products in Products tab
   - Block/unblock products as needed
   - Blocked products cannot be ordered

4. **Create Orders**

   - Navigate to Orders tab
   - Create new orders by selecting product, vendor, and quantity
   - System automatically calculates total price

5. **View Orders**
   - See all orders with details
   - Filter and search orders

### For Vendors

1. **Register**

   - Register with name, email, and password
   - Wait for admin approval

2. **Add Products** (After Approval)

   - Navigate to Products tab
   - Add product name and price
   - Products are set to ACTIVE by default

3. **Update Products**

   - Click "Edit" on any product
   - Update name and/or price
   - Save changes

4. **View Sales**

   - Navigate to Sales tab
   - View all orders for your products
   - See order details, quantities, and totals

5. **Download Invoices**
   - Click "Download" on completed orders
   - PDF invoice will be generated and downloaded
   - Invoice includes order details, vendor info, and pricing

---

##  Troubleshooting

### Backend Issues

**Problem:** `Cannot connect to database`

- **Solution:**
  - Check MySQL is running
  - Verify `.env` file has correct database credentials
  - Ensure database `vendor_portal` exists

**Problem:** `Cannot POST /api/admin/orders`

- **Solution:**
  - Restart the backend server
  - Verify route is registered in `admin.route.js`
  - Check middleware is correctly applied

**Problem:** `JWT token invalid`

- **Solution:**
  - Ensure token is sent in `Authorization: Bearer <token>` header
  - Check `JWT_SECRET` in `.env` matches
  - Token expires after 1 day, login again

### Frontend Issues

**Problem:** `Cannot connect to API`

- **Solution:**
  - Verify backend is running on port 5000
  - Check `axios.js` has correct baseURL
  - Check CORS is enabled in backend

**Problem:** `404 on routes`

- **Solution:**
  - Check React Router routes in `App.jsx`
  - Verify all page components exist
  - Check browser console for errors

### Database Issues

**Problem:** `Foreign key constraint fails`

- **Solution:**
  - Ensure tables are created in correct order
  - Check foreign key relationships
  - Verify referenced IDs exist

**Problem:** `Duplicate entry for email`

- **Solution:**
  - Email must be unique
  - Use different email for registration
  - Or delete existing user first

---

##  Notes

- **Password Requirements:** Minimum 6 characters
- **Email Validation:** Must be valid email format
- **Vendor Approval:** Vendors cannot add products until approved by admin
- **Product Status:** Only ACTIVE products can be ordered
- **Invoice Download:** Only available for completed orders
- **Token Expiry:** JWT tokens expire after 1 day

---

##  Security Notes

- Always use strong passwords in production
- Change default `JWT_SECRET` to a random string
- Never commit `.env` file to version control
- Use HTTPS in production
- Implement rate limiting for production
- Validate and sanitize all inputs

---

##  License

This project is open source and available for educational purposes.

---

##  Support

For issues or questions:

1. Check the Troubleshooting section
2. Review API endpoint documentation
3. Check browser/terminal console for error messages
4. Verify database connection and environment variables

---

**Happy Coding! **
