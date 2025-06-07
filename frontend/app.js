import GraphCanvas from './GraphCanvas.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('graph-canvas');
    const graphCanvas = new GraphCanvas(canvas);

    // Add-node button
    const addNodeButton = document.getElementById('add-node');
    addNodeButton.addEventListener('click', () => {
        graphCanvas.addNode();
    });

    // Remove-mode button
    const removeModeButton = document.getElementById('remove-mode');
    removeModeButton.addEventListener('click', () => {
        graphCanvas.toggleRemoveMode();
        removeModeButton.classList.toggle('clicked');
    });

    // Add-edge button
    const addEdgeButton = document.getElementById('add-edge');
    addEdgeButton.addEventListener('click', () => {
        graphCanvas.toggleAddEdgeMode();
        addEdgeButton.classList.toggle('clicked');
    });

    // Calculate polynomial button
    const calculateButton = document.getElementById('calculate-button');
    calculateButton.addEventListener('click', () => {
        graphCanvas.calculatePolynomial();
    });
});
