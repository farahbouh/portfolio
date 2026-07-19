const form = document.getElementById('form-contact');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const boutonEnvoyer = form.querySelector('.bouton-envoyer');
  boutonEnvoyer.disabled = true;
  boutonEnvoyer.textContent = 'Envoi en cours...';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      window.location.href = '/merci';
    } else {
      alert("Une erreur est survenue, réessaie.");
      boutonEnvoyer.disabled = false;
      boutonEnvoyer.textContent = 'Envoyer';
    }
  } catch (err) {
    alert("Erreur réseau, réessaie.");
    boutonEnvoyer.disabled = false;
    boutonEnvoyer.textContent = 'Envoyer';
  }
});
