# Chromatic Polynomial Calculator

This project is a web application for drawing graphs and calculating their chromatic polynomials using the deletion-contraction algorithm. It was developed as my final project for the CS50x course. You can find the YouTube video submitted to CS50 [here](https://youtu.be/rbwk2K6s1QU).


## What is a Chromatic Polynomial Calculator?

In graph theory, attempts to prove the [four color theorem](https://en.wikipedia.org/wiki/Four_color_theorem) gave birth to the study of chromatic polynomials. The chromatic polynomial $P(G,k)$ counts the number of ways to color graph $G$ using $k$ colors.

The way this calculator finds the chromatic polynomial is by using the deletion-contraction algorithm. The algorithm is based on the fact that, for any edge $e$ in $G$, 
$$P(G,k) = P(G-e,k) - P(G/e,k).$$

Here, $G-e$ represents graph $G$ without edge $e$ (deletion) and $G/e$ represents graph $G$ after merging the two vertices at each end of edge $e$ (contraction). The [time complexity of this algorithm](https://informatika.stei.itb.ac.id/~rinaldi.munir/Matdis/2018-2019/Makalah/Makalah-Matdis-2018-134.pdf) is $O(\phi^{E+N})$, where $E$ and $N$ are the number of edges and nodes in $G$, respectively. For that reason, **this calculator can not calculate the chromatic polynomial of graphs with many vertices and/or edges in a reasonable amount of time.**

## Features

- **Interactive Graph Editor:** Add, move, and remove nodes and edges on a canvas.
- **Chromatic Polynomial Calculation:** Computes the chromatic polynomial for any simple undirected graph.
- **LaTeX Rendering:** Displays the polynomial in mathematical notation using MathJax.

## Project Structure

```
backend/
    calculator.py      # Chromatic polynomial logic
    graph.py           # Graph data structure and operations
    polynomial.py      # Polynomial class for symbolic manipulation
    server.py          # Flask API server
frontend/
    app.js             # Main frontend logic
    index.html         # Main HTML page
    styles.css         # Styling
    GraphCanvas.js     # Graph drawing and interaction logic
```

## How to Run

### 1. Backend (Python/Flask)

1. Install dependencies:
    ```sh
    pip install flask flask-cors
    ```
2. Start the backend server:
    ```sh
    cd backend
    python server.py
    ```
   The server will run at `http://localhost:5000`.

### 2. Frontend (Local Server Required)

1. Open a terminal and navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```
2. Start a simple HTTP server. For example, using Python:
    ```sh
    python -m http.server 8000
    ```
3. Open your browser and go to [http://localhost:8000](http://localhost:8000).

**Note:** Opening `index.html` directly may cause issues with module imports or API requests. Always use a local server.

## Usage

- **Add Node:** Click the green `+` button.
- **Remove Mode:** Click the red `-` button, then click nodes/edges to remove.
- **Add Edge Mode:** Click the gray `/` button, then select two nodes to connect.
- **Move Node:** Drag a node to reposition it.
- **Calculate:** Click "Calculate Chromatic Polynomial" to see the result.

## Technologies

- **Frontend:** HTML, CSS, JavaScript (ES6 modules)
- **Backend:** Python 3, Flask
- **Math Rendering:** MathJax

## License

This project is under an MIT License.

---

*Created by Mateo Lizcano, for CS50x*
