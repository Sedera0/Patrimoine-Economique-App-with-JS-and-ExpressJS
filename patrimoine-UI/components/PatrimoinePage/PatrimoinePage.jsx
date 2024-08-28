// src/pages/PatrimoinePage.jsx

import React, { useState } from 'react';
import DateSelector from './DateSelector.jsx';
import CalculateButton from './CalculateButton.jsx';
import PatrimoineResult from './PatrimoineResult.jsx';
import Patrimoine from '../../../models/Patrimoine.js';
import Possession from '../../../models/possessions/Possession.js';
import Flux from '../../../models/possessions/Flux.js';
import PatrimoineChart from './PatrimoineChart.jsx'

const PatrimoinePage = ({ possessions }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [patrimoineValue, setPatrimoineValue] = useState(0);

  const calculatePatrimoineValue = () => {
    if (selectedDate) {
      try {
        const patrimoine = new Patrimoine("John Doe", possessions.map((item) =>
          item.jour
            ? new Flux(
                item.possesseur,
                item.libelle,
                item.valeurConstante,
                new Date(item.dateDebut),
                item.dateFin ? new Date(item.dateFin) : null,
                item.tauxAmortissement || 0,
                item.jour
              )
            : new Possession(
                item.possesseur,
                item.libelle,
                item.valeur,
                new Date(item.dateDebut),
                item.dateFin ? new Date(item.dateFin) : null,
                item.tauxAmortissement || 0
              )
        ));

        const patValue = patrimoine.getValeur(selectedDate);
        setPatrimoineValue(patValue);
      } catch (error) {
        console.error("Error calculating patrimoine:", error);
        alert("An error occurred while calculating patrimoine.");
      }
    } else {
      alert("Please select a date!");
    }
  };

  
    const fetchPatrimoineData = async (dateDebut, dateFin, jour) => {
      try {
        const response = await fetch('http://localhost:5000/patrimoine/range', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'month', // Exemple de type, ajustez selon vos besoins
            dateDebut: dateDebut.toISOString(),
            dateFin: dateFin.toISOString(),
            jour: parseInt(jour, 10),
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Network error: ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching patrimoine data:", error);
        alert(`An error occurred while fetching data: ${(error).message}`);
        return [];
      }
    };
  
  return (
    <div className='container p-4'>
      <PatrimoineChart onFetchData={fetchPatrimoineData} />
      <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <CalculateButton calculatePatrimoineValue={calculatePatrimoineValue} />
      <PatrimoineResult patrimoineValue={patrimoineValue} />
    </div>
  );
};

export default PatrimoinePage;
