import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    /* 1️ Validate body */
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Validate name
    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (!trimmedName || trimmedName.length < 2) {
      return res
        .status(400)
        .json({ message: "Name must be at least 2 characters" });
    }

    /* 2️ Check existing user */
    const [[existingUser]] = await db.execute(
      "SELECT id FROM users WHERE email=?",
      [email.toLowerCase().trim()]
    );

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    /* 3️ Hash password */
    const hash = await bcrypt.hash(password, 10);

    /* 4️ Insert user */
    const [result] = await db.execute(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      [trimmedName, email.toLowerCase().trim(), hash, "VENDOR"]
    );

    /* 5️ Insert vendor */
    await db.execute("INSERT INTO vendors (user_id, approved) VALUES (?,?)", [
      result.insertId,
      false,
    ]);

    return res.status(201).json({
      message: "Vendor registered, waiting for admin approval",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    /* 1️ Fetch user */
    const [[user]] = await db.execute("SELECT * FROM users WHERE email=?", [
      email.toLowerCase().trim(),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* 2️ Compare password */
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    /* 3️ Generate token */
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT id, name, email, role, created_at FROM users"
    );

    res.json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
