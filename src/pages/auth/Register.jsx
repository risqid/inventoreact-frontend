import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const navigate     = useNavigate();

    const [form, setForm]       = useState({ name: '', email: '', password: '', password_confirmation: '' });
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
            await register(form);
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
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h1 style={{ marginBottom: '1.5rem' }}>Register</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Name</label><br />
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email</label><br />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Password</label><br />
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password[0]}</p>}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Confirm Password</label><br />
                    <input
                        type="password"
                        name="password_confirmation"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}