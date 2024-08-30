
export default class Patrimoine {
  constructor(nom, possessions) {
    this.nom = nom;
    this.possessions = possessions; // tableau de Possession ou Flux
  }

  getValeur(date) {
    let valeurTotale = 0;
    this.possessions.forEach(possession => {
      if (possession.isActiveOn(date)) { // Assurez-vous que cette méthode est définie
        valeurTotale += possession.getValeur(date); // Utilisez `getValeur` au lieu de `getValeurOnDate`
      }
    });
    return valeurTotale;
  }
}
