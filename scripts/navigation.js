document.addEventListener('DOMContentLoaded', function() {

  // ====== GLIDER ======
  const glider = document.querySelector('.glider');
  const navLinks = document.querySelectorAll('nav a');

  // Place le glider. Si animate=false, on coupe la transition le temps
  // de positionner l'élément, pour éviter tout mouvement visible.
  function moveGliderTo(element, animate = true) {
    const rect = element.getBoundingClientRect();
    const navRect = element.closest('nav').getBoundingClientRect();
    const left = rect.left - navRect.left;
    const width = rect.width;

    if (!animate) {
      glider.style.transition = 'none';
    }

    glider.style.left = left + 'px';
    glider.style.width = width + 'px';

    if (!animate) {
      // On force le navigateur à appliquer le style immédiatement
      // (sinon il regrouperait ce changement avec le suivant et la
      // coupure de transition n'aurait aucun effet visible).
      glider.offsetHeight;
      glider.style.transition = '';
    }
  }

  // Détermine quel lien correspond à la page actuellement affichée
  function setActiveLink() {
    const currentPage = document.body.dataset.page;
    let activeLink = null;

    navLinks.forEach(link => {
      if (link.dataset.page === currentPage) {
        link.classList.add('active');
        activeLink = link;
      } else {
        link.classList.remove('active');
      }
    });

    return activeLink;
  }

  const activeLink = setActiveLink();

  if (activeLink) {
    const saved = sessionStorage.getItem('gliderPos');

    if (saved) {
      // On a une position mémorisée depuis la page précédente :
      // on y place le glider sans animation (invisible pour l'utilisateur),
      // puis on l'anime vers sa vraie position sur CETTE page.
      const { left, width } = JSON.parse(saved);
      glider.style.transition = 'none';
      glider.style.left = left + 'px';
      glider.style.width = width + 'px';
      glider.offsetHeight;
      glider.style.transition = '';

      requestAnimationFrame(() => moveGliderTo(activeLink, true));
    } else {
      // Tout premier chargement du site : pas de position précédente,
      // pas de raison d'animer.
      moveGliderTo(activeLink, false);
    }
  }

  // Juste avant de suivre un lien, on sauvegarde où était le glider
  // pour pouvoir reprendre le mouvement sur la page suivante.
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const rect = glider.getBoundingClientRect();
      const navRect = glider.closest('nav').getBoundingClientRect();
      sessionStorage.setItem('gliderPos', JSON.stringify({
        left: rect.left - navRect.left,
        width: rect.width
      }));
      // Pas de preventDefault : la navigation normale continue.
    });
  });

  // Redimensionnement de la fenêtre
  window.addEventListener('resize', function() {
    const active = document.querySelector('nav a.active');
    if (active) {
      moveGliderTo(active, false);
    }
  });

});