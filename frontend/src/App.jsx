import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VendorRoute from "./auth/VendorRoute";
import AdminRoute from "./auth/AdminRoute";

export default function App() {
  return (


    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/vendor" element={
          <VendorRoute><VendorDashboard /></VendorRoute>
        } />

        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
