import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';  // Import useLocation
import '../static/Navbar.css';

function Header( { setUser } ) {
  const location = useLocation();  // Get the current location (route)
  const navigate = useNavigate();


  //handles logout
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  //show logout link
  const showLogout = () => {
    if (location.pathname !== '/register' && location.pathname !== '/login' && location.pathname !== '/dashboard') {
      return <a className="nav-link text-danger" 
        href="./login"
        onClick={(e) => {
          e.preventDefault();
          handleLogout();
        }}>Logout</a>
    }
  }

  return (
    <header className='text-center'>
      

        {/*Navigation links*/}
        <nav className='navbar'>
            {/*Logo*/}
            <div className="logo">
                <Link to="/">TastyCart</Link>
            </div>


          <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li> { showLogout() }</li>
          </ul>
        </nav>
    </header>
  );
}

export default Header;
