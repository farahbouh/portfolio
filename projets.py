from flask import Flask, render_template
import json
import os

app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')



@app.route('/projets')
def projets():
    json_path = os.path.join('data', 'projets.json')
    if not os.path.exists(json_path):
        return "Erreur : Fichier projets.json manquant", 404
    
    with open(json_path, encoding='utf-8') as f:
        liste_projets = json.load(f)
    return render_template('projets.html', projets=liste_projets)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))