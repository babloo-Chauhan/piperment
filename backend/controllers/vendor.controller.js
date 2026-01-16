import db from "../config/db.js";
import PDFDocument from "pdfkit";

export const addProduct = async (req, res) => {
  try {
    const [[vendor]] = await db.execute(
      "SELECT * FROM vendors WHERE user_id=?",
      [req.user.id]
    );

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    if (!vendor.approved)
      return res.status(403).json({ message: "Vendor not approved" });

    const { name, price } = req.body || {};
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const numericPrice = Number(price);

    if (!trimmedName) {
      return res.status(400).json({ message: "Product name is required" });
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }

    await db.execute(
      "INSERT INTO products (vendor_id,name,price,status) VALUES (?,?,?,?)",
      [vendor.id, trimmedName, numericPrice, "ACTIVE"]
    );

    res.json({ message: "Product added" });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const myProducts = async (req, res) => {
  try {
    const [[vendor]] = await db.execute(
      "SELECT * FROM vendors WHERE user_id=?",
      [req.user.id]
    );
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const [products] = await db.execute(
      "SELECT * FROM products WHERE vendor_id=? ORDER BY created_at DESC",
      [vendor.id]
    );

    res.json(products);
  } catch (error) {
    console.error("MY PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    if (!Number.isFinite(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const [[vendor]] = await db.execute(
      "SELECT * FROM vendors WHERE user_id=?",
      [req.user.id]
    );
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    if (!vendor.approved)
      return res.status(403).json({ message: "Vendor not approved" });

    const [[product]] = await db.execute(
      "SELECT id, vendor_id FROM products WHERE id=?",
      [productId]
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.vendor_id !== vendor.id) {
      return res.status(403).json({ message: "Not your product" });
    }

    const { name, price } = req.body || {};
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const numericPrice = Number(price);

    if (!trimmedName) {
      return res.status(400).json({ message: "Product name is required" });
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }

    await db.execute("UPDATE products SET name=?, price=? WHERE id=?", [
      trimmedName,
      numericPrice,
      productId,
    ]);

    res.json({ message: "Product updated" });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const myOrders = async (req, res) => {
  try {
    const [[vendor]] = await db.execute(
      "SELECT * FROM vendors WHERE user_id=?",
      [req.user.id]
    );
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    // Frontend expects: id, productName, total, status, created_at
    // DB per README: orders(vendor_id, product_id, quantity, total_price, created_at)
    const [orders] = await db.execute(
      `
      SELECT
        o.id,
        p.name AS productName,
        o.quantity,
        o.total_price AS total,
        'COMPLETED' AS status,
        o.created_at
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.vendor_id = ?
      ORDER BY o.created_at DESC
      `,
      [vendor.id]
    );

    res.json(orders);
  } catch (error) {
    console.error("MY ORDERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    if (!Number.isFinite(orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const [[vendor]] = await db.execute(
      "SELECT * FROM vendors WHERE user_id=?",
      [req.user.id]
    );
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const [[order]] = await db.execute(
      `
      SELECT
        o.id,
        o.quantity,
        o.total_price,
        o.created_at,
        p.name AS product_name,
        u.name AS vendor_name
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN vendors v ON o.vendor_id = v.id
      JOIN users u ON v.user_id = u.id
      WHERE o.id = ? AND o.vendor_id = ?
      `,
      [orderId, vendor.id]
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Stream PDF directly (download)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice_order_${order.id}.pdf"`
    );

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    doc.fontSize(18).text("Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Order ID: ${order.id}`);
    doc.text(`Vendor: ${order.vendor_name}`);
    doc.text(`Product: ${order.product_name}`);
    doc.text(`Quantity: ${order.quantity}`);
    doc.text(`Total: ₹${order.total_price}`);
    doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`);

    doc.end();
  } catch (error) {
    console.error("INVOICE ERROR:", error);
    // If headers already sent (streaming), just destroy
    if (res.headersSent) return res.end();
    res.status(500).json({ message: "Server error" });
  }
};
