import { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

//Recieves 'isAdmin' (optional flag for admin registration) 
const RegisterForm = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "", password: "" });

  //updates credentials when change in input fields
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAdmin) { // adds admin role to user and navigates to admin login
          await authService.adminRegister(user);
          alert("Admin registered successfully");
          navigate('admin/login');
      } else { // creates user with default user role and navigates to user login
        await authService.register(user);
        alert("Registered successfully!");
        navigate('/login')
      }
    } catch (err) {
      alert("Registration failed");
    }
  };


  return (
    <form onSubmit={handleSubmit} className="container mt-4 p-4 border rounded shadow-sm">
      <h2 className="mb-3">Register New {isAdmin ? "Admin" : "User"}</h2>

      {/*Username field*/}
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input 
          type="text" 
          className="form-control" 
          id="username" 
          name="username" 
          placeholder="Enter username" 
          onChange={handleChange} 
          required
        />
      </div>
      
      {/*email field*/}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input 
          type="email" 
          className="form-control" 
          id="email" 
          name="email" 
          placeholder="Enter email" 
          onChange={handleChange} 
          required
        />
      </div>
      
      {/*password field*/}
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input 
          type="password" 
          className="form-control" 
          id="password" 
          name="password" 
          placeholder="Enter password" 
          onChange={handleChange} 
          required
        />
      </div>
      
      <button type="submit" className="btn btn-primary">Register</button>
    </form>
  );
};

export default RegisterForm;
