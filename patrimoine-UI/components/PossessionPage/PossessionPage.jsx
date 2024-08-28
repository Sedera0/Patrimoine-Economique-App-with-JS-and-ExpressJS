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
          throw new Error(`Network error: ${response.statusText}`);
        }
        const result = await response.json();

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

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <div className='container p-4'>
      <CreateButton showCreate={showCreate} setShowCreate={setShowCreate} />
      <PossessionTable
          possessions={possessions}
          onEdit={setEditingId}
          onDelete={handleDelete}
      />
      {editingId && (
        <Update possessionId={editingId} onUpdate={handleUpdate} />
      )}
      {showCreate && <Create onCreate={handleCreate} />}
    </div>
  );
};

export default PossessionPage;
