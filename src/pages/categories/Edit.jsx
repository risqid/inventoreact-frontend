import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCategories, updateCategory } from "../../api/categories";

export default function Edit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", description: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await getCategories();
                const category = response.data.find(
                    (c) => c.id === parseInt(id),
                );
                if (category) {
                    setForm({
                        name: category.name,
                        description: category.description ?? "",
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setFetching(false);
            }
        };
        fetchCategory();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await updateCategory(id, form);
            navigate("/categories");
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
                Edit Category
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
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
                        rows={4}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.description}
                        </p>
                    )}
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
                        to="/categories"
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
