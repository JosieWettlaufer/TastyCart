import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";
import { authService } from "../services/authService";

const LoginForm = ({ setUser, isAdmin = false }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAdmin) {
        const res = await authService.adminLogin(credentials);
        setUser(res.user);
        alert("Login successful!");
        navigate("/admin");
      } else {
        const res = await authService.login(credentials);
        setUser(res.user);
        alert("Login successful!");
        navigate("/productspage");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="container mt-4 p-4 border rounded shadow-sm"
      >
        <h2 className="mb-3">{isAdmin ? "Admin Login" : "Login"}</h2>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            name="username"
            id="username"
            placeholder="Enter username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            placeholder="Enter password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      
      {isAdmin ? (
        <Link to="/admin/register">Don't have an account? Register Here</Link>
      ) : (
        <Link to="/register">Don't have an account? Register Here</Link>
      )}
    </div>
  );
};

export default LoginForm;