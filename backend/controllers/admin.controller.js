import db from "../config/db.js";
import Order from "../models/Order.js";

/* =========================
   GET ALL VENDORS
========================= */
export const getAllVendors = async (req, res) => {
  try {
    const [vendors] = await db.execute(`
      SELECT 
        v.id,
        v.user_id,
        v.approved,
        u.name,
        u.email
      FROM vendors v
      JOIN users u ON v.user_id = u.id
      ORDER BY v.approved ASC
    `);

    res.json(vendors);
  } catch (error) {
    console.error("GET ALL VENDORS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   APPROVE / DE-APPROVE VENDOR
========================= */
export const toggleVendorApproval = async (req, res) => {
  try {
    const vendorId = Number(req.params.id);
    if (!Number.isFinite(vendorId) || vendorId <= 0) {
      return res.status(400).json({ message: "Invalid vendor id" });
    }

    const [[vendor]] = await db.execute(
      "SELECT approved FROM vendors WHERE id=?",
      [vendorId]
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const newStatus = vendor.approved ? 0 : 1;

    await db.execute("UPDATE vendors SET approved=? WHERE id=?", [
      newStatus,
      vendorId,
    ]);

    res.json({
      message: newStatus ? "Vendor approved" : "Vendor de-approved",
    });
  } catch (error) {
    console.error("TOGGLE VENDOR APPROVAL ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET ALL PRODUCTS
========================= */
export const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.execute(`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.status,
        p.vendor_id
      FROM products p
      ORDER BY p.created_at DESC
    `);

    res.json(products);
  } catch (error) {
    console.error("GET ALL PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET ALL ORDERS (ADMIN)
   Returns fields the frontend expects:
   - product_name, vendor_name, quantity, total_price, created_at
========================= */
export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT
        o.id,
        p.name AS product_name,
        u.name AS vendor_name,
        o.quantity,
        o.total_price,
        o.created_at
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN vendors v ON o.vendor_id = v.id
      JOIN users u ON v.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    res.json(orders);
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   BLOCK / UNBLOCK PRODUCT
========================= */
export const toggleProductStatus = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    if (!Number.isFinite(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const [[product]] = await db.execute(
      "SELECT status FROM products WHERE id=?",
      [productId]
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newStatus = product.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

    await db.execute("UPDATE products SET status=? WHERE id=?", [
      newStatus,
      productId,
    ]);

    res.json({
      message: `Product ${newStatus}`,
    });
  } catch (error) {
    console.error("TOGGLE PRODUCT STATUS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSalesStats = async (req, res) => {
  try {
    const [[stats]] = await db.execute(`
      SELECT
        COUNT(id) AS totalOrders,
        SUM(total_price) AS totalRevenue
      FROM orders
    `);

    const [[vendors]] = await db.execute(`
      SELECT COUNT(*) AS activeVendors
      FROM vendors
      WHERE approved = 1
    `);

    res.json({
      totalOrders: stats.totalOrders || 0,
      totalRevenue: stats.totalRevenue || 0,
      totalVendors: vendors.activeVendors || 0,
    });
  } catch (error) {
    console.error("GET SALES STATS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   CREATE ORDER (ADMIN)
   Creates an order for a product from a vendor
========================= */
export const createOrder = async (req, res) => {
  try {
    const { product_id, vendor_id, quantity } = req.body || {};

    // Validate input
    const productId = Number(product_id);
    const vendorId = Number(vendor_id);
    const orderQuantity = Number(quantity);

    if (!Number.isFinite(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    if (!Number.isFinite(vendorId) || vendorId <= 0) {
      return res.status(400).json({ message: "Invalid vendor id" });
    }
    if (!Number.isFinite(orderQuantity) || orderQuantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be a positive number" });
    }

    // Check if product exists and is ACTIVE
    const [[product]] = await db.execute(
      "SELECT id, price, vendor_id, status FROM products WHERE id=?",
      [productId]
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status !== "ACTIVE") {
      return res.status(400).json({ message: "Product is not active" });
    }

    // Verify product belongs to the specified vendor
    if (product.vendor_id !== vendorId) {
      return res
        .status(400)
        .json({ message: "Product does not belong to this vendor" });
    }

    // Check if vendor exists and is approved
    const [[vendor]] = await db.execute(
      "SELECT id, approved FROM vendors WHERE id=?",
      [vendorId]
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (!vendor.approved) {
      return res.status(400).json({ message: "Vendor is not approved" });
    }

    // Calculate total price
    const totalPrice = product.price * orderQuantity;

    // Create order using Order model
    const orderId = await Order.create(
      vendorId,
      productId,
      orderQuantity,
      totalPrice
    );

    // Fetch created order with details
    const [[createdOrder]] = await db.execute(
      `
      SELECT
        o.id,
        o.vendor_id,
        o.product_id,
        o.quantity,
        o.total_price,
        o.created_at,
        p.name AS product_name,
        u.name AS vendor_name
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN vendors v ON o.vendor_id = v.id
      JOIN users u ON v.user_id = u.id
      WHERE o.id = ?
      `,
      [orderId]
    );

    res.status(201).json({
      message: "Order created successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
