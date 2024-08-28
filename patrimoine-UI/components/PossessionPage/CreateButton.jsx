import React from 'react';
import Button from 'react-bootstrap/Button';

function CreateButton({ showCreate, setShowCreate }) {
  return (
    <div className='createToggle'>
      <Button variant="primary" onClick={() => setShowCreate(!showCreate)} className='btn-sm m-4'>
        {showCreate ? 'Annuler' : 'Créer une nouvelle possession'}
      </Button>
    </div>
  );
}

export default CreateButton;
