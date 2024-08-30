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
  const [possessions, setPossessions] = useState([]); // État pour stocker les données des possessions

  // Récupérer les données des possessions depuis un serveur ou une source locale
  useEffect(() => {
    const fetchPossessionsData = async () => {
      try {
        const response = await fetch('/api/possessions'); // Remplacez par votre source de données
        if (!response.ok) {
          throw new Error('Erreur de réseau');
        }
        const data = await response.json();
        console.log('Possessions récupérées :', data);

        // Validation et formatage des données
        if (Array.isArray(data) && data.length > 0) {
          const validPossessions = data.filter(possession => 
            possession.id && possession.libelle && typeof possession.valeur === 'number' && possession.dateDebut
          );
          
          if (validPossessions.length > 0) {
            setPossessions(validPossessions);
            console.log('Possessions mises à jour :', validPossessions);
          } else {
            console.error('Aucune possession valide trouvée dans les données.', data);
            alert('Données des possessions non valides.');
          }
        } else {
          console.error('Données des possessions non valides :', data);
          alert('Données des possessions non valides.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des possessions :', error);
      }
    };

    fetchPossessionsData();
  }, []);

  const calculatePatrimoineValue = () => {
    console.log('Calcul du patrimoine :', { selectedDate, possessions });

    if (selectedDate) {
      try {
        if (!Array.isArray(possessions) || possessions.length === 0) {
          console.error('Les données des possessions ne sont pas un tableau ou sont vides :', possessions);
          alert('Aucune donnée de possession disponible pour le calcul.');
          return;
        }

        // Création d'instances de Possession et Flux basées sur les données de possession
        const patrimoine = new Patrimoine(
          "John Doe",
          possessions.map((item) =>
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

        const patValue = patrimoine.getValeur(selectedDate);
        setPatrimoineValue(patValue);
      } catch (error) {
        console.error("Erreur lors du calcul du patrimoine :", error);
        alert("Une erreur est survenue lors du calcul du patrimoine.");
      }
    } else {
      alert("Veuillez sélectionner une date !");
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
        const errorMessage = await response.text();
        throw new Error(`La réponse du réseau n'était pas correcte : ${errorMessage}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Format de réponse inattendu');
      }

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
