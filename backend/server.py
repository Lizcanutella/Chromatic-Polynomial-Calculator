from flask import Flask, request, jsonify
from graph import Graph
from calculator import chromatic_polynomial
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/chromatic', methods=['POST'])
def chromatic():
    data = request.json
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    g = Graph(set(nodes))
    for u, v in edges:
        g.add_edge(u, v)
    poly = chromatic_polynomial(g)
    return jsonify({'polynomial': str(poly)})

if __name__ == '__main__':
    app.run(debug=True)
