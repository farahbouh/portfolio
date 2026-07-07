from flask import Flask, render_template
import json
import os

app = Flask(__name__, 
            template_folder='.',      # Cherche les HTML à la racine
            static_folder='.',        # Cherche CSS/JS à la racine
            static_url_path='')       # Pas de préfixe /static

@app.route('/')
def accueil():
    return render_template('index.html')

@app.route('/projets')
def projets():
    json_path = os.path.join('data', 'projets.json')
    with open(json_path, encoding='utf-8') as f:
        liste_projets = json.load(f)
    return render_template('projets.html', projets=liste_projets)

@app.route('/apropos')
def apropos():
    return render_template('apropos.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))