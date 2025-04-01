import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Combined route component with role checking capability
const ProtectedRoute = ({ user, requireAdmin = false }) => {
    const token = localStorage.getItem("token");
    
    // If no token exists, redirect to appropriate login page
    if (!token) {
        return <Navigate to={requireAdmin ? "/admin/login" : "/login"} />;
    }
    
    // For admin routes, verify the role
    if (requireAdmin) {
        try {
            const decoded = jwtDecode(token);
            
            if (decoded.role !== "admin") {
                return <Navigate to="/admin/login" />;
            }
        } catch (error) {
            // Invalid token, clear it and redirect
            localStorage.removeItem("token");
            return <Navigate to="/admin/login" />;
        }
    }
    
    // Token exists (and role check passed if needed)
    return <Outlet context={{ user }} />;
};

export { ProtectedRoute };