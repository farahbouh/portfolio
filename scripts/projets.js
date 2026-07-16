document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('projets-container');
    const compteur = document.getElementById('compteur-projets');
    const filtresBtns = document.querySelectorAll('.filtre-btn');
    
    if (!container) return;

    let tousLesProjets = [];
    let filtreActif = 'tous';

    function afficherProjets() {
        let projetsFiltres = tousLesProjets;
        
        if (filtreActif !== 'tous') {
            projetsFiltres = tousLesProjets.filter(projet => {
                const tags = projet.tags || [];
                return tags.some(tag => tag === filtreActif);
            });
        }

        container.innerHTML = '';

        if (projetsFiltres.length === 0) {
            container.innerHTML = `
                <div style="width:100%; text-align:center; padding:60px 20px; color:#718096;">
                    <p style="font-size:48px; margin-bottom:16px;">🔍</p>
                    <h3>Aucun projet trouve pour cette competence</h3>
                    <p><a href="/projets" style="color:var(--bleu);">Voir tous les projets</a></p>
                </div>
            `;
            if (compteur) compteur.textContent = '0';
            return;
        }

        if (compteur) compteur.textContent = projetsFiltres.length;

        projetsFiltres.forEach((projet, index) => {
            const article = document.createElement('article');
            article.className = 'carte-projet';
            article.style.animationDelay = (index * 0.05) + 's';

            const tags = projet.tags || [];
            const statut = projet.statut || 'brouillon';

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

            let badges = '';
            tags.forEach(tag => {
                const estActif = filtreActif !== 'tous' && tag === filtreActif;
                badges += `<span class="badge${estActif ? ' badge-surlignee' : ''}">${tag}</span>`;
            });

            let bouton = '';
            if (projet.lien_demo) {
                bouton = `<a href="${projet.lien_demo}" target="_blank" rel="noopener" class="bouton-principal">Voir la demo</a>`;
            } else if (projet.lien_code) {
                bouton = `<a href="${projet.lien_code}" target="_blank" rel="noopener" class="bouton-principal">Voir le code</a>`;
            }

            const estSurbrillance = filtreActif !== 'tous' && (projet.tags || []).some(tag => tag === filtreActif);
            if (estSurbrillance) {
                article.classList.add('carte-surlignee');
            }

            article.innerHTML = `
                <span class="${statutClasses[statut] || 'badge-statut'}">${statutLabels[statut] || statut}</span>
                <h2>${projet.titre || 'Sans titre'}</h2>
                ${projet.duree ? `<p class="duree-projet">${projet.duree}</p>` : ''}
                <p class="description">${projet.description || ''}</p>
                <div class="badges">${badges}</div>
                ${bouton}
                ${projet.lien_video ? `<div class="liens-projet"><a href="${projet.lien_video}" target="_blank" rel="noopener" class="lien-secondaire">Voir la video</a></div>` : ''}
            `;

            container.appendChild(article);
        });
    }

    function chargerProjets() {
        fetch('/data/projets.json')
            .then(response => {
                if (!response.ok) throw new Error('Erreur reseau');
                return response.json();
            })
            .then(projets => {
                tousLesProjets = projets;
                
                const params = new URLSearchParams(window.location.search);
                const competence = params.get('competence');
                
                if (competence) {
                    filtreActif = competence;
                    filtresBtns.forEach(btn => {
                        btn.classList.toggle('active', btn.dataset.categorie === competence);
                    });
                }
                
                afficherProjets();
            })
            .catch(error => {
                console.error('Erreur:', error);
                container.innerHTML = '<p class="error">Erreur de chargement des projets</p>';
            });
    }

    filtresBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filtresBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const categorie = this.dataset.categorie;
            filtreActif = categorie;
            
            const url = new URL(window.location.href);
            if (categorie === 'tous') {
                url.searchParams.delete('competence');
            } else {
                url.searchParams.set('competence', categorie);
            }
            window.history.pushState({}, '', url);
            
            afficherProjets();
        });
    });

    window.addEventListener('popstate', function() {
        const params = new URLSearchParams(window.location.search);
        const competence = params.get('competence') || 'tous';
        
        filtresBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.categorie === competence);
        });
        
        filtreActif = competence;
        afficherProjets();
    });

    chargerProjets();
});