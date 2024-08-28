import fs from 'node:fs/promises';

/**
 * Lit un fichier JSON et retourne les données.
 * @param {string} path - Le chemin du fichier à lire.
 * @returns {Promise<{status: string, data?: any, error?: Error}>}
 */
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
      error: new Error(`Erreur lors de la lecture du fichier ${path}: ${err.message}`),
    };
  }
}

/**
 * Écrit des données JSON dans un fichier.
 * @param {string} path - Le chemin du fichier dans lequel écrire.
 * @param {any} data - Les données à écrire.
 * @returns {Promise<{status: string, error?: Error}>}
 */
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
      error: new Error(`Erreur lors de l'écriture dans le fichier ${path}: ${err.message}`),
    };
  }
}

export { readFile, writeFile };
