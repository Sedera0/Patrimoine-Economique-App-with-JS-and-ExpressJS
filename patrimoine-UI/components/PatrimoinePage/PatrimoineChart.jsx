import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Form } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const PatrimoineChart = ({ onFetchData }) => {
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [uniteTemps, setUniteTemps] = useState('');  // Renommé pour refléter jour/mois/année
  const [chartData, setChartData] = useState(null);

  const handleValidate = async () => {
    if (dateDebut && dateFin && uniteTemps) {
      try {
        // Appeler la fonction onFetchData avec les paramètres corrects
        const data = await onFetchData(dateDebut, dateFin, uniteTemps);

        // Assurez-vous que le format des données est [{ date: '2024-08-01', value: 100 }, ...]
        const labels = data.map(item => item.date);
        const values = data.map(item => item.value);

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
      }
    } else {
      alert('Please fill all fields!');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Visualisez Votre Patrimoine</h2>
      <Form>
        <Form.Group controlId="dateDebut">
          <Form.Label>Date Début</Form.Label>
          <DatePicker
            selected={dateDebut}
            onChange={(date) => setDateDebut(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
        </Form.Group>
        <Form.Group controlId="dateFin" className="mt-3">
          <Form.Label>Date Fin</Form.Label>
          <DatePicker
            selected={dateFin}
            onChange={(date) => setDateFin(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
        </Form.Group>
        <Form.Group controlId="uniteTemps" className="mt-3">
          <Form.Label>Unité de Temps</Form.Label>
          <Form.Control
            as="select"
            value={uniteTemps}
            onChange={(e) => setUniteTemps(e.target.value)}
          >
            <option value="">Select unité de temps</option>
            <option value="day">Jour</option>
            <option value="month">Mois</option>
            <option value="year">Année</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" className="mt-4" onClick={handleValidate}>
          Valider
        </Button>
      </Form>
      {chartData && (
        <div className="mt-5">
          <Line data={chartData} options={{ responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Date'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Valeur'
      }
    }
  } }} />
        </div>
      )}
    </div>
  );
};

export default PatrimoineChart;
