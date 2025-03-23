import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ user }) => {
    const token = localStorage.getItem("token"); // Check if token exists
    return token ? <Outlet context={{ user }}/> : <Navigate to="/login" />;
};

export default ProtectedRoute;
