import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Form } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import './PatrimoineChart.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const PatrimoineChart = ({ onFetchData }) => {
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [uniteTemps, setUniteTemps] = useState('');  // Unité de temps : jour, mois, année
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);  // Pour indiquer le chargement

  const handleValidate = async () => {
    if (dateDebut && dateFin && uniteTemps) {
      setLoading(true);  // Début du chargement
      try {
        const data = await onFetchData(dateDebut, dateFin, uniteTemps);
        
        // Test avec des données variées
        const testData = [
          { date: '2024-01-01', value: 100 },
          { date: '2024-01-02', value: 150 },
          { date: '2024-01-03', value: 200 },
          { date: '2024-01-04', value: 180 },
          { date: '2024-01-05', value: 220 },
          // Ajoutez plus de données pour tester
        ];
  
        const labels = testData.map(item => item.date);
        const values = testData.map(item => item.value);
  
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Valeur Patrimoine',
              data: values,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching patrimoine data:", error);
        alert(`An error occurred while fetching data: ${error.message}`);
      } finally {
        setLoading(false);  // Fin du chargement
      }
    } else {
      alert('Veuillez remplir tous les champs !');
    }
  };
  
  

  return (
    <div className="container mt-3">
      <h4>Projetez-vous!</h4>
      <Form>
        <Form.Group controlId="dateDebut" className='form1'>
          <Form.Label>Date Début</Form.Label>
          <DatePicker
            selected={dateDebut}
            onChange={(date) => setDateDebut(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
        </Form.Group>
        <Form.Group controlId="dateFin" className='form1'>
          <Form.Label>Date Fin</Form.Label>
          <DatePicker
            selected={dateFin}
            onChange={(date) => setDateFin(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
        </Form.Group>
        <Form.Group controlId="uniteTemps" className='form1'>
          <Form.Label>Unité de Temps</Form.Label>
          <Form.Control
            className='form-control'
            as="select"
            value={uniteTemps}
            onChange={(e) => setUniteTemps(e.target.value)}
          >
            <option value="">...</option>
            <option value="day">Jour</option>
            <option value="month">Mois</option>
            <option value="year">Année</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" className="validateBtn" onClick={handleValidate} disabled={loading}>
          {loading ? 'Chargement...' : 'Valider'}
        </Button>
      </Form>
      {chartData && (
        <div className="chart">
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default PatrimoineChart;
