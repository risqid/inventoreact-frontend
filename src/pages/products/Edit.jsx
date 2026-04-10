import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProducts, updateProduct } from '../../api/products';
import { getCategories } from '../../api/categories';

export default function Edit() {
    const { id }   = useParams();
    const navigate = useNavigate();

    const [form, setForm]             = useState({ category_id: '', name: '', description: '', price: '', stock: '' });
    const [categories, setCategories] = useState([]);
    const [errors, setErrors]         = useState({});
    const [loading, setLoading]       = useState(false);
    const [fetching, setFetching]     = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    getProducts(),
                    getCategories(),
                ]);
                const product = productsRes.data.find(p => p.id === parseInt(id));
                if (product) {
                    setForm({
                        category_id: product.category_id,
                        name:        product.name,
                        description: product.description ?? '',
                        price:       product.price,
                        stock:       product.stock,
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
            navigate('/products');
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
            <h1>Edit Product</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Category</label><br />
                    <select name="category_id" value={form.category_id} onChange={handleChange}>
                        <option value="">Select category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <p style={{ color: 'red' }}>{errors.category_id[0]}</p>}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Name</label><br />
                    <input name="name" value={form.name} onChange={handleChange} />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Description</label><br />
                    <textarea name="description" value={form.description} onChange={handleChange} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Price</label><br />
                    <input type="number" name="price" value={form.price} onChange={handleChange} />
                    {errors.price && <p style={{ color: 'red' }}>{errors.price[0]}</p>}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Stock</label><br />
                    <input type="number" name="stock" value={form.stock} onChange={handleChange} />
                    {errors.stock && <p style={{ color: 'red' }}>{errors.stock[0]}</p>}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Update'}
                </button>
                {' '}
                <Link to="/products">Cancel</Link>
            </form>
        </div>
    );
}