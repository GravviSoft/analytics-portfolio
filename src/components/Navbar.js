import React from 'react';
import { Link } from "react-router-dom";
import logo from "../images/reactlogo.png"
import { baseUrl } from '../constants/globals';


function Navbar() {
  const URL = `${baseUrl}:5023/seed`

  return (
    <nav className="navbar">
      <a className="navbar-brand" href="/public/index.html">
        <img src={logo} className="App-logo" alt="" />
        <Link to="/">Lead Factory</Link>
      </a>
      <ul className="nav justify-content-end">
        <li className="nav-item-first">
          <a href={URL} >Seed</a>
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