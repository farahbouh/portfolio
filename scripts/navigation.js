document.addEventListener('DOMContentLoaded', function() {
    const glider = document.querySelector('.glider');
    const activeLink = document.querySelector('nav a.active');

    if (!glider || !activeLink) return;

    function positionGlider() {
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = activeLink.closest('nav').getBoundingClientRect();
        
        glider.style.left = (linkRect.left - navRect.left) + 'px';
        glider.style.width = linkRect.width + 'px';
    }

    // Positionne immediatement sans transition au chargement
    glider.style.transition = 'none';
    positionGlider();

    // Reactive la transition pour les futurs mouvements
    requestAnimationFrame(function() {
        glider.style.transition = 'all 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)';
    });

    // Recalcule au resize
    let timer;
    window.addEventListener('resize', function() {
        clearTimeout(timer);
        timer = setTimeout(positionGlider, 100);
    });
});