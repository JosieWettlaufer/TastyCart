import React from 'react';
import { useLocation } from 'react-router-dom';  // Import useLocation

function Header() {
  const location = useLocation();  // Get the current location (route)

  // Conditional header content based on the current route
  const renderHeader = () => {
    if (location.pathname === '/register') {
      return <h1>Register for an Account</h1>;
    } else if (location.pathname === '/login') {
      return <h1>Welcome Back! Please Login</h1>;
    } else {
      return <h1>My Application</h1>;  // Default header
    }
  };

  return (
    <header>
        {renderHeader()}  {/* Render the header based on the current route */}

      <nav>
        <ul>
          <li><a href="./register">Register</a></li>
          <li><a href="./login">Login</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
