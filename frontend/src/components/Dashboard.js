import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, setUser }) => {
    const navigate = useNavigate();
    
    if (!user) {
        return <div>Loading user data...</div>;
    }
    
    const handleLogout = () => {
        localStorage.removeItem("token"); 
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };
    
    return (
        <div className="container">
            <div className="card mt-4 p-4">
                <h2>Welcome, {user.username}!</h2>
                <p>You have successfully logged in.</p>
                
                {/* User profile information */}
                <div className="mt-3 mb-4">
                    <h4>Your Profile</h4>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email || "No email provided"}</p>
                </div>
                
                {/* Logout button */}
                <button 
                    className="btn btn-danger mt-3"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;