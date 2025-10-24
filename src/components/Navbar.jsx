// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);

  const authLinks = (
    <>
      <li className="nav-item">
        <Link to="/feed" className="nav-links">
          Feed
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/quiz" className="nav-links">
          Quiz
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/leaderboard" className="nav-links">
          Leaderboard
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/profile" className="nav-links">
          Profile
        </Link>
      </li>
      <li className="nav-item-btn">
        <button onClick={logout} className="btn btn-outline">
          Logout
        </button>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="nav-item-btn">
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </li>
      <li className="nav-item-btn">
        <Link to="/register" className="btn btn-outline">
          Register
        </Link>
      </li>
    </>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Syntax|Flow 💻
        </Link>
        <ul className="nav-menu">
          {token ? authLinks : guestLinks}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;