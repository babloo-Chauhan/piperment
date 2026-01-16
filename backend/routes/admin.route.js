import express from "express";
import auth from "../middlewares/auth.middleware.js";
import admin from "../middlewares/admin.middleware.js";
import {
  toggleVendorApproval,
  toggleProductStatus,
  getAllVendors,
  getAllProducts,
  getSalesStats,
  getAllOrders,
  createOrder,
} from "../controllers/admin.controller.js";

const router = express.Router();

/* ===== VENDOR ===== */
router.get("/vendors", auth, admin, getAllVendors);
router.put("/vendor-toggle/:id", auth, admin, toggleVendorApproval);

/* ===== PRODUCT ===== */
router.get("/products", auth, admin, getAllProducts);
router.put("/product-toggle/:id", auth, admin, toggleProductStatus);

/* ===== ORDERS ===== */
router.get("/orders", auth, admin, getAllOrders);
router.post("/orders", auth, admin, createOrder);

router.get("/sales", auth, admin, getSalesStats);

export default router;
