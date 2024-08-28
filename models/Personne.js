export default class Personne {
  constructor(nom) {
    if (typeof nom !== 'string' || nom.trim() === '') {
      throw new Error("Le nom doit être une chaîne de caractères non vide.");
    }
    this.nom = nom;
  }

  // Méthode pour obtenir le nom
  getNom() {
    return this.nom;
  }

  // Méthode pour modifier le nom
  setNom(nouveauNom) {
    if (typeof nouveauNom !== 'string' || nouveauNom.trim() === '') {
      throw new Error("Le nouveau nom doit être une chaîne de caractères non vide.");
    }
    this.nom = nouveauNom;
  }

  // Méthode pour afficher des informations sur la personne
  afficherInfos() {
    console.log(`Nom : ${this.nom}`);
  }
}
