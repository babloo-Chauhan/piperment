import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/orders");
            setOrders(res.data);
        } catch {
            alert("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Order List</h1>

            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Product</th>
                            <th className="p-3">Vendor</th>
                            <th className="p-3">Quantity</th>
                            <th className="p-3">Total Price</th>
                            <th className="p-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        )}

                        {orders.map((o) => (
                            <tr key={o.id} className="border-b">
                                <td className="p-3">{o.id}</td>
                                <td className="p-3 font-semibold">{o.product_name}</td>
                                <td className="p-3">{o.vendor_name}</td>
                                <td className="p-3">{o.quantity}</td>
                                <td className="p-3 font-semibold">
                                    ₹{o.total_price}
                                </td>
                                <td className="p-3 text-gray-600">
                                    {new Date(o.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
