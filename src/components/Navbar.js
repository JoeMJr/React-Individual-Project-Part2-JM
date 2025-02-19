// Updated code for Navbar.js
import React from 'react';
import './Navbar.css';
import {Link} from "react-router-dom";

function Navbar() {
  return (
    <div className='navigation-menu'>
        <ol>
            <li><Link to={"/landing"}>Landing</Link></li>
            <li><Link to={"/customer"}>Customer</Link></li>
            <li><Link to={"/film"}>Film</Link></li>
        </ol>
    </div>

  )
}

export default Navbar