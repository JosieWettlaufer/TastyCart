import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
      setUser(JSON.parse(storedUser)); // Convert back to object
    }
  }, []);

  return (
    <Router>

      <Header />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser}/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
