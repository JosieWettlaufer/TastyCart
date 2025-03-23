import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from './components/Header';
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Header />
        
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser}/>} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;