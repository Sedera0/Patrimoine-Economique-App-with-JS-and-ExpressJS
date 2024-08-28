import Possession from "./Possession.js";

export default class Flux extends Possession {
  constructor(possesseur, libelle, valeurConstante, dateDebut, dateFin = null, tauxAmortissement = 0, jour) {
    super(possesseur, libelle, 0, dateDebut, dateFin, tauxAmortissement);
    this.valeurConstante = valeurConstante;
    this.jour = jour;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
  }

  // Méthode pour calculer le nombre de mois écoulés
  nombreDeMois(debut, dateEvaluation, jourJ) {
    let compteur = 0;

    // Si la date de début est avant le jour du mois en cours
    if (debut.getDate() < jourJ) {
      compteur++;
    }

    // Si la date d'évaluation est après le jour du mois en cours et que ce n'est pas le même mois
    if (dateEvaluation.getDate() >= jourJ && !(debut.getFullYear() === dateEvaluation.getFullYear() && debut.getMonth() === dateEvaluation.getMonth())) {
      compteur++;
    }

    // Calculer le total des mois écoulés
    let totalMois = (dateEvaluation.getFullYear() - debut.getFullYear()) * 12 + (dateEvaluation.getMonth() - debut.getMonth()) - 1;
    compteur += Math.max(0, totalMois);

    return compteur;
  }

  // Méthode pour obtenir la valeur totale en fonction du nombre de mois écoulés
  getValeur(date) {
    // Calculer le nombre de mois écoulés depuis la date de début
    const totalMois = this.nombreDeMois(this.dateDebut, date, this.jour);
    // Calculer le montant total basé sur la valeur constante
    const montantTotal = totalMois * this.valeurConstante;

    return montantTotal;
  }
}
