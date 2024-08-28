import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

const Update = ({ possessionId, onUpdate }) => {
  const [formData, setFormData] = useState({
    possesseur: '',
    libelle: '',
    valeur: 0,
    dateDebut: '',
    dateFin: '',
    tauxAmortissement: 0,
    jour: 0,
    valeurConstante: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/possessions/${possessionId}`);
        if (!response.ok) {
          throw new Error(`Erreur réseau : ${response.statusText}`);
        }
        const data = await response.json();
        // Adapter les données pour le formulaire
        setFormData({
          possesseur: data.possesseur?.nom || '',
          libelle: data.libelle || '',
          valeur: data.valeur || 0,
          dateDebut: data.dateDebut || '',
          dateFin: data.dateFin || '',
          tauxAmortissement: data.tauxAmortissement || 0,
          jour: data.jour || 0,
          valeurConstante: data.valeurConstante || 0,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        alert(`Une erreur est survenue lors de la récupération des données : ${(error).message}`);
      }
    };

    fetchData();
  }, [possessionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Adapter les données avant l'envoi
      const adaptedData = {
        possesseur: { nom: formData.possesseur },
        libelle: formData.libelle,
        valeur: formData.valeur,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin || null,
        tauxAmortissement: formData.tauxAmortissement || null,
        jour: formData.jour || null,
        valeurConstante: formData.valeurConstante || null,
      };

      await onUpdate(adaptedData);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert(`Une erreur est survenue lors de la mise à jour : ${(error).message}`);
    }
  };

  return (
    <div>
      <h3>Modifier l'élément</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Possesseur:</label>
          <input
            type="text"
            name="possesseur"
            value={formData.possesseur}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Libelle:</label>
          <input
            type="text"
            name="libelle"
            value={formData.libelle}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Valeur:</label>
          <input
            type="number"
            name="valeur"
            value={formData.valeur}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Date de début:</label>
          <input
            type="date"
            name="dateDebut"
            value={formData.dateDebut}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Date de fin:</label>
          <input
            type="date"
            name="dateFin"
            value={formData.dateFin}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Taux d'amortissement:</label>
          <input
            type="number"
            name="tauxAmortissement"
            value={formData.tauxAmortissement}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Jour:</label>
          <input
            type="number"
            name="jour"
            value={formData.jour}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Valeur constante:</label>
          <input
            type="number"
            name="valeurConstante"
            value={formData.valeurConstante}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" variant="primary">Mettre à jour</Button>
      </form>
    </div>
  );
};

export default Update;
