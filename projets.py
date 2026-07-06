from flask import Flask, render_template
import json

# template_folder='.' : dit à Flask de chercher les .html à la racine, pas dans templates/
# static_folder='.', static_url_path='' : sert styles/, scripts/, static/ tels quels,
# sans avoir à réécrire tes liens en url_for()
app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')

@app.route('/')
def accueil():
    return render_template('index.html')

@app.route('/projets')
def projets():
    with open('data/projects.json', encoding='utf-8') as f:
        liste_projets = json.load(f)
    return render_template('projets.html', projets=liste_projets)

@app.route('/apropos')
def apropos():
    return render_template('apropos.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True)