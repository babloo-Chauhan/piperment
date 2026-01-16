import { Navigate } from "react-router-dom";

export default function VendorRoute({ children }) {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role === "VENDOR" ? children : <Navigate to="/login" />;
}
