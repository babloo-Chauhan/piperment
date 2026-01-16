import { useState } from "react";
import api from "../../api/axios";

export default function AddProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        await api.post("/vendor/product", { name, price });
        alert("Product added");
    };

    return (
        <form onSubmit={submit}>
            <input placeholder="Product name" onChange={e => setName(e.target.value)} />
            <input placeholder="Price" onChange={e => setPrice(e.target.value)} />
            <button>Add</button>
        </form>
    );
}
