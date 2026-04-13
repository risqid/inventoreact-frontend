import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { getCategories, deleteCategory } from "../../api/categories";

export default function Index() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Fetch categories
    const {
        data: response,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const categories = response?.data ?? [];

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        deleteMutation.mutate(id);
    };

    if (isLoading)
        return <p className="p-8 text-center text-gray-500">Loading...</p>;
    if (isError)
        return (
            <p className="p-8 text-center text-red-500">
                Failed to load categories.
            </p>
        );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <Link
                    to="/categories/create"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg font-medium text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    + New Category
                </Link>
            </div>
            {categories.length === 0 ? (
                <p>No categories found.</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Products
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {category.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {category.description ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            {category.products_count} products
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm">
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/categories/${category.id}/edit`,
                                                )
                                            }
                                            className="text-indigo-600 hover:text-indigo-900 font-medium mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(category.id)
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
