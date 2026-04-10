import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct, updateStock } from '../../api/products';

export default function Index() {
    const [products, setProducts]         = useState([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState(null);
    const [editingStock, setEditingStock] = useState(null);
    const [stockValue, setStockValue]     = useState('');
    const navigate                        = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
        } catch (err) {
            setError('Failed to load products.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            alert('Failed to delete product.');
        }
    };

    const handleStockUpdate = async (id) => {
        try {
            const response = await updateStock(id, { stock: parseInt(stockValue) });
            setProducts(products.map(p => p.id === id ? response.data : p));
            setEditingStock(null);
            setStockValue('');
        } catch (err) {
            alert('Failed to update stock.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error)   return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h1>Products</h1>
                <Link to="/products/create">
                    <button>+ New Product</button>
                </Link>
            </div>

            {products.length === 0 ? <p>No products found.</p> : (
                <table border="1" cellPadding="8" width="100%">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.category.name}</td>
                                <td>Rp {Number(product.price).toLocaleString('id-ID')}</td>
                                <td>
                                    {editingStock === product.id ? (
                                        <>
                                            <input
                                                type="number"
                                                value={stockValue}
                                                onChange={e => setStockValue(e.target.value)}
                                                style={{ width: '80px' }}
                                            />
                                            {' '}
                                            <button onClick={() => handleStockUpdate(product.id)}>Update</button>
                                            {' '}
                                            <button onClick={() => setEditingStock(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <span style={{ color: product.stock === 0 ? 'red' : 'inherit' }}>
                                                {product.stock === 0 ? 'Out of stock' : product.stock}
                                            </span>
                                            {' | '}
                                            <button onClick={() => { setEditingStock(product.id); setStockValue(product.stock); }}>
                                                Quick Update
                                            </button>
                                        </>
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => navigate(`/products/${product.id}/edit`)}>Edit</button>
                                    {' | '}
                                    <button onClick={() => handleDelete(product.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}