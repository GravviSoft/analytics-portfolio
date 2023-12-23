import React from 'react';
import { Link } from "react-router-dom";
import logo from "../images/reactlogo.png"


function Navbar() {
  return (
    <nav className="navbar">
      <a className="navbar-brand" href="/public/index.html">
        <img src={logo} className="App-logo" alt="" />
        <Link to="/">Lead Factory</Link>
      </a>
      <ul className="nav justify-content-end">
        <li className="nav-item-first">
          <a href="http://localhost:5000/seed">Seed</a>
        </li>
        <li className="nav-item-first">
          <Link to="/register">Register</Link>
        </li>

        <li className="nav-item">
           <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar