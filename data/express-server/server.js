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

// Get all possessions
app.get('/possessions', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.possessions || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
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

// Update a possession
app.put('/possessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const data = await readData();
    data.possessions = data.possessions.map(possession =>
      possession.id === id ? updatedData : possession
    );
    await writeData(data);
    res.json(updatedData);
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
