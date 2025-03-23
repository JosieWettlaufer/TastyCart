import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5690/register", user);
      alert("Registered successfully!");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4 p-4 border rounded shadow-sm">
      <h2 className="mb-3">Register New User</h2>

      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input 
          type="text" 
          className="form-control" 
          id="username" 
          name="username" 
          placeholder="Enter username" 
          onChange={handleChange} 
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input 
          type="email" 
          className="form-control" 
          id="email" 
          name="email" 
          placeholder="Enter email" 
          onChange={handleChange} 
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input 
          type="password" 
          className="form-control" 
          id="password" 
          name="password" 
          placeholder="Enter password" 
          onChange={handleChange} 
        />
      </div>
      
      <button type="submit" className="btn btn-primary">Register</button>
    </form>
  );
};

export default Register;
