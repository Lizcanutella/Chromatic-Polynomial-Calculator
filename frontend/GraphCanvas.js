/**
 * GraphCanvas handles all graph drawing, user interaction, and communication with the backend.
 * The following functions were mostly AI-generated: getEdgeAtPosition(), getNodeAtPosition(), draw(), drawNodes(), drawEdges().
 */
class GraphCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.nodes = []; 
        this.edges = []; 
        this.draggingNode = null; // Node currently being dragged
        this.removeMode = false; 
        this.addEdgeMode = false;
        this.nodeIdCounter = 1;
        this.freedNodeIds = []; // IDs available for reuse after node removal
        this.edgeStartNode = null; // First node selected for edge creation
        this.tempEdgePos = null; // Mouse position for drawing a temporary edge to cursor
        this.init();
    }

    init() {
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.draw();
    }

    addNode() {
        let id;
        if (this.freedNodeIds.length > 0) {
            id = this.freedNodeIds.shift();
        } else {
            id = this.nodeIdCounter++;
        }
        const x = 300;
        const y = 200;
        this.nodes.push({ id, x, y, radius: 18 });
        this.draw();
    }

    toggleRemoveMode() {
        if(this.addEdgeMode) {
            this.toggleAddEdgeMode();
            const addEdgeButton = document.getElementById('add-edge');
            addEdgeButton.classList.toggle('clicked')
        }
        if(this.removeMode){
            this.removeMode = false;
            this.canvas.style.cursor = "crosshair";
        }
        else {
            this.removeMode = true;
            this.canvas.style.cursor = "not-allowed";
        }
        this.edgeStartNode = null;
        this.draw();
    }

    toggleAddEdgeMode() {
        if(this.removeMode) {
            this.toggleRemoveMode();
            const removeModeButton = document.getElementById('remove-mode');
            removeModeButton.classList.toggle('clicked');
        }
        if(this.addEdgeMode) {
            this.addEdgeMode = false;
            this.canvas.style.cursor = "crosshair";
        }
        else {
            this.addEdgeMode = true;
            this.canvas.style.cursor = "copy";
        }
        this.edgeStartNode = null;
        this.draw();
    }

    getEdgeAtPosition(x, y, tolerance = 6) {
        for (const edge of this.edges) {
            const { from, to } = edge;
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            if (length === 0) continue;
            const t = Math.max(0, Math.min(1, ((x - from.x) * dx + (y - from.y) * dy) / (length * length)));
            const projX = from.x + t * dx;
            const projY = from.y + t * dy;
            const dist = Math.sqrt((x - projX) ** 2 + (y - projY) ** 2);
            if (dist <= tolerance) return edge;
        }
        return null;
    }

    onMouseDown(event) {
        const { offsetX, offsetY } = event;
        const node = this.getNodeAtPosition(offsetX, offsetY);
        if (this.removeMode) {
            if (node) {
                this.nodes = this.nodes.filter(n => n !== node);
                this.edges = this.edges.filter(e => e.from !== node && e.to !== node);
                this.freedNodeIds.push(node.id);
                this.freedNodeIds.sort((a, b) => a - b);
                this.draw();
                return;
            }
            const edge = this.getEdgeAtPosition(offsetX, offsetY);
            if (edge) {
                this.edges = this.edges.filter(e => e !== edge);
                this.draw();
                return;
            }
            return;
        }
        else if (this.addEdgeMode) {
            if (node) {
                if (!this.edgeStartNode) {
                    this.edgeStartNode = node;
                    this.tempEdgePos = { x: offsetX, y: offsetY }; 
                } 
                else if (this.edgeStartNode !== node) {
                    // Second node selected, create edge if it does not exist already
                    const exists = this.edges.some(
                        e =>
                            (e.from === this.edgeStartNode && e.to === node) ||
                            (e.from === node && e.to === this.edgeStartNode)
                    );
                    if (!exists) {
                        this.connectNodes(this.edgeStartNode, node);
                    }
                    this.edgeStartNode = null; 
                    this.draw();
                } else {
                // Clicked same node, reset selection
                this.edgeStartNode = null;
                this.tempEdgePos = null;
                this.draw();
                }
            }
            else {
                // Clicked canvas, reset selection
                this.edgeStartNode = null;
                this.tempEdgePos = null;
                this.draw();
            }
            return;
        }
        if (node) {
            this.draggingNode = node;
            node.dragging = true;
        }
    }

    onMouseUp() {
        if (this.draggingNode) {
            this.draggingNode.dragging = false;
            this.draggingNode = null;
        }
    }

    onMouseMove(event) {
        if (this.draggingNode) {
            const { offsetX, offsetY } = event;
            this.draggingNode.x = offsetX;
            this.draggingNode.y = offsetY;
            this.draw();
        } else if (this.addEdgeMode && this.edgeStartNode) {
            const { offsetX, offsetY } = event;
            this.tempEdgePos = { x: offsetX, y: offsetY };
            this.draw();
        }
    }

    getNodeAtPosition(x, y) {
        return this.nodes.find(node => {
            const dx = node.x - x;
            const dy = node.y - y;
            return Math.sqrt(dx * dx + dy * dy) < node.radius;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawEdges();
        this.drawNodes();
        
        // Draw temp edge to cursor if in addEdgeMode and first node is selected
        if (this.addEdgeMode && this.edgeStartNode && this.tempEdgePos) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.edgeStartNode.x, this.edgeStartNode.y);
            this.ctx.lineTo(this.tempEdgePos.x, this.tempEdgePos.y);
            this.ctx.strokeStyle = 'red';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    drawNodes() {
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'blue';
            this.ctx.fill();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.closePath();

            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.id, node.x, node.y);
        });
    }

    drawEdges() {
        this.edges.forEach(edge => {
            this.ctx.beginPath();
            this.ctx.moveTo(edge.from.x, edge.from.y);
            this.ctx.lineTo(edge.to.x, edge.to.y);
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.closePath();
        });
    }

    connectNodes(nodeA, nodeB) {
        this.edges.push({ from: nodeA, to: nodeB });
        this.draw();
    }

    /**
     * Sends the current graph to the backend and displays the chromatic polynomial.
     * Uses MathJax to render the polynomial as LaTeX.
     */
    async calculatePolynomial() {
        const outputDiv = document.getElementById('output');
        outputDiv.style.display = "block";
        outputDiv.textContent = "Calculating...";
        const nodes = this.nodes.map(n => n.id);
        const edges = this.edges.map(e => [e.from.id, e.to.id]);
        try {
            const response = await fetch('http://localhost:5000/chromatic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges })
            });
            const data = await response.json();
            // Insert the polynomial as LaTeX for MathJax rendering
            outputDiv.innerHTML = `\\(${data.polynomial}\\)`;
            if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise([outputDiv]);
            }
        } catch (error) {
            outputDiv.textContent = "Error calculating polynomial.";
        }
    }
}

export default GraphCanvas;
