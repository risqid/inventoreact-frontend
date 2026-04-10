import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createCategory } from '../../api/categories';

export default function Create() {
    const navigate = useNavigate();

    const [form, setForm]       = useState({ name: '', description: '' });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await createCategory(form);
            navigate('/categories');
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px' }}>
            <h1>New Category</h1>

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
                    {loading ? 'Saving...' : 'Save'}
                </button>
                {' '}
                <Link to="/categories">Cancel</Link>
            </form>
        </div>
    );
}