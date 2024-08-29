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
        console.log('Possessions:', possessions);
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

  
  const fetchPatrimoineData = async (dateDebut, dateFin, uniteTemps) => {
    try {
      const response = await fetch('http://localhost:5000/patrimoine/range', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateDebut,
          dateFin,
          type: uniteTemps,
        }),
      });
      
      if (!response.ok) {
        const errorMessage = await response.text(); // Pour obtenir le message d'erreur complet
        throw new Error(`Network response was not ok: ${errorMessage}`);
      }
    
      const data = await response.json();
      
      // Vous pouvez ajouter une vérification ici pour vous assurer que `data` est bien dans le format attendu
      // Exemple: si vous attendez un tableau d'objets avec une clé `model` et `data`
      if (!Array.isArray(data)) {
        throw new Error('Unexpected response format');
      }
    
      return data;
    } catch (error) {
      console.error('Error fetching patrimoine data:', error);
      // Optionnel: vous pouvez gérer l'erreur plus finement ici, par exemple, en affichant un message à l'utilisateur
      throw error; // Re-throw l'erreur si vous voulez la gérer ailleurs
    }
  };
  
  
  return (
    <div className='container p-4'>
      <PatrimoineChart onFetchData={fetchPatrimoineData} />
      <h4 className='m-5'>Calculez votre patrimoine</h4>
      <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <CalculateButton calculatePatrimoineValue={calculatePatrimoineValue} />
      <PatrimoineResult patrimoineValue={patrimoineValue} />
    </div>
  );
};

export default PatrimoinePage;
