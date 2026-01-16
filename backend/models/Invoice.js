import db from "../config/db.js";

const Invoice = {
  create: async (orderId, filePath) => {
    try {
      const [result] = await db.execute(
        "INSERT INTO invoices (order_id,file_path) VALUES (?,?)",
        [orderId, filePath]
      );
      return result.insertId;
    } catch (error) {
      console.error("INVOICE CREATE ERROR:", error);
      throw error;
    }
  },

  findByOrderId: async (orderId) => {
    try {
      const [[invoice]] = await db.execute(
        "SELECT * FROM invoices WHERE order_id=?",
        [orderId]
      );
      return invoice;
    } catch (error) {
      console.error("FIND INVOICE BY ORDER ID ERROR:", error);
      throw error;
    }
  },
};

export default Invoice;
