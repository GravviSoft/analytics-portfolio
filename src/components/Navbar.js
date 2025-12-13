import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import logo from "../images/reactlogo.png";
import { baseUrl } from '../constants/globals';


function Navbar() {
  const URL = `${baseUrl}:5023/seed`
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('dashboardTheme') || 'dark';
  });

  useEffect(() => {
    const rootEl = document.documentElement;
    const bodyEl = document.body;
    const toggleClass = themeMode === 'light';

    [rootEl, bodyEl].forEach((el) => {
      if (!el) return;
      if (toggleClass) {
        el.classList.add('light-dashboard');
      } else {
        el.classList.remove('light-dashboard');
      }
    });

    localStorage.setItem('dashboardTheme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="navbar">
      <a className="navbar-brand" href="/public/index.html">
        <img src={logo} className="App-logo" alt="" />
        <Link to="/">Beau Enslow Analytics Portfolio</Link>
      </a>
      <ul className="nav justify-content-end">
        <li className="nav-item-first">
          <Link to="/about">About</Link>
        </li>
        <li className="nav-item-first">
          <a href={URL} >Seed</a>
        </li>
        <li className="nav-item-first">
          <Link to="/register">Register</Link>
        </li>

        <li className="nav-item">
           <Link to="/login">Login</Link>
        </li>
        <li className="nav-item">
          <button className="theme-toggle" onClick={toggleTheme}>
            {themeMode === 'dark' ? '🌞 Light mode' : '🌙 Dark mode'}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar
