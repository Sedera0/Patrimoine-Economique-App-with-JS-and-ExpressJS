// src/components/WelcomePage/WelcomePage.jsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './WelcomePage.css'; // Import the custom CSS file for additional styles

const WelcomePage = () => {
  return (
    <Container fluid className="welcome-container">
      <Row className="justify-content-center align-items-center text-center welcome-content">
        <Col md={8}>
          <h1 className="display-4 welcome-title">Bienvenue sur myPATRI-MOINE</h1>
          <p className="lead welcome-subtitle">Parce que votre richesse mérite d'être monastérisée!</p>
        </Col>
      </Row>
    </Container>
  );
};

export default WelcomePage;
