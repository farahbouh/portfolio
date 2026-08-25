from flask import Flask, render_template, send_from_directory
import json
import os
app = Flask(__name__, template_folder='.', static_folder=None)
def get_competences():
    json_path = os.path.join('data', 'competences.json')
    with open(json_path, encoding='utf-8') as f:
        return json.load(f)
@app.route('/')
def accueil():
    competences = get_competences()
    return render_template('index.html', competences=competences)
@app.route('/projets')
def projets():
    json_path = os.path.join('data', 'projets.json')
    with open(json_path, encoding='utf-8') as f:
        liste_projets = json.load(f)
    competences = get_competences()
    return render_template('projets.html', projets=liste_projets, competences=competences)
@app.route('/apropos')
def apropos():
    competences = get_competences()
    return render_template('apropos.html', competences=competences)
@app.route('/contact')
def contact():
    return render_template('contact.html')
@app.route('/merci')
def merci():
    return render_template('merci.html')
@app.route('/scripts/<path:filename>')
def serve_scripts(filename):
    return send_from_directory('scripts', filename)
@app.route('/styles/<path:filename>')
def serve_styles(filename):
    return send_from_directory('styles', filename)
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)
@app.errorhandler(404)
def page_non_trouvee(e):
    return render_template('404.html'), 404
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))