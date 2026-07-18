document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('projets-container');
    const compteur = document.getElementById('compteur-projets');
    const filtresBtns = document.querySelectorAll('.filtre-btn');
    
    if (!container) return;

    let tousLesProjets = [];
    let filtreActif = 'tous';

    // --- MAPPINGS (sécurisés) ---
    const statutLabels = {
        'termine': 'Terminé',
        'en-cours': 'En cours',
        'a-venir': 'À venir',
        'brouillon': 'Brouillon'
    };
    const statutClasses = {
        'termine': 'badge-statut badge-statut-termine',
        'en-cours': 'badge-statut badge-statut-en-cours',
        'a-venir': 'badge-statut badge-statut-a-venir',
        'brouillon': 'badge-statut badge-statut-brouillon'
    };

    const typeLabels = {
        'personnel': 'Personnel',
        'academique': 'Académique',
        'stage': 'Stage'
    };
    const typeClasses = {
        'personnel': 'badge-type badge-type-personnel',
        'academique': 'badge-type badge-type-academique',
        'stage': 'badge-type badge-type-stage'
    };

    const collabLabels = {
        'en autonomie': 'En autonomie',
        'equipe': 'En équipe'
    };

    // --- Fonctions sécurisées ---
    function getStatutClass(statut) {
        return statutClasses[statut] || statutClasses['brouillon'];
    }
    function getTypeClass(type) {
        return typeClasses[type] || 'badge-type';
    }
    function getStatutLabel(statut) {
        return statutLabels[statut] || statut;
    }
    function getTypeLabel(type) {
        return typeLabels[type] || type;
    }
    function getCollabLabel(collab) {
        return collabLabels[collab] || collab;
    }

    // --- FONCTION D'AFFICHAGE ---
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
                <div class="aucun-projet">
                    <h3>Aucun projet trouvé pour cette compétence</h3>
                    <p><a href="/projets" class="lien-retour">Voir tous les projets</a></p>
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
            const type = projet.type || 'personnel';
            const collaboration = projet.collaboration || 'en autonomie';

            // --- Utilisation des fonctions sécurisées ---
            const statutClass = getStatutClass(statut);
            const statutLabel = getStatutLabel(statut);
            const typeClass = getTypeClass(type);
            const typeLabel = getTypeLabel(type);
            const collabLabel = getCollabLabel(collaboration);

            // Badges tags
            let badges = '';
            tags.forEach(tag => {
                const estActif = filtreActif !== 'tous' && tag === filtreActif;
                badges += `<span class="badge${estActif ? ' badge-surlignee' : ''}">${tag}</span>`;
            });

            // Bouton
            let bouton = '';
            if (projet.lien_demo) {
                bouton = `<a href="${projet.lien_demo}" target="_blank" rel="noopener" class="bouton-principal">Voir la démo</a>`;
            } else if (projet.lien_code) {
                bouton = `<a href="${projet.lien_code}" target="_blank" rel="noopener" class="bouton-principal">Voir le code</a>`;
            }

            // Surbrillance
            const estSurbrillance = filtreActif !== 'tous' && (projet.tags || []).some(tag => tag === filtreActif);
            if (estSurbrillance) {
                article.classList.add('carte-surlignee');
            }

            // Durée + collaboration
            let dureeTexte = projet.duree || '';
            const affichageDuree = dureeTexte ? `${dureeTexte} · ${collabLabel}` : collabLabel;

            // --- CONSTRUCTION DE LA CARTE ---
            article.innerHTML = `
                <div class="meta-badges">
                    <span class="${statutClass}">${statutLabel}</span>
                    <span class="${typeClass}">${typeLabel}</span>
                </div>

                <h2>${projet.titre || 'Sans titre'}</h2>

                <p class="duree-projet">${affichageDuree}</p>

                <p class="description">${projet.description || ''}</p>

                <div class="badges">${badges}</div>

                ${bouton}
                ${projet.lien_video ? `<div class="liens-projet"><a href="${projet.lien_video}" target="_blank" rel="noopener" class="lien-secondaire">Voir la vidéo</a></div>` : ''}
            `;

            container.appendChild(article);
        });
    }

    // --- CHARGEMENT DES PROJETS ---
    function chargerProjets() {
        fetch('/data/projets.json')
            .then(response => {
                if (!response.ok) throw new Error('Erreur réseau');
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

    // --- ÉVÉNEMENTS FILTRES ---
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

    // --- GESTION DU RETOUR ARRIÈRE ---
    window.addEventListener('popstate', function() {
        const params = new URLSearchParams(window.location.search);
        const competence = params.get('competence') || 'tous';
        
        filtresBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.categorie === competence);
        });
        
        filtreActif = competence;
        afficherProjets();
    });

    // --- LANCEMENT ---
    chargerProjets();
});