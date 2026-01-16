import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function MyProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get("/vendor/products").then(res => setProducts(res.data));
    }, []);

    return (
        <ul>
            {products.map(p => (
                <li key={p.id}>{p.name} - ₹{p.price}</li>
            ))}
        </ul>
    );
}
