import React, { useState, useEffect } from 'react';
import DateSelector from './DateSelector.jsx';
import CalculateButton from './CalculateButton.jsx';
import PatrimoineResult from './PatrimoineResult.jsx';
import Patrimoine from '../../../models/Patrimoine.js';
import Possession from '../../../models/possessions/Possession.js';
import Flux from '../../../models/possessions/Flux.js';
import PatrimoineChart from './PatrimoineChart.jsx';

const PatrimoinePage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [patrimoineValue, setPatrimoineValue] = useState(0);
  const [possessions, setPossessions] = useState([]);

  useEffect(() => {
    const fetchPossessionsData = async () => {
      try {
        const response = await fetch('/api/possessions');
        if (!response.ok) throw new Error('Erreur de réseau');

        const data = await response.json();
        if (Array.isArray(data)) {
          const validPossessions = data.filter(possession => 
            possession.id && possession.libelle && typeof possession.valeur === 'number' && possession.dateDebut
          );
          
          if (validPossessions.length > 0) {
            setPossessions(validPossessions);
          } else {
            alert('Données des possessions non valides.');
          }
        } else {
          alert('Données des possessions non valides.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des possessions :', error);
      }
    };

    fetchPossessionsData();
  }, []);

  const calculatePatrimoineValue = () => {
    if (!selectedDate) {
      alert("Veuillez sélectionner une date !");
      return;
    }

    try {
      if (!Array.isArray(possessions) || possessions.length === 0) {
        alert('Aucune donnée de possession disponible pour le calcul.');
        return;
      }

      const possessionsActives = possessions.filter(item => {
        const dateDebut = new Date(item.dateDebut);
        const dateFin = item.dateFin ? new Date(item.dateFin) : null;
        return dateDebut <= selectedDate && (!dateFin || selectedDate <= dateFin);
      });

      const patrimoine = new Patrimoine(
        "John Doe",
        possessionsActives.map((item) =>
          item.jour
            ? new Flux(
                item.possesseur ? item.possesseur.nom : "Inconnu",
                item.libelle,
                item.valeurConstante,
                new Date(item.dateDebut),
                item.dateFin ? new Date(item.dateFin) : null,
                item.tauxAmortissement || 0,
                item.jour
              )
            : new Possession(
                item.possesseur ? item.possesseur.nom : "Inconnu",
                item.libelle,
                item.valeur,
                new Date(item.dateDebut),
                item.dateFin ? new Date(item.dateFin) : null,
                item.tauxAmortissement || 0
              )
        )
      );

      setPatrimoineValue(patrimoine.getValeur(selectedDate));
    } catch (error) {
      console.error("Erreur lors du calcul du patrimoine :", error);
      alert("Une erreur est survenue lors du calcul du patrimoine.");
    }
  };

  const fetchPatrimoineData = async (dateDebut, dateFin, uniteTemps) => {
    try {
      const response = await fetch('http://localhost:5000/patrimoine/range', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateDebut, dateFin, type: uniteTemps }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`La réponse du réseau n'était pas correcte : ${errorMessage}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Format de réponse inattendu');

      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données de patrimoine :', error);
      throw error;
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
