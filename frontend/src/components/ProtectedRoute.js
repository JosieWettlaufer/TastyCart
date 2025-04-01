import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ user }) => {
    const token = localStorage.getItem("token"); // Check if token exists
    return token ? <Outlet context={{ user }}/> : <Navigate to="/login" />;
};

const AdminRoute = ({ user }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="admin/login" />;
    }

    try {
        const decoded = jwtDecode(token);

        if (decoded.role !== "admin") {
            return <Navigate to="admin/login" />;
        }

        return <Outlet context={{ user }} />;
    } catch (error) {
        localStorage.removeItem("token");
        return <Navigate to="admin/login" />;
    }
};

export { ProtectedRoute, AdminRoute }
