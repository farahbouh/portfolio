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
                
                let badges = '';
                if (projet.tags && projet.tags.length > 0) {
                    projet.tags.forEach(tag => {
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
        })
        .catch(error => {
            console.error('Erreur:', error);
            container.innerHTML = '<p>Erreur de chargement des projets</p>';
        });
});