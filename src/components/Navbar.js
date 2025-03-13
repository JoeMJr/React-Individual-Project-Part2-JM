// Updated code for Navbar.js
import React from 'react';
import './OtherNav.css';
import {Link} from "react-router-dom";
import { FaFilm } from "react-icons/fa";
import { BiSolidCameraMovie } from "react-icons/bi";
import { MdMovie } from "react-icons/md";
import { IoPerson } from "react-icons/io5";


function Navbar() {
  return (
    <div className='navigation-menu'>
        <div>
        <ol> 
            <li className="nav-item-root"><BiSolidCameraMovie className="nav-icon"/><b>IndiviFilms</b></li>
            <li className="nav-item"><MdMovie className="nav-icon"/><Link to={"/landing"}>Landing</Link></li>
            <li className="nav-item"><IoPerson className="nav-icon"/><Link to={"/customer"}>Customer</Link></li>
            <li className="nav-item"><FaFilm className="nav-icon" /><Link to={"/film"}>Film</Link></li>
        </ol>
        </div>
    </div>

  )
}

export default Navbar