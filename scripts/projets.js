document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('projets-container');
    
    if (!container) return;
    
    fetch('/data/projets.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur reseau');
            }
            return response.json();
        })
        .then(projets => {
            container.innerHTML = '';
            
            if (projets.length === 0) {
                container.innerHTML = '<p class="error">Aucun projet a afficher</p>';
                return;
            }

            const params = new URLSearchParams(window.location.search);
            const competence = params.get('competence');
            const cible = competence ? competence.toLowerCase() : null;

            const correspond = (projet) =>
                cible && (projet.tags || []).some(t => t.toLowerCase() === cible);

            let listeAffichee = projets;
            if (cible) {
                const correspondants = projets.filter(correspond);
                const autres = projets.filter(p => !correspond(p));
                listeAffichee = [...correspondants, ...autres];
            }
            
            listeAffichee.forEach((projet, index) => {
                const article = document.createElement('article');
                article.className = 'carte-projet';
                article.style.animationDelay = (index * 0.05) + 's';

                const tags = projet.tags || [];
                const statut = projet.statut || 'brouillon';

                // Badge de statut
                let statutBadge = '';
                const statutLabels = {
                    'termine': 'Termine',
                    'en-cours': 'En cours',
                    'a-venir': 'A venir',
                    'brouillon': 'Brouillon'
                };
                const statutClasses = {
                    'termine': 'badge-statut badge-statut-termine',
                    'en-cours': 'badge-statut badge-statut-en-cours',
                    'a-venir': 'badge-statut badge-statut-a-venir',
                    'brouillon': 'badge-statut badge-statut-brouillon'
                };
                statutBadge = `<span class="${statutClasses[statut] || 'badge-statut'}">${statutLabels[statut] || statut}</span>`;

                if (correspond(projet)) {
                    article.classList.add('carte-surlignee');
                }
                
                let badges = '';
                if (tags.length > 0) {
                    tags.forEach(tag => {
                        badges += `<span class="badge">${tag}</span>`;
                    });
                }
                
                let bouton = '';
                if (projet.lien_demo) {
                    bouton = `<a href="${projet.lien_demo}" target="_blank" rel="noopener" class="bouton-principal">Voir la demo</a>`;
                } else if (projet.lien_code) {
                    bouton = `<a href="${projet.lien_code}" target="_blank" rel="noopener" class="bouton-principal">Voir le code</a>`;
                }
                
                let liens = '';
                if (projet.lien_video) {
                    liens += `<a href="${projet.lien_video}" target="_blank" rel="noopener" class="lien-secondaire">Voir la demo admin (video)</a>`;
                }
                if (projet.lien_demo && projet.lien_code) {
                    if (liens) liens += ' ';
                    liens += `<a href="${projet.lien_code}" target="_blank" rel="noopener" class="lien-secondaire">Code source</a>`;
                }
                
                article.innerHTML = `
                    ${statutBadge}
                    <h2>${projet.titre || 'Sans titre'}</h2>
                    ${projet.duree ? `<p class="duree-projet">${projet.duree}</p>` : ''}
                    <p class="description">${projet.description || ''}</p>
                    <div class="badges">${badges}</div>
                    ${bouton}
                    ${liens ? `<div class="liens-projet">${liens}</div>` : ''}
                `;
                
                container.appendChild(article);
            });

            if (cible) {
                const premiereCarte = container.querySelector('.carte-projet');
                if (premiereCarte) {
                    premiereCarte.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                setTimeout(() => {
                    container.querySelectorAll('.carte-surlignee')
                        .forEach(carte => carte.classList.remove('carte-surlignee'));
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            container.innerHTML = '<p class="error">Erreur de chargement des projets</p>';
        });
});