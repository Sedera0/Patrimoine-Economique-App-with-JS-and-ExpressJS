import Button from 'react-bootstrap/Button';

const Delete = ({ possessionId, onDelete }) => {
  const handleClick = async () => {
    if (possessionId) {
      try {
        await onDelete(possessionId);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    } else {
      console.error('Aucun ID de possession fourni pour la suppression.');
      alert('Aucun ID de possession fourni pour la suppression.');
    }
  };

  return (
    <Button variant="danger" onClick={handleClick} className='btn-sm'>
      Supprimer
    </Button>
  );
}

export default Delete;
