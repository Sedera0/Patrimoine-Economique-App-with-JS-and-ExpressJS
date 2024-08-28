// src/App.jsx
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/PossessionPage/Header.jsx';
import PossessionPage from '../components/PossessionPage/PossessionPage.jsx';
import PatrimoinePage from '../components/PatrimoinePage/PatrimoinePage.jsx';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/possessions" element={<PossessionPage />} />
        <Route path="/patrimoine" element={<PatrimoinePage />} />
        {/* Ajoutez d'autres routes ici si nécessaire */}
      </Routes>
    </Router>
  );
}

export default App;
