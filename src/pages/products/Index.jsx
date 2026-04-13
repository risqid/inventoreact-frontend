import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts, deleteProduct, updateStock } from "../../api/products";

export default function Index() {
    const queryClient = useQueryClient();
    const [editingStock, setEditingStock] = useState(null);
    const [stockValue, setStockValue] = useState("");
    const navigate = useNavigate();

    // Fetch products
    const {
        data: response,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    });

    const products = response?.data ?? [];

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    // Stock update mutation
    const stockMutation = useMutation({
        mutationFn: ({ id, stock }) => updateStock(id, { stock }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            setEditingStock(null);
            setStockValue("");
        },
    });

    const handleDelete = (id) => {
        if (!confirm("Are you sure?")) return;
        deleteMutation.mutate(id);
    };

    const handleStockUpdate = (id) => {
        stockMutation.mutate({ id, stock: parseInt(stockValue) });
    };

    if (isLoading)
        return <p className="p-8 text-center text-gray-500">Loading...</p>;
    if (isError)
        return (
            <p className="p-8 text-center text-red-500">
                Failed to load products.
            </p>
        );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <Link to="/products/create">
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                        + New Product
                    </button>
                </Link>
            </div>

            {products.length === 0 ? (
                <p className="text-gray-500">No products found.</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gray-50"
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
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={stockValue}
                                                    onChange={(e) =>
                                                        setStockValue(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                                                />
                                                <button
                                                    onClick={() =>
                                                        handleStockUpdate(
                                                            product.id,
                                                        )
                                                    }
                                                    disabled={
                                                        stockMutation.isPending
                                                    }
                                                    className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                                                >
                                                    {stockMutation.isPending
                                                        ? "Saving..."
                                                        : "Save"}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setEditingStock(null)
                                                    }
                                                    className="text-xs bg-gray-300 px-2 py-1 rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        product.stock === 0
                                                            ? "bg-red-100 text-red-800"
                                                            : product.stock < 5
                                                              ? "bg-yellow-100 text-yellow-800"
                                                              : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {product.stock === 0
                                                        ? "Out of stock"
                                                        : `${product.stock} units`}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        setEditingStock(
                                                            product.id,
                                                        );
                                                        setStockValue(
                                                            product.stock,
                                                        );
                                                    }}
                                                    className="text-xs text-indigo-600 hover:underline"
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/products/${product.id}/edit`,
                                                )
                                            }
                                            className="text-indigo-600 hover:underline mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(product.id)
                                            }
                                            disabled={deleteMutation.isPending}
                                            className="text-red-600 hover:underline"
                                        >
                                            {deleteMutation.isPending
                                                ? "Deleting..."
                                                : "Delete"}
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
