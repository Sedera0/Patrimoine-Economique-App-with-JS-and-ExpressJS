import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Patrimoine from '../../models/Patrimoine.js';
import Possession from '../../models/possessions/Possession.js';
import Flux from '../../models/possessions/Flux.js';
import PossessionTable from '../components/PossessionPage/PossessionTable.jsx';
import DateSelector from '../components/PatrimoinePage/DateSelector.jsx';
import CalculateButton from '../components/PatrimoinePage/CalculateButton.jsx';
import PatrimoineResult from '../components/PatrimoinePage/PatrimoineResult.jsx';
import CreateButton from '../components/PossessionPage/CreateButton.jsx';
import Create from '../components/PossessionPage/Create.jsx';
import Update from '../components/PossessionPage/Update.jsx';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [patrimoineValue, setPatrimoineValue] = useState(0);
  const [possessions, setPossessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/possessions');
        if (!response.ok) {
          throw new Error(`Network error: ${response.statusText}`);
        }
        const result = await response.json();

        console.log(result);

        const possessionsData = result.flatMap((item) => Array.isArray(item.possessions) ? item.possessions : []);

        if (Array.isArray(possessionsData)) {
          setPossessions(possessionsData);
        } else {
          throw new Error('Data does not contain an array of possessions.');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(`An error occurred while fetching data: ${(error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/possessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.statusText}`);
      }

      const result = await response.json();
      setPossessions((prevPossessions) => [...prevPossessions, result]);
      setShowCreate(false);
    } catch (error) {
      console.error("Error creating data:", error);
      alert(`An error occurred while creating data: ${(error).message}`);
    }
  };

  const handleUpdate = async (data) => {
    try {
      const response = await fetch(`http://localhost:5000/possessions/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.statusText}`);
      }

      const result = await response.json();
      setPossessions((prevPossessions) =>
        prevPossessions.map((possession) => (possession.id === data.id ? result : possession))
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error updating data:", error);
      alert(`An error occurred while updating data: ${(error).message}`);
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
      alert(`An error occurred while deleting data: ${(error).message}`);
    }
  };

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

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <>
      <div className='container p-4'>
        <div className='row justify-content-center'>
          <div className='col-md-3'>
            <h5 className='text-center bg-secondary text-white p-1 m-1'>Patrimoine économique</h5>
          </div>
        </div>
      </div>
      <CreateButton showCreate={showCreate} setShowCreate={setShowCreate} />
      <PossessionTable
          possessions={possessions}
          onEdit={setEditingId}
          onDelete={handleDelete}
      />
      {editingId && (
        <Update possessionId={editingId} onUpdate={handleUpdate} />
      )}
      <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <CalculateButton calculatePatrimoineValue={calculatePatrimoineValue} />
      <PatrimoineResult patrimoineValue={patrimoineValue} />
      {showCreate && <Create onCreate={handleCreate} />}
    </>
  );
}

export default App;
