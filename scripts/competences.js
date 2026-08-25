document.addEventListener('DOMContentLoaded', function () {
    const marquee1 = document.getElementById('marquee-track-1');
    const marquee2 = document.getElementById('marquee-track-2');
    const badgesCompetences = document.getElementById('badges-competences');

    if (!marquee1 && !badgesCompetences) return;

    fetch('/data/competences.json')
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau');
            return response.json();
        })
        .then(competences => {
            // --- Marquee de la page d'accueil ---
            if (marquee1 && marquee2) {
                [marquee1, marquee2].forEach((track, index) => {
                    track.innerHTML = '';
                    if (index === 1) track.setAttribute('aria-hidden', 'true');

                    competences.forEach((comp, i) => {
                        const lien = document.createElement('a');
                        lien.href = `/projets?competence=${encodeURIComponent(comp)}`;
                        lien.className = 'marquee-item';
                        lien.textContent = comp;
                        if (index === 1) lien.tabIndex = -1;
                        track.appendChild(lien);

                        if (i < competences.length - 1) {
                            const sep = document.createElement('span');
                            sep.className = 'marquee-sep';
                            sep.textContent = '•';
                            track.appendChild(sep);
                        }
                    });
                });
            }

            // --- Badges compétences de la page à propos ---
            if (badgesCompetences) {
                badgesCompetences.innerHTML = '';
                competences.forEach(comp => {
                    const lien = document.createElement('a');
                    lien.href = `/projets?competence=${encodeURIComponent(comp)}`;
                    lien.className = 'badge-tech';
                    lien.textContent = comp;
                    badgesCompetences.appendChild(lien);
                });
            }
        })
        .catch(error => {
            console.error('Erreur de chargement des compétences:', error);
        });
});
