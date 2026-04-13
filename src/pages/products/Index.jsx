import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts, deleteProduct, updateStock } from "../../api/products";

export default function Index() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingStock, setEditingStock] = useState(null);
    const [stockValue, setStockValue] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
        } catch (err) {
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteProduct(id);
            setProducts(products.filter((p) => p.id !== id));
        } catch (err) {
            alert("Failed to delete product.");
        }
    };

    const handleStockUpdate = async (id) => {
        try {
            const response = await updateStock(id, {
                stock: parseInt(stockValue),
            });
            setProducts(products.map((p) => (p.id === id ? response.data : p)));
            setEditingStock(null);
            setStockValue("");
        } catch (err) {
            alert("Failed to update stock.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <Link
                    to="/products/create"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg font-medium text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    + New Product
                </Link>
            </div>

            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {product.category.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        Rp{" "}
                                        {Number(product.price).toLocaleString(
                                            "id-ID",
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {editingStock === product.id ? (
                                            <>
                                                <input
                                                    type="number"
                                                    value={stockValue}
                                                    onChange={(e) =>
                                                        setStockValue(
                                                            e.target.value,
                                                        )
                                                    }
                                                    style={{ width: "80px" }}
                                                />{" "}
                                                <button
                                                    onClick={() =>
                                                        handleStockUpdate(
                                                            product.id,
                                                        )
                                                    }
                                                >
                                                    Update
                                                </button>{" "}
                                                <button
                                                    onClick={() =>
                                                        setEditingStock(null)
                                                    }
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {product.stock === 0 ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Out of stock
                                                    </span>
                                                ) : (
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock <= 10 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                                                    >
                                                        {product.stock} units
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setEditingStock(
                                                            product.id,
                                                        );
                                                        setStockValue(
                                                            product.stock,
                                                        );
                                                    }}
                                                    className="ml-2 text-xs text-indigo-600 hover:text-indigo-900 underline"
                                                >
                                                    Update
                                                </button>
                                            </>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm">
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/products/${product.id}/edit`,
                                                )
                                            }
                                            className="text-indigo-600 hover:text-indigo-900 font-medium mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(product.id)
                                            }
                                            className="text-red-600 hover:text-red-900 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
