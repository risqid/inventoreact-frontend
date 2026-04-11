import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <nav
            style={{
                background: "#1e293b",
                padding: "1rem 2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <div style={{ display: "flex", gap: "1.5rem" }}>
                <Link
                    to="/dashboard"
                    style={{
                        color: isActive("/dashboard") ? "white" : "#a78bfa",
                        fontWeight: isActive("/dashboard") ? "bold" : "normal",
                        textDecoration: "none",
                    }}
                >
                    Dashboard
                </Link>
                <Link
                    to="/categories"
                    style={{
                        color: isActive("/categories") ? "white" : "#a78bfa",
                        fontWeight: isActive("/categories") ? "bold" : "normal",
                        textDecoration: "none",
                    }}
                >
                    Categories
                </Link>
                <Link
                    to="/products"
                    style={{
                        color: isActive("/products") ? "white" : "#a78bfa",
                        fontWeight: isActive("/products") ? "bold" : "normal",
                        textDecoration: "none",
                    }}
                >
                    Products
                </Link>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ color: "#94a3b8" }}>{user?.name}</span>
                <button
                    onClick={handleLogout}
                    style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
