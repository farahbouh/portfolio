// scripts/saisie.js
// Effet "Je suis : ___" — tape puis efface chaque rôle, en boucle indéfiniment.

document.addEventListener('DOMContentLoaded', function () {
  const cible = document.getElementById('role-rotatif');
  if (!cible) return;

  // Les rôles qui défilent : ajoute, retire ou modifie librement.
const roles = [
  'étudiante en L3 informatique',
  'développeuse Web Back-end',
  'créatrice d’API',
  'conceptrice de petites applis',
  'correctrice de bugs',
  'pour le code propre et organisé',
  'fiable',
  'professeure particulière en maths',
  'manipulatrice de bases de données',
  'autonomne',
];


  const vitesseFrappe = 45;       // ms entre chaque caractère tapé
  const vitesseEffacement = 25;   // ms entre chaque caractère effacé
  const pauseApresFrappe = 2000;  // ms d'affichage complet avant d'effacer (le fameux "n secondes")
  const pauseApresEffacement = 300;

  const reduireMouvement = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let indexRole = 0;

  function tape(texte, i, callback) {
    cible.textContent = texte.slice(0, i);
    if (i < texte.length) {
      setTimeout(() => tape(texte, i + 1, callback), vitesseFrappe);
    } else {
      callback();
    }
  }

  function efface(texte, i, callback) {
    cible.textContent = texte.slice(0, i);
    if (i > 0) {
      setTimeout(() => efface(texte, i - 1, callback), vitesseEffacement);
    } else {
      callback();
    }
  }

  function boucle() {
    const role = roles[indexRole];

    if (reduireMouvement) {
      cible.textContent = role;
      setTimeout(() => {
        indexRole = (indexRole + 1) % roles.length;
        boucle();
      }, pauseApresFrappe + 800);
      return;
    }

    tape(role, 0, () => {
      setTimeout(() => {
        efface(role, role.length, () => {
          indexRole = (indexRole + 1) % roles.length;
          setTimeout(boucle, pauseApresEffacement);
        });
      }, pauseApresFrappe);
    });
  }

  boucle();
});
