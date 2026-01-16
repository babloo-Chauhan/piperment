import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import vendorRoutes from "./routes/vendor.route.js";
import adminRoutes from "./routes/admin.route.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const isDev = process.env.NODE_ENV !== "production";

/*MIDDLEWARE (ORDER MATTERS) */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ ADD THIS

/* DEBUG (dev only) */
if (isDev) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, { body: req.body });
    next();
  });
  console.log("DB_HOST =", process.env.DB_HOST);
  console.log("DB_USER =", process.env.DB_USER);
  console.log("DB_NAME =", process.env.DB_NAME);
}

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);

/* SERVER */
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
