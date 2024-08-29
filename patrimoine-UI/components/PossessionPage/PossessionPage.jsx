// src/pages/PossessionPage.jsx

import React, { useState, useEffect } from 'react';
import PossessionTable from './PossessionTable.jsx';
import CreateButton from './CreateButton.jsx';
import Create from './Create.jsx';
import Update from './Update.jsx';

const PossessionPage = () => {
  const [possessions, setPossessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/possessions');
        if (!response.ok) {
          throw new Error(`Erreur réseau : ${response.statusText}`);
        }
        const data = await response.json();
        setPossessions(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        alert(`Une erreur est survenue lors de la récupération des données : ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = async (newData) => {
    try {
      const response = await fetch('http://localhost:5000/possessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.statusText}`);
      }

      const createdData = await response.json();
      setPossessions((prevPossessions) => [...prevPossessions, createdData]);
      setShowCreate(false);
    } catch (error) {
      console.error("Error creating data:", error);
      alert(`An error occurred while creating data: ${error.message}`);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const { id, libelle, dateFin } = updatedData;
  
      // Étape 1: Récupérer la possession complète du serveur
      const getResponse = await fetch(`http://localhost:5000/possessions/${id}`);
      if (!getResponse.ok) {
        throw new Error(`Erreur réseau lors de la récupération: ${getResponse.statusText}`);
      }
      const currentData = await getResponse.json();
  
      // Étape 2: Mettre à jour uniquement libelle et dateFin dans les données récupérées
      const updatedPossession = {
        ...currentData,
        libelle,
        dateFin,
      };
  
      console.log(`Updating possession with ID: ${id}`);
      console.log(`Data being sent: ${JSON.stringify(updatedPossession)}`);
  
      // Étape 3: Envoyer toutes les données mises à jour au serveur
      const response = await fetch(`http://localhost:5000/possessions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPossession), // Envoyer toutes les données mises à jour
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network error: ${response.statusText} - ${errorText}`);
      }
  
      const updatedDataFromServer = await response.json();
      console.log('Updated possession:', updatedDataFromServer);
  
      // Mettre à jour l'état avec la possession mise à jour
      setPossessions((prevPossessions) =>
        prevPossessions.map((possession) =>
          possession.id === updatedDataFromServer.id ? updatedDataFromServer : possession
        )
      );
  
      setEditingId(null);
    } catch (error) {
      console.error("Error updating data:", error);
      alert(`An error occurred while updating data: ${error.message}`);
    }
  };
  
  

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/possessions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.statusText}`);
      }

      setPossessions((prevPossessions) => prevPossessions.filter((possession) => possession.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
      alert(`An error occurred while deleting data: ${error.message}`);
    }
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <div className='container p-4'>
      <CreateButton showCreate={showCreate} setShowCreate={setShowCreate} />
      {showCreate && <Create onCreate={handleCreate} />}
      <PossessionTable
        possessions={possessions}
        onEdit={setEditingId}
        onDelete={handleDelete}
      />
      {editingId && (
        <Update possessionId={editingId} onUpdate={handleUpdate} />
      )}
    </div>
  );
};

export default PossessionPage;
