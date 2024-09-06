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
        const response = await fetch(`https://express-server-xdig.onrender.com/possessions/${possessionId}`);
        if (!response.ok) {
          throw new Error(`Erreur réseau : ${response.statusText}`);
        }
        const data = await response.json();
       
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
      const updatedData = {
        possesseur: { nom: formData.possesseur },
        libelle: formData.libelle,
        valeur: formData.valeur,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin || null,
        tauxAmortissement: formData.tauxAmortissement || null,
        jour: formData.jour || null,
        valeurConstante: formData.valeurConstante || null,
      };
  
      const response = await fetch(`https://express-server-xdig.onrender.com/possessions/${possessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error(`Erreur réseau : ${response.statusText}`);
      }
      const data = await response.json();
      onUpdate(data);
  
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
          <label>Libelle:</label>
          <input
            type="text"
            name="libelle"
            value={formData.libelle}
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
        <Button type="submit" variant="primary">Mettre à jour</Button>
      </form>
    </div>
  );
};

export default Update;
