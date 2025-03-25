import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from './components/Header';
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from './components/Cart';
import NotFound from './components/NotFound'; // Recommended: Add a 404 page

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    
    setIsLoading(false);
  }, []);

  // If still loading, you might want to show a loading spinner
  if (isLoading) {
    return <div>Loading...</div>; // Or use a more sophisticated loading component
  }

  return (
    <BrowserRouter>
      <div className="container-fluid p-0">
        <Header setUser={setUser} user={user} /> {/* Pass user to Header for conditional rendering */}
        
        <div className="container mt-3">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
              <Route path="/cart" element={<Cart user={user} />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;