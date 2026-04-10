import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

import Login           from './pages/auth/Login';
import Register        from './pages/auth/Register';
import CategoryIndex   from './pages/categories/Index';
import CategoryCreate  from './pages/categories/Create';
import CategoryEdit    from './pages/categories/Edit';
import ProductIndex    from './pages/products/Index';
import ProductCreate   from './pages/products/Create';
import ProductEdit     from './pages/products/Edit';

function Layout({ children }) {
    return (
        <div>
            <Navbar />
            <main style={{ padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
}

function AppRoutes() {
    const { token } = useAuth();

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login"    element={!token ? <Login />    : <Navigate to="/categories" />} />
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/categories" />} />

            {/* Protected routes */}
            <Route path="/categories" element={
                <PrivateRoute>
                    <Layout><CategoryIndex /></Layout>
                </PrivateRoute>
            } />
            <Route path="/categories/create" element={
                <PrivateRoute>
                    <Layout><CategoryCreate /></Layout>
                </PrivateRoute>
            } />
            <Route path="/categories/:id/edit" element={
                <PrivateRoute>
                    <Layout><CategoryEdit /></Layout>
                </PrivateRoute>
            } />
            <Route path="/products" element={
                <PrivateRoute>
                    <Layout><ProductIndex /></Layout>
                </PrivateRoute>
            } />
            <Route path="/products/create" element={
                <PrivateRoute>
                    <Layout><ProductCreate /></Layout>
                </PrivateRoute>
            } />
            <Route path="/products/:id/edit" element={
                <PrivateRoute>
                    <Layout><ProductEdit /></Layout>
                </PrivateRoute>
            } />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to={token ? "/categories" : "/login"} />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}