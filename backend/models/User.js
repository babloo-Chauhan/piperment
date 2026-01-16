import db from "../config/db.js";

const User = {
  create: async (name, email, password, role) => {
    try {
      const [result] = await db.execute(
        "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
        [name, email, password, role]
      );
      return result.insertId;
    } catch (error) {
      console.error("USER CREATE ERROR:", error);
      throw error;
    }
  },

  findByEmail: async (email) => {
    try {
      const [[user]] = await db.execute("SELECT * FROM users WHERE email=?", [
        email,
      ]);
      return user;
    } catch (error) {
      console.error("FIND USER BY EMAIL ERROR:", error);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const [[user]] = await db.execute("SELECT * FROM users WHERE id=?", [id]);
      return user;
    } catch (error) {
      console.error("FIND USER BY ID ERROR:", error);
      throw error;
    }
  },
};

export default User;
