import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Form } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import './PatrimoineChart.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale); // Enregistre l'axe 'time'

const PatrimoineChart = ({ onFetchData }) => {
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [uniteTemps, setUniteTemps] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (dateDebut && dateFin && uniteTemps) {
      if (dateDebut > dateFin) {
        alert('La date de début ne peut pas être après la date de fin.');
        return;
      }
      setLoading(true);
      try {
        const data = await onFetchData(
          dateDebut.toISOString().split('T')[0], 
          dateFin.toISOString().split('T')[0], 
          uniteTemps
        );
  
        console.log("Données reçues : ", data); // Vérifiez les données reçues
  
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Les données reçues ne sont pas valides ou sont vides');
        }
  
        const labels = data.map(item => item.date);
        const values = data.map(item => item.value);
  
        console.log("Labels : ", labels);
        console.log("Valeurs : ", values);
  
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
        console.error("Erreur lors de la récupération des données de patrimoine :", error);
        alert(`Une erreur est survenue lors de la récupération des données : ${error.message}`);
      } finally {
        setLoading(false);
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
            dateFormat="dd-MM-yyyy"
            className="form-control"
            placeholderText="Sélectionnez la date de début"
          />
        </Form.Group>
        <Form.Group controlId="dateFin" className='form1'>
          <Form.Label>Date Fin</Form.Label>
          <DatePicker
            selected={dateFin}
            onChange={(date) => setDateFin(date)}
            dateFormat="dd-MM-yyyy"
            className="form-control"
            placeholderText="Sélectionnez la date de fin"
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
            <option value="">Choisissez une unité de temps</option>
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
          <Line
            data={chartData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              scales: {
                x: {
                  type: 'time', // Utiliser 'time' pour l'axe X
                  time: {
                    unit: uniteTemps, // Cela ajuste l'unité de temps (jour, mois, année) en fonction de la sélection
                  },
                },
                y: {
                  beginAtZero: true, // Assure que l'axe Y commence à zéro
                },
              },
              plugins: {
                legend: {
                  display: true, // Affiche la légende du graphique
                },
                tooltip: {
                  mode: 'index',
                  intersect: false, // Améliore l'affichage des points de données dans les tooltips
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PatrimoineChart;
