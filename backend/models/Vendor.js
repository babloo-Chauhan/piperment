import db from "../config/db.js";

const Vendor = {
  create: async (userId) => {
    try {
      const [result] = await db.execute(
        "INSERT INTO vendors (user_id, approved) VALUES (?,false)",
        [userId]
      );
      return result.insertId;
    } catch (error) {
      console.error("VENDOR CREATE ERROR:", error);
      throw error;
    }
  },

  findByUserId: async (userId) => {
    try {
      const [[vendor]] = await db.execute(
        "SELECT * FROM vendors WHERE user_id=?",
        [userId]
      );
      return vendor;
    } catch (error) {
      console.error("FIND VENDOR BY USER ID ERROR:", error);
      throw error;
    }
  },

  findById: async (vendorId) => {
    try {
      const [[vendor]] = await db.execute("SELECT * FROM vendors WHERE id=?", [
        vendorId,
      ]);
      return vendor;
    } catch (error) {
      console.error("FIND VENDOR BY ID ERROR:", error);
      throw error;
    }
  },

  approve: async (vendorId) => {
    try {
      await db.execute("UPDATE vendors SET approved=true WHERE id=?", [
        vendorId,
      ]);
    } catch (error) {
      console.error("APPROVE VENDOR ERROR:", error);
      throw error;
    }
  },

  toggleApproval: async (vendorId, approved) => {
    try {
      await db.execute("UPDATE vendors SET approved=? WHERE id=?", [
        approved ? 1 : 0,
        vendorId,
      ]);
    } catch (error) {
      console.error("TOGGLE VENDOR APPROVAL ERROR:", error);
      throw error;
    }
  },
};

export default Vendor;
