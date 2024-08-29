// src/components/Header.jsx

import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './Header.css'; // Import the custom CSS file for additional styles

const Header = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="d-flex justify-content-center align-items-center">
        <Nav className="flex-grow-1 d-flex justify-content-end">
          <Nav.Link as={NavLink} to="/patrimoine" className="nav-link-small">Visualiser Votre Patrimoine</Nav.Link>
        </Nav>
        
        {/* Make Navbar.Brand clickable by using NavLink */}
        <Navbar.Brand as={NavLink} to="/" className="mx-3 brand-large">
          myPATRI-MOINE
        </Navbar.Brand>
        
        <Nav className="flex-grow-1 d-flex justify-content-start">
          <Nav.Link as={NavLink} to="/possessions" className="nav-link-small">Gérer Vos Possessions</Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
};

export default Header;
