import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Create = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    id: '',
    libelle: '',
    valeur: '',
    dateDebut: '',
    tauxAmortissement: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'valeur' || name === 'tauxAmortissement' || name === 'jour' || name === 'valeurConstante'
        ? parseFloat(value)
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onCreate(formData);
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      alert(`Une erreur est survenue lors de la création : ${error.message}`);
    }
  };

  return (
    <Container className='form-container'>
      <Row className="m-1">
        <Col xs="auto">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formId">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                name="id"
                required
                value={formData.id}
                onChange={handleChange}
                className="small-input"
              />
            </Form.Group>

            <Form.Group controlId="formLibelle">
              <Form.Label>Libellé</Form.Label>
              <Form.Control
                type="text"
                name="libelle"
                required
                value={formData.libelle}
                onChange={handleChange}
                className="small-input"
              />
            </Form.Group>

            <Form.Group controlId="formValeur">
              <Form.Label>Valeur</Form.Label>
              <Form.Control
                type="number"
                name="valeur"
                required
                value={formData.valeur}
                onChange={handleChange}
                className="small-input"
              />
            </Form.Group>

            <Form.Group controlId="formDateDebut">
              <Form.Label>Date de Début</Form.Label>
              <Form.Control
                type="date"
                name="dateDebut"
                required
                value={formData.dateDebut}
                onChange={handleChange}
                className="small-input"
              />
            </Form.Group>

            <Form.Group controlId="formTauxAmortissement">
              <Form.Label>Taux d'Amortissement</Form.Label>
              <Form.Control
                type="number"
                name="tauxAmortissement"
                value={formData.tauxAmortissement}
                onChange={handleChange}
                className="small-input"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-1 mb-1 btn-sm">
              Créer
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Create;
