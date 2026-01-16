import db from "../config/db.js";

const Product = {
  create: async (vendorId, name, price) => {
    try {
      const [result] = await db.execute(
        "INSERT INTO products (vendor_id,name,price,status) VALUES (?,?,?,?)",
        [vendorId, name, price, "ACTIVE"]
      );
      return result.insertId;
    } catch (error) {
      console.error("PRODUCT CREATE ERROR:", error);
      throw error;
    }
  },

  findByVendor: async (vendorId) => {
    try {
      const [products] = await db.execute(
        "SELECT * FROM products WHERE vendor_id=? ORDER BY created_at DESC",
        [vendorId]
      );
      return products;
    } catch (error) {
      console.error("FIND PRODUCTS BY VENDOR ERROR:", error);
      throw error;
    }
  },

  findById: async (productId) => {
    try {
      const [[product]] = await db.execute(
        "SELECT * FROM products WHERE id=?",
        [productId]
      );
      return product;
    } catch (error) {
      console.error("FIND PRODUCT BY ID ERROR:", error);
      throw error;
    }
  },

  update: async (productId, name, price) => {
    try {
      await db.execute("UPDATE products SET name=?, price=? WHERE id=?", [
        name,
        price,
        productId,
      ]);
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);
      throw error;
    }
  },

  block: async (productId) => {
    try {
      await db.execute("UPDATE products SET status='BLOCKED' WHERE id=?", [
        productId,
      ]);
    } catch (error) {
      console.error("BLOCK PRODUCT ERROR:", error);
      throw error;
    }
  },
};

export default Product;
