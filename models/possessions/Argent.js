import Possession from "./Possession.js";

const TYPE_ARGENT = {
  COURANT: "Courant",
  EPARGNE: "Epargne",
  ESPECE: "Espece"
};

export default class Argent extends Possession {
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement, type) {
    super(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement);

    if (!Object.values(TYPE_ARGENT).includes(type)) {
      throw new Error("Type d'argent invalide");
    }

    this.type = type;
  }
}

