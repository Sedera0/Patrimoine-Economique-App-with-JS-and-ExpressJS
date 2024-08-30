
export default class Patrimoine {
  constructor(nom, possessions) {
    this.nom = nom;
    this.possessions = possessions;
  }

  getValeur(date) {
    let valeurTotale = 0;
    this.possessions.forEach(possession => {
      if (possession.isActiveOn(date)) {
        valeurTotale += possession.getValeur(date);
      }
    });
    return valeurTotale;
  }
}
