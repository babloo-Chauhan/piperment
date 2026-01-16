import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function VendorDashboard() {
    const [activeTab, setActiveTab] = useState("products");
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [editId, setEditId] = useState(null);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    /* ================= DATA FETCH ================= */
    const fetchProducts = async () => {
        const res = await api.get("/vendor/products");
        setProducts(res.data);
    };

    const fetchOrders = async () => {
        const res = await api.get("/vendor/orders");
        setOrders(res.data);
    };

    useEffect(() => {
        // Defer async state updates to a microtask to satisfy strict lint rules
        // that disallow initiating state updates synchronously within effects.
        Promise.resolve().then(() => {
            fetchProducts();
            fetchOrders();
        });
    }, []);

    /* ================= PRODUCTS ================= */

    const addOrUpdateProduct = async (e) => {
        e.preventDefault();

        if (editId) {
            await api.put(`/vendor/product/${editId}`, { name, price });
            setEditId(null);
        } else {
            await api.post("/vendor/product", { name, price });
        }

        setName("");
        setPrice("");
        fetchProducts();
    };

    const editProduct = (p) => {
        setEditId(p.id);
        setName(p.name);
        setPrice(p.price);
    };

    /* ================= ORDERS ================= */

    const downloadInvoice = async (orderId) => {
        try {
            const res = await api.get(`/vendor/invoice/${orderId}`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice_order_${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            alert("Failed to download invoice");
        }
    };

    /* ================= LOGOUT ================= */

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
                <div className="flex gap-4 items-center">
                    <span className="font-semibold">{user?.name}</span>
                    <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                </div>
            </div>

            {/* ================= TABS ================= */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab("products")}
                    className={`px-6 py-2 rounded font-semibold ${activeTab === "products"
                        ? "bg-indigo-600 text-white"
                        : "bg-white border"
                        }`}
                >
                    Products
                </button>

                <button
                    onClick={() => setActiveTab("sales")}
                    className={`px-6 py-2 rounded font-semibold ${activeTab === "sales"
                        ? "bg-indigo-600 text-white"
                        : "bg-white border"
                        }`}
                >
                    Sales
                </button>
            </div>

            {/* ================= PRODUCTS TAB ================= */}
            {activeTab === "products" && (
                <>
                    {/* Add / Update Product */}
                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {editId ? "Update Product" : "Add Product"}
                        </h2>

                        <form onSubmit={addOrUpdateProduct} className="grid md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Price (₹)"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
                            >
                                {editId ? "Update Product" : "Add Product"}
                            </button>
                        </form>
                        {editId && (
                            <button
                                onClick={() => {
                                    setEditId(null);
                                    setName("");
                                    setPrice("");
                                }}
                                className="mt-3 text-gray-600 hover:text-gray-800 text-sm underline"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    {/* Product List */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">My Products</h2>

                        {products.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No products found. Add your first product above.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                                            <th className="text-left p-3 font-semibold text-gray-700">Price</th>
                                            <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                                            <th className="text-left p-3 font-semibold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((p) => (
                                            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="p-3 text-gray-900 font-medium">{p.name}</td>
                                                <td className="p-3 text-gray-700">₹{p.price}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.status === "ACTIVE"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => editProduct(p)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ================= SALES TAB ================= */}
            {activeTab === "sales" && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">My Sales</h2>

                    {orders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No sales orders found yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left p-3 font-semibold text-gray-700">Order ID</th>
                                        <th className="text-left p-3 font-semibold text-gray-700">Product</th>
                                        <th className="text-left p-3 font-semibold text-gray-700">Total</th>
                                        <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                                        <th className="text-left p-3 font-semibold text-gray-700">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((o) => (
                                        <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="p-3 text-gray-900 font-medium">#{o.id}</td>
                                            <td className="p-3 text-gray-700">{o.productName}</td>
                                            <td className="p-3 text-gray-900 font-semibold">₹{o.total}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${o.status === "COMPLETED"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {o.status === "COMPLETED" ? (
                                                    <button
                                                        onClick={() => downloadInvoice(o.id)}
                                                        className="text-indigo-600 hover:text-indigo-800 font-medium underline transition-colors"
                                                    >
                                                        Download
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
