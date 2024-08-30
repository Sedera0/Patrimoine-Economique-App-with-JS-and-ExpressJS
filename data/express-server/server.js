import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { json } = bodyParser;
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

app.get('/possessions', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.possessions);
  } catch (error) {
    console.error("Error in /possessions route:", error);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});



app.get('/patrimoine/:date', async (req, res) => {
  try {
    const { date } = req.params;
    console.log(`Fetching patrimoine for date: ${date}`);
    const data = await readData();
    
    const targetDate = new Date(date);
    let valeurPatrimoine = 0;

    for (const possession of data.possessions) {
      const dateDebut = new Date(possession.dateDebut);
      const dateFin = possession.dateFin ? new Date(possession.dateFin) : new Date();

      if (dateDebut <= targetDate && dateFin >= targetDate) {
        if (possession.valeurConstante) {
          valeurPatrimoine += possession.valeurConstante;
        } else {
          valeurPatrimoine += possession.valeur;
        }
      }
    }

    res.json({ valeur: valeurPatrimoine });
  } catch (error) {
    console.error("Error in /patrimoine/:date route:", error);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});


// Get all possessions
app.get('/possessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching possession with ID: ${id}`);
    const data = await readData();
    const possession = data.possessions.find(p => p.id === id);
    if (possession) {
      res.json(possession);
    } else {
      res.status(404).json({ message: 'Possession not found' });
    }
  } catch (error) {
    console.error("Error in /possessions/:id route:", error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/patrimoine/range', async (req, res) => {
  try {
    const { type, dateDebut, dateFin } = req.body;
    console.log(`Calculating patrimoine range for type: ${type}, from ${dateDebut} to ${dateFin}`); // Log the request
    const data = await readData();

    const startDate = new Date(dateDebut);
    const endDate = dateFin ? new Date(dateFin) : new Date(); // Utilise la date actuelle si dateFin est manquante
    let valeursPatrimoine = {};

    for (const possession of data.possessions) {
      const possessionDateDebut = new Date(possession.dateDebut);
      const possessionDateFin = possession.dateFin ? new Date(possession.dateFin) : new Date(); // Date actuelle si possession.dateFin est manquante
      let value = 0;

      if (possessionDateDebut <= endDate && possessionDateFin >= startDate) {
        switch (type) {
          case 'day': {
            const daysInRange = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            value = possession.valeur / daysInRange;
            const currentDate = new Date(startDate);

            while (currentDate <= endDate) {
              const dateString = currentDate.toISOString().split('T')[0];
              if (currentDate >= possessionDateDebut && currentDate <= possessionDateFin) {
                if (!valeursPatrimoine[dateString]) {
                  valeursPatrimoine[dateString] = 0;
                }
                valeursPatrimoine[dateString] += value;
              }
              currentDate.setDate(currentDate.getDate() + 1);
            }
            break;
          }
          case 'month': {
            const monthStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
            const monthEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            
            if (possessionDateDebut <= monthEnd && possessionDateFin >= monthStart) {
              const monthKey = `${startDate.getFullYear()}-${startDate.getMonth() + 1}`;
              if (!valeursPatrimoine[monthKey]) {
                valeursPatrimoine[monthKey] = 0;
              }
              valeursPatrimoine[monthKey] += possession.valeur;
            }
            break;
          }
          case 'year': {
            const yearStart = new Date(startDate.getFullYear(), 0, 1);
            const yearEnd = new Date(startDate.getFullYear(), 11, 31);
            
            if (possessionDateDebut <= yearEnd && possessionDateFin >= yearStart) {
              const yearKey = `${startDate.getFullYear()}`;
              if (!valeursPatrimoine[yearKey]) {
                valeursPatrimoine[yearKey] = 0;
              }
              valeursPatrimoine[yearKey] += possession.valeur;
            }
            break;
          }
          default:
            res.status(400).json({ error: 'Invalid type specified' });
            return;
        }
      }
    }

    // Convertir l'objet en tableau de résultats
    const result = Object.entries(valeursPatrimoine).map(([date, value]) => ({ date, value }));
    res.json(result);
  } catch (error) {
    console.error("Error in /patrimoine/range route:", error);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});


// Create a new possession
app.post('/possessions', async (req, res) => {
  try {
    const newPossession = req.body;
    if (!newPossession.id || !newPossession.libelle || !newPossession.dateDebut || !newPossession.valeur) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`Creating new possession: ${JSON.stringify(newPossession)}`);
    const data = await readData();
    data.possessions.push(newPossession);
    await writeData(data);
    res.json(newPossession);
  } catch (error) {
    console.error("Error in /possessions route:", error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.post('/possession/:libelle/close', async (req, res) => {
  try {
    const { libelle } = req.params;
    console.log(`Closing possession with libelle: ${libelle}`);
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
    console.error("Error in /possession/:libelle/close route:", error);
    res.status(500).json({ error: 'Failed to update data' });
  }
});


app.put('/possessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { libelle, dateFin } = req.body;

    if (!id || !libelle) {
      return res.status(400).json({ error: 'ID and libelle are required' });
    }

    const data = await readData();
    let found = false;
    let updatedPossession;

    data.possessions = data.possessions.map(possession => {
      if (possession.id === id) {
        found = true;
        // Mettre à jour uniquement les champs fournis
        updatedPossession = {
          ...possession,
          libelle: libelle || possession.libelle,
          dateFin: dateFin || possession.dateFin,
        };
        return updatedPossession; 
      }
      return possession;
    });

    if (found) {
      await writeData(data);
      res.json(updatedPossession); // Retourner l'objet entier mis à jour
    } else {
      res.status(404).json({ message: 'Possession not found' });
    }
  } catch (error) {
    console.error("Error in /possessions/:id route:", error);
    res.status(500).json({ error: 'Failed to update data' });
  }
});



// Delete a possession
app.delete('/possessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting possession with ID: ${id}`);
    const data = await readData();
    data.possessions = data.possessions.filter(possession => possession.id !== id);
    await writeData(data);
    res.status(204).send();
  } catch (error) {
    console.error("Error in /possessions/:id route:", error);
    res.status(500).json({ error: 'Failed to delete data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
