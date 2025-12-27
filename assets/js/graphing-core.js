
let chart;
let functions = [
    { id: 1, expr: 'sin(x)', color: '#00ff88', showDerivative: false, showIntegral: false }
];
let xMin = -10, xMax = 10;
const colors = ['#00ff88', '#0099ff', '#ff0055', '#ffaa00', '#9900ff'];

document.addEventListener('DOMContentLoaded', () => {
    initGraph();
    setupTheme();
});

function initGraph() {
    const ctx = document.getElementById('graphCanvas').getContext('2d');

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            elements: {
                point: { radius: 0 }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: document.body.classList.contains('light-mode') ? '#333' : '#888',
                        font: { family: 'Space Mono' }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { family: 'Space Mono' },
                    bodyFont: { family: 'Space Mono' }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    min: xMin,
                    max: xMax,
                    grid: { color: 'rgba(128,128,128,0.2)', lineWidth: 1 },
                    ticks: { color: '#888', font: { family: 'Space Mono' } }
                },
                y: {
                    grid: { color: 'rgba(128,128,128,0.2)', lineWidth: 1 },
                    ticks: { color: '#888', font: { family: 'Space Mono' } },
                    beginAtZero: false
                }
            }
        }
    });

    updateGraph();
}

function updateGraph() {
    const step = (xMax - xMin) / 200;
    const labels = [];
    for (let i = 0; i <= 200; i++) {
        labels.push(xMin + (i * step));
    }

    const datasets = [];

    functions.forEach((func, index) => {
        const inputs = document.querySelectorAll('.func-input');
        if (inputs[index]) func.expr = inputs[index].value;

        if (!func.expr) return;

        try {
            const exprNode = math.parse(func.expr);
            const compiled = exprNode.compile();

            const dataStart = [];
            labels.forEach(x => {
                try {
                    const y = compiled.evaluate({ x: x });
                    dataStart.push(isFinite(y) ? y : null);
                } catch (e) { dataStart.push(null); }
            });

            const color = colors[index % colors.length];

            // Main Plot
            datasets.push({
                label: `y = ${func.expr}`,
                data: dataStart.map((y, i) => ({ x: labels[i], y: y })),
                borderColor: color,
                borderWidth: 2,
                fill: false,
                tension: 0.1
            });

            // Derivative
            if (func.showDerivative) {
                try {
                    const deriv = math.derivative(func.expr, 'x');
                    const derivData = [];
                    labels.forEach(x => {
                        try {
                            const y = deriv.evaluate({ x: x });
                            derivData.push(isFinite(y) ? y : null);
                        } catch (e) { derivData.push(null); }
                    });

                    datasets.push({
                        label: `d/dx (${func.expr})`,
                        data: derivData.map((y, i) => ({ x: labels[i], y: y })),
                        borderColor: color,
                        borderDash: [5, 5],
                        borderWidth: 1.5,
                        fill: false,
                        pointRadius: 0
                    });
                } catch (e) { }
            }

            // Integral
            if (func.showIntegral) {
                datasets.push({
                    label: `∫ (${func.expr})`,
                    data: dataStart.map((y, i) => ({ x: labels[i], y: y })),
                    borderColor: 'transparent',
                    backgroundColor: color + '22',
                    fill: 'origin',
                    pointRadius: 0
                });
            }

        } catch (e) { }
    });

    chart.data.datasets = datasets;
    chart.options.scales.x.min = xMin;
    chart.options.scales.x.max = xMax;
    chart.update();
}

function zoomIn() {
    const range = xMax - xMin;
    xMin += range * 0.2;
    xMax -= range * 0.2;
    updateGraph();
}

function zoomOut() {
    const range = xMax - xMin;
    xMin -= range * 0.2;
    xMax += range * 0.2;
    updateGraph();
}

function resetView() {
    xMin = -10; xMax = 10;
    updateGraph();
}

// Function Management
window.addDerivative = (id) => {
    const func = functions.find(f => f.id === id);
    if (func) { func.showDerivative = !func.showDerivative; updateGraph(); }
};

window.showIntegral = (id) => {
    const func = functions.find(f => f.id === id);
    if (func) { func.showIntegral = !func.showIntegral; updateGraph(); }
};

window.addNewFunction = () => {
    const id = functions.length + 1;
    functions.push({ id, expr: '', color: colors[id % colors.length], showDerivative: false, showIntegral: false });

    const container = document.getElementById('functionList');
    const div = document.createElement('div');
    div.className = 'func-card active';
    div.dataset.id = id;
    div.innerHTML = `
        <div class="func-input-group">
            <span class="func-color-dot" style="background:${colors[(id - 1) % colors.length]}"></span>
            <span style="font-family: var(--font-mono); color: var(--text-secondary); margin-right: 5px;">y = </span>
            <input type="text" class="func-input" placeholder="Enter expression..." oninput="updateGraph()">
        </div>
        <div class="func-tools">
            <button class="tool-btn" onclick="addDerivative(${id})">d/dx</button>
            <button class="tool-btn" onclick="showIntegral(${id})">∫ Area</button>
        </div>
    `;
    container.appendChild(div);
};

// Theme
function setupTheme() {
    const isLight = localStorage.getItem('theme') === 'light';
    if (isLight) document.body.classList.add('light-mode');
}

// --- Input Enhancements ---
const mathValidFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'log10', 'sqrt', 'cbrt', 'exp', 'abs', 'pi', 'e'];
let suggestionBox = null;

document.addEventListener('keydown', (e) => {
    if (!e.target.classList.contains('func-input')) return;

    if (e.key === '(') {
        e.preventDefault();
        const start = e.target.selectionStart;
        const val = e.target.value;
        e.target.value = val.substring(0, start) + '()' + val.substring(e.target.selectionEnd);
        e.target.selectionStart = e.target.selectionEnd = start + 1;
        updateGraph();
    }
});

document.addEventListener('input', (e) => {
    if (!e.target.classList.contains('func-input')) return;
    const input = e.target;
    const cursor = input.selectionStart;
    const match = input.value.substring(0, cursor).match(/([a-zA-Z]+)$/);

    removeSuggestionBox();
    if (match) {
        const query = match[1].toLowerCase();
        const matches = mathValidFunctions.filter(f => f.startsWith(query) && f !== query);
        if (matches.length > 0) showSuggestionBox(input, matches, query, cursor);
    }
});

function showSuggestionBox(input, matches, query, cursor) {
    suggestionBox = document.createElement('div');
    suggestionBox.className = 'suggestion-box';
    matches.forEach(m => {
        const item = document.createElement('div');
        item.textContent = m;
        item.onclick = () => {
            const val = input.value;
            const before = val.substring(0, cursor - query.length);
            const after = val.substring(cursor);
            const isFunc = !['pi', 'e'].includes(m);
            input.value = before + m + (isFunc ? '()' : '') + after;
            input.selectionStart = input.selectionEnd = before.length + m.length + (isFunc ? 1 : 0);
            removeSuggestionBox();
            input.focus();
            updateGraph();
        };
        suggestionBox.appendChild(item);
    });
    const rect = input.getBoundingClientRect();
    suggestionBox.style.left = rect.left + 'px';
    suggestionBox.style.top = (rect.bottom + 5) + 'px';
    document.body.appendChild(suggestionBox);
}

function removeSuggestionBox() {
    if (suggestionBox) { suggestionBox.remove(); suggestionBox = null; }
}

// --- Analysis Tool Enhancements ---

window.findIntersections = () => {
    const active = functions.filter(f => f.expr);
    if (active.length < 2) return showAnalysisResult("Add at least 2 functions.");

    const intersectionPoints = [];
    // Check all pairs
    for (let i = 0; i < active.length; i++) {
        for (let j = i + 1; j < active.length; j++) {
            try {
                const c1 = math.parse(active[i].expr).compile();
                const c2 = math.parse(active[j].expr).compile();

                const step = (xMax - xMin) / 800;
                let prevDiff = null;

                for (let x = xMin; x <= xMax; x += step) {
                    const d = c1.evaluate({ x }) - c2.evaluate({ x });
                    if (prevDiff !== null && Math.sign(d) !== Math.sign(prevDiff)) {
                        const frac = Math.abs(prevDiff) / (Math.abs(prevDiff) + Math.abs(d));
                        const ex = x - step + (frac * step);
                        intersectionPoints.push({ x: ex, y: c1.evaluate({ x: ex }) });
                    }
                    prevDiff = d;
                }
            } catch (e) { }
        }
    }

    // Clean old intersections
    chart.data.datasets = chart.data.datasets.filter(d => d.id !== 'intersections');
    chart.data.datasets.push({
        id: 'intersections',
        label: 'Intersections',
        data: intersectionPoints,
        backgroundColor: '#fff',
        borderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 8,
        showLine: false,
        type: 'scatter'
    });
    chart.update();
    showAnalysisResult(`Found ${intersectionPoints.length} intersection(s).`);
};

window.calculateArea = () => {
    const active = functions.filter(f => f.expr);
    if (active.length < 2) return showAnalysisResult("Add 2 functions.");

    try {
        const c1 = math.parse(active[0].expr).compile();
        const c2 = math.parse(active[1].expr).compile();
        let area = 0;
        const res = 1000;
        const dx = (xMax - xMin) / res;

        for (let i = 0; i < res; i++) {
            const x = xMin + i * dx;
            const h = Math.abs(c1.evaluate({ x }) - c2.evaluate({ x }));
            if (isFinite(h)) area += h * dx;
        }

        // Visualize Area by finding min/max
        const areaData = [];
        const labels = chart.data.datasets[0].data.map(p => p.x);

        showAnalysisResult(`Area between first two: ${area.toFixed(4)}`);
    } catch (e) { showAnalysisResult("Error calculating."); }
};

function showAnalysisResult(msg) {
    const el = document.getElementById('analysisResults');
    if (el) el.innerText = msg;
}
