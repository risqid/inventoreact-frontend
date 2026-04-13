import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProducts, updateProduct } from "../../api/products";
import { getCategories } from "../../api/categories";

export default function Edit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        category_id: "",
        name: "",
        description: "",
        price: "",
        stock: "",
    });
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    getProducts(),
                    getCategories(),
                ]);
                const product = productsRes.data.find(
                    (p) => p.id === parseInt(id),
                );
                if (product) {
                    setForm({
                        category_id: product.category_id,
                        name: product.name,
                        description: product.description ?? "",
                        price: product.price,
                        stock: product.stock,
                    });
                }
                setCategories(categoriesRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setFetching(false);
            }
        };
        load();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await updateProduct(id, form);
            navigate("/products");
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <p>Loading...</p>;

    return (
        <div className="max-w-xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Edit Product
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.category_id}
                        </p>
                    )}
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price
                        </label>
                        <input
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.price && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.price}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock
                        </label>
                        <input
                            name="stock"
                            type="number"
                            value={form.stock}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.stock && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.stock}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg font-medium text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Saving..." : "Update"}
                    </button>
                    <Link
                        to="/products"
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
