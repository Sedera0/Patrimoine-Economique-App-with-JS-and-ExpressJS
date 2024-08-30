import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/homePage/Header.jsx';
import PossessionPage from '../components/PossessionPage/PossessionPage.jsx';
import PatrimoinePage from '../components/PatrimoinePage/PatrimoinePage.jsx';
import WelcomePage from '../components/homePage/WelcomePage.jsx';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/possessions" element={<PossessionPage />} />
        <Route path="/patrimoine" element={<PatrimoinePage />} />
      </Routes>
    </Router>
  );
}

export default App;
