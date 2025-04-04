import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Cart from "./components/Cart";
import NotFound from "./components/NotFound"; 
import CheckoutForm from "./components/CheckoutForm";
import Return from "./components/Return";
import ProductsPage from "./components/ProductsPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import AdminRegister from "./components/AdminRegister";

const App = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Convert back to object
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <Router>
      <div className="container-fluid p-0">
        {/* Pass user/setUser to Header for conditional rendering, logging out */}
        <Header setUser={setUser} user={user} />{" "}
        
        <div className="container mt-3">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin login/register */}
            <Route path="admin/register" element={<AdminRegister />} />
            <Route path="admin/login" element={<AdminLogin setUser={setUser} />} />

            {/* Protected Routes (User)*/}
            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/productspage" element={<ProductsPage setUser={setUser} />} />
              <Route path="/cart" element={<Cart user={user} />} />
              <Route path="/return" element={<Return user={user} />} />
              <Route path="/cart/checkout" element={<CheckoutForm />} />
            </Route>

            {/* Protected Routes (Admin) */}
            <Route element={<ProtectedRoute user={user} requireAdmin={true} />}>
              <Route path="/admin" element={<AdminDashboard setUser={setUser} />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
