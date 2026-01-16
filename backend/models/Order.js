import db from "../config/db.js";

const Order = {
  // DB schema in README uses: orders(vendor_id, product_id, quantity, total_price, created_at)
  create: async (vendorId, productId, quantity, totalPrice) => {
    try {
      const [result] = await db.execute(
        "INSERT INTO orders (vendor_id, product_id, quantity, total_price) VALUES (?,?,?,?)",
        [vendorId, productId, quantity, totalPrice]
      );
      return result.insertId;
    } catch (error) {
      console.error("ORDER CREATE ERROR:", error);
      throw error;
    }
  },

  getVendorOrders: async (vendorId) => {
    try {
      const [orders] = await db.execute(
        `SELECT o.* FROM orders o WHERE o.vendor_id=? ORDER BY o.created_at DESC`,
        [vendorId]
      );
      return orders;
    } catch (error) {
      console.error("GET VENDOR ORDERS ERROR:", error);
      throw error;
    }
  },

  findById: async (orderId) => {
    try {
      const [[order]] = await db.execute("SELECT * FROM orders WHERE id=?", [
        orderId,
      ]);
      return order;
    } catch (error) {
      console.error("FIND ORDER BY ID ERROR:", error);
      throw error;
    }
  },
};

export default Order;
