import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  // Import useLocation

function Header( { setUser } ) {
  const location = useLocation();  // Get the current location (route)
  const navigate = useNavigate();

  // Conditional header content based on the current route
  const renderHeader = () => {
    if (location.pathname === '/register') {
      return <h1>Register for an Account</h1>;
    } else if (location.pathname === '/login') {
      return <h1>Welcome Back! Please Login</h1>;
    } else {
      return <h1>TastyCart</h1>;  // Default header
    }
  };

  //handles logout
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  //show logout link
  const showLogout = () => {
    if (location.pathname !== '/register' && location.pathname !== '/login') {
      return <a className="nav-link text-danger" 
        href="./login"
        onClick={(e) => {
          e.preventDefault();
          handleLogout();
        }}>Logout</a>
    }
  }

  return (
    <header className='bg-primary text-white p-3'>
      <div className="container d-flex justify-content-between align-items-center">
      {renderHeader()} {/* Render the header based on the current route */}

        <nav>
          <ul className="nav">
            <li className="nav-item">
              <a className="nav-link text-white" href="./register">Register</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="./login">Login</a>
            </li>
            <li>
              { showLogout() }
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
