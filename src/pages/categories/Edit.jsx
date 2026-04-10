import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCategories, updateCategory } from '../../api/categories';

export default function Edit() {
    const { id }       = useParams();
    const navigate     = useNavigate();

    const [form, setForm]       = useState({ name: '', description: '' });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await getCategories();
                const category = response.data.find(c => c.id === parseInt(id));
                if (category) {
                    setForm({ name: category.name, description: category.description ?? '' });
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
            navigate('/categories');
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
        <div style={{ maxWidth: '600px' }}>
            <h1>Edit Category</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Name</label><br />
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Description</label><br />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Update'}
                </button>
                {' '}
                <Link to="/categories">Cancel</Link>
            </form>
        </div>
    );
}