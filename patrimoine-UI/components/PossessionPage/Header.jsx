// src/components/Header.jsx

import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';


const Header = () => {
  return (
    <>
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={NavLink} to="/">My Patri-Moine</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/patrimoine">Menu Patrimoine</Nav.Link>
          <Nav.Link as={NavLink} to="/possessions">Menu Possessions</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    </>
  );
};

export default Header;
