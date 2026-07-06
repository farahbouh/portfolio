from flask import Flask, render_template
import json

app = Flask(__name__, template_folder='.', static_folder='static', static_url_path='/static')

@app.route('/projets')
def projets():
    with open('data/projets.json', encoding='utf-8') as f:
        liste_projets = json.load(f)
    return render_template('projets.html', projets=liste_projets)


if __name__ == '__main__':
    app.run(debug=True)