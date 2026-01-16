import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

export default function AdminDashboard() {
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [tab, setTab] = useState("vendors");
    const [loading, setLoading] = useState(false);

    /* 🔍 Search */
    const [vendorSearch, setVendorSearch] = useState("");
    const [productSearch, setProductSearch] = useState("");

    useEffect(() => {
        fetchVendors();
        fetchProducts();
    }, []);

    /* ======================
       API CALLS
    ====================== */

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/vendors");
            setVendors(res.data);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/products");
            setProducts(res.data);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/orders");
            setOrders(res.data);
        } finally {
            setLoading(false);
        }
    };

    const toggleVendor = async (id) => {
        await api.put(`/admin/vendor-toggle/${id}`);
        fetchVendors();
    };

    const toggleProduct = async (id) => {
        await api.put(`/admin/product-toggle/${id}`);
        fetchProducts();
    };

    /* ======================
       SEARCH FILTERS
    ====================== */

    const filteredVendors = useMemo(() => {
        return vendors.filter(
            (v) =>
                v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
                v.email.toLowerCase().includes(vendorSearch.toLowerCase())
        );
    }, [vendors, vendorSearch]);

    const filteredProducts = useMemo(() => {
        return products.filter((p) =>
            p.name.toLowerCase().includes(productSearch.toLowerCase())
        );
    }, [products, productSearch]);

    /* ======================
       UI
    ====================== */

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Admin Dashboard
                </h1>

                <div className="flex gap-3 mt-4 md:mt-0">
                    {["vendors", "products", "orders"].map((t) => (
                        <button
                            key={t}
                            onClick={() => {
                                setTab(t);
                                if (t === "orders") fetchOrders();
                            }}
                            className={`px-4 py-2 rounded-lg font-semibold ${tab === t
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white text-gray-700"
                                }`}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* ======================
          VENDORS
      ====================== */}
            {tab === "vendors" && (
                <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-xl font-semibold">Vendor Management</h2>
                        <input
                            placeholder="Search vendor..."
                            value={vendorSearch}
                            onChange={(e) => setVendorSearch(e.target.value)}
                            className="px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="p-2">ID</th>
                                <th className="p-2">Name</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVendors.map((v) => (
                                <tr key={v.id} className="border-b">
                                    <td className="p-2">{v.id}</td>
                                    <td className="p-2 font-semibold">{v.name}</td>
                                    <td className="p-2">{v.email}</td>
                                    <td className="p-2">
                                        <span
                                            className={`font-semibold ${v.approved ? "text-green-600" : "text-red-500"
                                                }`}
                                        >
                                            {v.approved ? "Approved" : "De-Approved"}
                                        </span>
                                    </td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => toggleVendor(v.id)}
                                            className={`px-3 py-1 rounded text-white ${v.approved
                                                    ? "bg-red-600 hover:bg-red-700"
                                                    : "bg-green-600 hover:bg-green-700"
                                                }`}
                                        >
                                            {v.approved ? "De-Approve" : "Approve"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ======================
          PRODUCTS
      ====================== */}
            {tab === "products" && (
                <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-xl font-semibold">Product Management</h2>
                        <input
                            placeholder="Search product..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="p-2">Name</th>
                                <th className="p-2">Vendor</th>
                                <th className="p-2">Price</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((p) => (
                                <tr key={p.id} className="border-b">
                                    <td className="p-2 font-semibold">{p.name}</td>
                                    <td className="p-2">{p.vendor_id}</td>
                                    <td className="p-2">₹{p.price}</td>
                                    <td className="p-2">
                                        <span
                                            className={`font-semibold ${p.status === "ACTIVE"
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                }`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => toggleProduct(p.id)}
                                            className={`px-3 py-1 rounded text-white ${p.status === "ACTIVE"
                                                    ? "bg-red-600 hover:bg-red-700"
                                                    : "bg-green-600 hover:bg-green-700"
                                                }`}
                                        >
                                            {p.status === "ACTIVE" ? "Block" : "Unblock"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ======================
          ORDERS
      ====================== */}
            {tab === "orders" && (
                <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-4">Order List</h2>

                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="p-2">Order ID</th>
                                <th className="p-2">Product</th>
                                <th className="p-2">Vendor</th>
                                <th className="p-2">Qty</th>
                                <th className="p-2">Total</th>
                                <th className="p-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id} className="border-b">
                                    <td className="p-2">{o.id}</td>
                                    <td className="p-2 font-semibold">{o.product_name}</td>
                                    <td className="p-2">{o.vendor_name}</td>
                                    <td className="p-2">{o.quantity}</td>
                                    <td className="p-2 font-semibold">₹{o.total_price}</td>
                                    <td className="p-2">
                                        {new Date(o.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="bg-white px-6 py-3 rounded shadow">
                        Loading...
                    </div>
                </div>
            )}
        </div>
    );
}
