document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('projets-container');
    
    if (!container) return;
    
    fetch('/data/projets.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            return response.json();
        })
        .then(projets => {
            container.innerHTML = '';
            
            if (projets.length === 0) {
                container.innerHTML = '<p>Aucun projet à afficher</p>';
                return;
            }
            
            projets.forEach(projet => {
                const article = document.createElement('article');
                article.className = 'carte-projet';

                // Stocke les tags en minuscules pour pouvoir les retrouver
                // depuis le lien cliqué dans le bandeau défilant
                const tags = projet.tags || [];
                article.dataset.tags = tags.map(t => t.toLowerCase()).join(',');
                
                let badges = '';
                if (tags.length > 0) {
                    tags.forEach(tag => {
                        badges += `<span class="badge">${tag}</span>`;
                    });
                }
                
                let bouton = '';
                if (projet.lien_demo) {
                    bouton = `<a href="${projet.lien_demo}" target="_blank" rel="noopener" class="bouton-principal">Voir la démo</a>`;
                } else if (projet.lien_code) {
                    bouton = `<a href="${projet.lien_code}" target="_blank" rel="noopener" class="bouton-principal">Voir le code</a>`;
                }
                
                let liens = '';
                if (projet.lien_video) {
                    liens += `<a href="${projet.lien_video}" target="_blank" rel="noopener">Voir la démo admin (vidéo)</a>`;
                }
                if (projet.lien_demo && projet.lien_code) {
                    if (liens) liens += ' ';
                    liens += `<a href="${projet.lien_code}" target="_blank" rel="noopener">Code source</a>`;
                }
                
                article.innerHTML = `
                    <h2>${projet.titre || 'Sans titre'}</h2>
                    <p class="duree-projet">${projet.duree || ''}</p>
                    <p>${projet.description || ''}</p>
                    <div class="badges">${badges}</div>
                    ${bouton}
                    ${liens ? `<div class="liens-projet">${liens}</div>` : ''}
                `;
                
                container.appendChild(article);
            });

            // Si l'URL contient ?competence=Flask (venant du bandeau défilant),
            // on retrouve la/les cartes concernées, on les met en surbrillance
            // et on scrolle jusqu'à la première.
            const params = new URLSearchParams(window.location.search);
            const competence = params.get('competence');

            if (competence) {
                const cible = competence.toLowerCase();
                const cartes = container.querySelectorAll('.carte-projet');
                let premiereCorrespondance = null;

                cartes.forEach(carte => {
                    const tagsCarte = carte.dataset.tags ? carte.dataset.tags.split(',') : [];
                    if (tagsCarte.includes(cible)) {
                        carte.classList.add('carte-surlignee');
                        if (!premiereCorrespondance) {
                            premiereCorrespondance = carte;
                        }
                    }
                });

                if (premiereCorrespondance) {
                    premiereCorrespondance.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // La surbrillance s'estompe après quelques secondes
                    setTimeout(() => {
                        cartes.forEach(carte => carte.classList.remove('carte-surlignee'));
                    }, 3000);
                }
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            container.innerHTML = '<p>Erreur de chargement des projets</p>';
        });
});