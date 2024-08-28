import fs from 'node:fs/promises';

async function readFile(path) {
  try {
    const data = await fs.readFile(path, { encoding: 'utf8' });
    return {
      status: "OK",
      data: JSON.parse(data),
    };
  } catch (err) {
    console.error(`Erreur lors de la lecture du fichier ${path}:`, err);
    return {
      status: "ERROR",
      error: err,
    };
  }
}

async function writeFile(path, data) {
  try {
    await fs.writeFile(path, JSON.stringify(data, null, 2), { encoding: 'utf8' });
    return {
      status: "OK",
    };
  } catch (err) {
    console.error(`Erreur lors de l'écriture dans le fichier ${path}:`, err);
    return {
      status: "ERROR",
      error: err,
    };
  }
}

export { readFile, writeFile };
