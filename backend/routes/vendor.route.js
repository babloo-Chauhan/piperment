import express from "express";
import auth from "../middlewares/auth.middleware.js";
import vendor from "../middlewares/vendor.middleware.js";
import {
  addProduct,
  myProducts,
  updateProduct,
  myOrders,
  downloadInvoice,
} from "../controllers/vendor.controller.js";

const router = express.Router();

router.post("/product", auth, vendor, addProduct);
router.put("/product/:id", auth, vendor, updateProduct);
router.get("/products", auth, vendor, myProducts);
router.get("/orders", auth, vendor, myOrders);
router.get("/invoice/:orderId", auth, vendor, downloadInvoice);

export default router;
