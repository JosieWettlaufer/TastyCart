import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, setUser }) => {
    const navigate = useNavigate();
    
    if (!user) {
        return <div>Error loading user</div>;
    }
    
    return (
        <div className="container">
            <div className="card mt-4 p-4">
                <h2>Welcome, {user.username}!</h2>
                <p>You have successfully logged in.</p>
                
                {/* User profile information */}
                <div className="mt-3 mb-4">
                    <h4>Your Profile</h4>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;