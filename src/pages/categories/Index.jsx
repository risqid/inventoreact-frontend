import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories, deleteCategory } from '../../api/categories';

export default function Index() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);
    const navigate                    = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (err) {
            setError('Failed to load categories.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
        } catch (err) {
            alert('Failed to delete category.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error)   return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h1>Categories</h1>
                <Link to="/categories/create">
                    <button>+ New Category</button>
                </Link>
            </div>

            {categories.length === 0 ? <p>No categories found.</p> : (
                <table border="1" cellPadding="8" width="100%">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Products</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td>{category.name}</td>
                                <td>{category.description ?? '—'}</td>
                                <td>{category.products_count}</td>
                                <td>
                                    <button onClick={() => navigate(`/categories/${category.id}/edit`)}>Edit</button>
                                    {' | '}
                                    <button onClick={() => handleDelete(category.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}