import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/register", form);
            alert("Registered! Wait for admin approval");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">

                {/* Title */}
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Create Account
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    Register as Vendor
                </p>

                {/* Form */}
                <form onSubmit={submit} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Register
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-600 mt-6 text-sm">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-indigo-600 cursor-pointer font-semibold"
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}
