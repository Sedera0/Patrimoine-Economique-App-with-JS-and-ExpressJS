import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const app = express();
const PORT = 5000;
const DATA_FILE = join(__dirname, 'data.json');



// Middlewares
app.use(cors());
app.use(json());

// Helper functions
const readData = async () => {
  const data = await readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
};

const writeData = async (data) => {
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get('/patrimoine/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const data = await readData();
    
    const targetDate = new Date(date);
    let valeurPatrimoine = 0;

    for (const possession of data.possessions) {
      const dateDebut = new Date(possession.dateDebut);
      const dateFin = possession.dateFin ? new Date(possession.dateFin) : new Date();

      if (dateDebut <= targetDate && dateFin >= targetDate) {
        valeurPatrimoine += possession.valeur;
      }
    }

    res.json({ valeur: valeurPatrimoine });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

// Get all possessions
app.get('/possessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching possession with ID: ${id}`); // Log de l'ID
    const data = await readData();
    const possession = data.possessions.find(p => p.id === id);
    if (possession) {
      res.json(possession);
    } else {
      res.status(404).json({ message: 'Possession not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});


app.post('/patrimoine/range', async (req, res) => {
  try {
    const { type, dateDebut, dateFin, jour } = req.body;
    const data = await readData();
    
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);
    let valeurPatrimoine = 0;

    for (const possession of data.possessions) {
      const possessionDateDebut = new Date(possession.dateDebut);
      const possessionDateFin = possession.dateFin ? new Date(possession.dateFin) : new Date();

      // Vérifier si la possession est dans la plage de dates
      if (possessionDateDebut <= endDate && possessionDateFin >= startDate) {
        // Calculer la valeur en fonction du type et des jours spécifiés
        if (type === 'month') {
          // Ici, on peut appliquer une logique pour calculer la valeur mensuelle
          valeurPatrimoine += possession.valeur; // Exemple simple
        }
      }
    }

    res.json({ valeur: valeurPatrimoine });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

// Create a new possession
app.post('/possessions', async (req, res) => {
  try {
    const newPossession = req.body;
    const data = await readData();
    data.possessions.push(newPossession);
    await writeData(data);
    res.json(newPossession);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.post('/possession/:libelle/close', async (req, res) => {
  try {
    const { libelle } = req.params;
    const data = await readData();
    const now = new Date().toISOString();
    
    data.possessions = data.possessions.map(possession => {
      if (possession.libelle === libelle && !possession.dateFin) {
        return { ...possession, dateFin: now };
      }
      return possession;
    });
    
    await writeData(data);
    res.json({ message: 'Possession closed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update data' });
  }
});


// Update a possession using libelle to identify it
app.put('/possessions/', async (req, res) => {
  try {
    const { libelle, dateFin } = req.body; // On prend libelle et dateFin pour la mise à jour
    const data = await readData();

    let found = false;
    data.possessions = data.possessions.map(possession => {
      if (possession.libelle === libelle) {
        found = true;
        return { ...possession, dateFin }; // Met à jour uniquement dateFin
      }
      return possession;
    });

    if (found) {
      await writeData(data);
      res.json({ libelle, dateFin }); // Retourne les données mises à jour
    } else {
      res.status(404).json({ message: 'Possession not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update data' });
  }
});


// Delete a possession
app.delete('/possessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData();
    data.possessions = data.possessions.filter(possession => possession.id !== id);
    await writeData(data);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
