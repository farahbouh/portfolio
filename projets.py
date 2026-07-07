from flask import Flask, render_template, jsonify, send_from_directory
import json
import os

app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')

@app.route('/')
def accueil():
    return render_template('index.html')

@app.route('/projets')
def projets():
    json_path = os.path.join('data', 'projets.json')
    with open(json_path, encoding='utf-8') as f:
        liste_projets = json.load(f)
    return render_template('projets.html', projets=liste_projets)

@app.route('/api/projets')
def api_projets():
    json_path = os.path.join('data', 'projets.json')
    with open(json_path, encoding='utf-8') as f:
        liste_projets = json.load(f)
    return jsonify(liste_projets)

@app.route('/scripts/<path:filename>')
def serve_scripts(filename):
    return send_from_directory('scripts', filename)

@app.route('/styles/<path:filename>')
def serve_styles(filename):
    return send_from_directory('styles', filename)

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))