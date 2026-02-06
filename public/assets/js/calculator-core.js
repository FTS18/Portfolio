/**
 * Calculator Core Engine
 * Handles navigation, rendering, and event listeners for the calculator suite.
 */

document.addEventListener('DOMContentLoaded', () => {


    const sidebarItems = document.querySelectorAll('.calc-link');
    const mainContent = document.getElementById('calculator-content');
    const categoryTitle = document.getElementById('category-title');

    // Sidebar Accordion Logic
    document.querySelectorAll('.category-title').forEach(title => {
        title.addEventListener('click', () => {
            // Toggle current
            title.parentElement.classList.toggle('expanded');
        });
    });

    // Handle Link Clicks
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const category = item.dataset.category;
            const id = item.dataset.id;
            loadCalculator(category, id);

            // UI Update
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Mobile: Close menu if needed
            document.querySelector('.calc-sidebar').classList.remove('open');
        });
    });

    // Mobile FAB Logic
    const fab = document.getElementById('mobile-menu-fab');
    if (fab) {
        fab.addEventListener('click', () => {
            const sidebar = document.querySelector('.calc-sidebar');
            sidebar.classList.toggle('open');
        });
    }

    // Initialize standard calculators from config
    function loadCalculator(category, id) {
        // Handle "custom" scientific calculator
        if (id === 'scientific') {
            document.getElementById('generic-calculator').style.display = 'none';
            document.getElementById('scientific-calculator').style.display = 'flex';
            categoryTitle.innerText = "Scientific Calculator";

            // Persist
            localStorage.setItem('lastCalc', JSON.stringify({ category: 'math', id: 'scientific' }));
            window.location.hash = `math/scientific`;
            return;
        }

        const config = window.calculatorConfig[category]?.[id];
        if (!config) return console.error(`Calculator ${id} not found in ${category}`);

        document.getElementById('scientific-calculator').style.display = 'none';
        document.getElementById('generic-calculator').style.display = 'block';

        // ACCORDION: Auto-expand parent category
        const activeLink = document.querySelector(`.calc-link[data-id="${id}"]`);
        if (activeLink) {
            const parentCat = activeLink.closest('.calc-category');
            if (parentCat) parentCat.classList.add('expanded');
        }

        categoryTitle.innerText = config.title;
        if (config.description) document.querySelector('.calc-description').innerText = config.description;

        localStorage.setItem('lastCalc', JSON.stringify({ category, id }));
        window.location.hash = `${category}/${id}`;

        // Render inputs
        const inputsContainer = document.getElementById('calc-inputs');
        inputsContainer.innerHTML = '';

        config.inputs.forEach(input => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-group';

            const label = document.createElement('label');
            label.innerText = input.label;
            wrapper.appendChild(label);

            if (input.type === 'select') {
                // HIDDEN INPUT for value logic
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.id = `input-${input.id}`;
                hiddenInput.value = input.options[0].value;
                wrapper.appendChild(hiddenInput);

                // CUSTOM SELECT CONTAINER
                const customSelect = document.createElement('div');
                customSelect.className = 'custom-select';

                // SELECTED ITEM DISPLAY
                const selectedDiv = document.createElement('div');
                selectedDiv.className = 'select-selected';
                selectedDiv.innerText = input.options[0].label;
                customSelect.appendChild(selectedDiv);

                // DROPDOWN ITEMS CONTAINER
                const itemsDiv = document.createElement('div');
                itemsDiv.className = 'select-items';

                input.options.forEach(opt => {
                    const item = document.createElement('div');
                    item.innerText = opt.label;
                    if (opt.value === input.options[0].value) item.className = 'same-as-selected';

                    item.addEventListener('click', function () {
                        // Update Hidden Input
                        hiddenInput.value = opt.value;
                        selectedDiv.innerText = opt.label;

                        // Update UI classes
                        itemsDiv.querySelectorAll('.same-as-selected').forEach(el => el.classList.remove('same-as-selected'));
                        this.classList.add('same-as-selected');
                        selectedDiv.click(); // Close dropdown
                    });
                    itemsDiv.appendChild(item);
                });

                customSelect.appendChild(itemsDiv);
                wrapper.appendChild(customSelect);

                // TOGGLE OPEN/CLOSE
                selectedDiv.addEventListener('click', function (e) {
                    e.stopPropagation();
                    closeAllSelect(this);
                    itemsDiv.classList.toggle('select-open');
                    this.classList.toggle('select-arrow-active');
                });
            } else if (input.type === 'textarea') {
                const area = document.createElement('textarea');
                area.id = `input-${input.id}`;
                area.placeholder = input.placeholder || '';
                area.rows = input.rows || 3;
                area.style.width = '100%';
                area.style.background = 'var(--glass-bg)';
                area.style.border = '1px solid var(--glass-border)';
                area.style.color = 'var(--text-primary)';
                area.style.padding = '10px';
                area.style.borderRadius = '8px';
                area.style.fontFamily = 'monospace';
                wrapper.appendChild(area);
            } else {
                const field = document.createElement('input');
                field.type = input.type || 'text';
                field.id = `input-${input.id}`;
                field.placeholder = input.placeholder || '';
                if (input.step) field.step = input.step;
                wrapper.appendChild(field);
            }

            inputsContainer.appendChild(wrapper);
        });

        // Set calculate button action
        const btn = document.getElementById('calc-action-btn');
        btn.onclick = () => {
            const values = {};
            config.inputs.forEach(i => {
                values[i.id] = document.getElementById(`input-${i.id}`).value;
            });

            const result = config.calculate(values);
            displayResult(result);
        };

        // Clear previous results
        document.getElementById('calc-results').innerHTML = '<div class="placeholder-result">Result will appear here</div>';
    }

    // Let currentChart and displayResult be outside loadCalculator to avoid re-declaration
    let currentChart = null;

    function displayResult(result) {
        const container = document.getElementById('calc-results');
        const chartWrapper = document.getElementById('chart-wrapper');
        const ctx = document.getElementById('resultChart').getContext('2d');

        container.innerHTML = '';

        // Hide chart by default
        chartWrapper.style.display = 'none';

        if (typeof result === 'string') {
            container.innerHTML = `<div class="error-msg">${result}</div>`;
            return;
        }

        // Separate chart data from text results
        const displayData = { ...result };
        const chartData = displayData._chartData;
        delete displayData._chartData;

        // Render Text Results
        for (const [key, value] of Object.entries(displayData)) {
            if (key.startsWith('_')) continue; // Skip internal keys like _visualScale

            const row = document.createElement('div');
            row.className = 'result-row';
            row.innerHTML = `<span class="res-label">${key}</span> <span class="res-value">${value}</span>`;
            container.appendChild(row);
        }

        // Render Chart if data exists
        if (chartData && window.Chart) {
            chartWrapper.style.display = 'block';

            // Show export button
            const exportBtn = document.getElementById('calc-export-btn');
            if (exportBtn) exportBtn.style.display = 'inline-block';

            if (currentChart) {
                currentChart.destroy();
            }

            // Apply global font settings for Chart.js
            Chart.defaults.color = '#ccc';
            Chart.defaults.font.family = '"Space Mono", monospace';

            // Construct Data Configuration
            let dataConfig = {};
            if (chartData.datasets) {
                // Multi-dataset support (Line charts)
                dataConfig = {
                    labels: chartData.labels,
                    datasets: chartData.datasets
                };
            } else {
                // Single dataset support (Doughnut)
                dataConfig = {
                    labels: chartData.labels,
                    datasets: [{
                        data: chartData.data,
                        backgroundColor: chartData.colors || [
                            'rgba(74, 222, 128, 0.7)', // Green
                            'rgba(56, 189, 248, 0.7)', // Blue
                            'rgba(248, 113, 113, 0.7)', // Red
                            'rgba(250, 204, 21, 0.7)'  // Yellow
                        ],
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        fill: chartData.fill || false,
                        tension: 0.4
                    }]
                };
            }

            currentChart = new Chart(ctx, {
                type: chartData.type || 'doughnut',
                data: dataConfig,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { usePointStyle: true, boxWidth: 10, color: '#fff' }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#00ff88',
                            bodyColor: '#fff',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1
                        }
                    },
                    scales: (chartData.type === 'line' || chartData.type === 'bar') ? {
                        x: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#888' }
                        },
                        y: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#888' },
                            beginAtZero: true
                        }
                    } : {
                        x: { display: false },
                        y: { display: false }
                    },
                    ...chartData.options
                }
            });
        }

        // Render Visual Scale if exists (e.g., BMI Bar)
        const visualScale = result._visualScale;
        if (visualScale) {
            const scaleContainer = document.createElement('div');
            scaleContainer.className = 'visual-scale-container';
            scaleContainer.style.marginTop = '20px';
            scaleContainer.style.background = 'rgba(255,255,255,0.05)';
            scaleContainer.style.padding = '15px';
            scaleContainer.style.borderRadius = '12px';

            const bar = document.createElement('div');
            bar.style.height = '12px';
            bar.style.width = '100%';
            bar.style.background = 'linear-gradient(90deg, #3498db 0%, #2ecc71 35%, #f1c40f 60%, #e74c3c 100%)';
            bar.style.borderRadius = '6px';
            bar.style.position = 'relative';

            const pointer = document.createElement('div');
            pointer.style.position = 'absolute';
            pointer.style.left = `${Math.min(Math.max(visualScale.value, 0), 100)}%`; // Clamp 0-100
            pointer.style.top = '-6px';
            pointer.style.width = '4px';
            pointer.style.height = '24px';
            pointer.style.background = '#fff';
            pointer.style.borderRadius = '2px';
            pointer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
            pointer.style.transform = 'translateX(-50%)';

            const label = document.createElement('div');
            label.innerText = visualScale.label || '';
            label.style.textAlign = 'center';
            label.style.marginTop = '10px';
            label.style.color = visualScale.color || '#fff';
            label.style.fontWeight = 'bold';

            bar.appendChild(pointer);
            scaleContainer.appendChild(bar);
            scaleContainer.appendChild(label);
            container.appendChild(scaleContainer);
        }
    }

    // Close all custom select boxes when clicking outside
    // --- PDF Export ---
    window.exportPDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const primaryColor = [16, 185, 129]; // Emerald Green

        // Header
        doc.setFillColor(30, 30, 30);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text("CALC.IO REPORT", 20, 25);

        // Title & Info
        const title = document.getElementById('category-title').innerText;
        doc.setFontSize(14);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(title, 20, 50);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 58);

        let y = 75;

        // Section: Inputs
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text("INPUTS", 20, y);
        y += 8;
        doc.setDrawColor(230, 230, 230);
        doc.line(20, y - 2, 190, y - 2);

        const inputGroups = document.querySelectorAll('.input-group');
        inputGroups.forEach(group => {
            const label = group.querySelector('label')?.innerText || "";
            const input = group.querySelector('input, select, textarea');
            let val = input ? input.value : "";

            // Handle select display (get label if possible)
            if (input?.classList.contains('custom-select')) {
                val = group.querySelector('.select-selected')?.innerText || val;
            }

            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(label, 25, y);
            doc.setTextColor(0, 0, 0);
            doc.text(val.toString(), 100, y);
            y += 8;

            if (y > 270) { doc.addPage(); y = 20; }
        });

        y += 10;

        // Section: Results
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text("RESULTS", 20, y);
        y += 8;
        doc.line(20, y - 2, 190, y - 2);

        const resultRows = document.querySelectorAll('.result-row');
        resultRows.forEach(row => {
            const label = row.querySelector('.res-label')?.innerText || "";
            const val = row.querySelector('.res-value')?.innerText || "";

            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(label, 25, y);
            doc.setFontSize(11);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text(val, 100, y);
            y += 10;

            if (y > 270) { doc.addPage(); y = 20; }
        });

        // Chart
        const canvas = document.getElementById('resultChart');
        if (canvas && canvas.offsetParent !== null) { // Check if visible
            if (y > 180) { doc.addPage(); y = 20; }
            y += 10;
            const imgData = canvas.toDataURL('image/png', 1.0);
            doc.addImage(imgData, 'PNG', 20, y, 170, 90);
        }

        doc.save(`calc_report_${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    };
    function closeAllSelect(elmnt) {
        const items = document.getElementsByClassName("select-items");
        const selected = document.getElementsByClassName("select-selected");
        const arrNo = [];

        for (let i = 0; i < selected.length; i++) {
            if (elmnt == selected[i]) arrNo.push(i);
            else selected[i].classList.remove("select-arrow-active");
        }
        for (let i = 0; i < items.length; i++) {
            if (arrNo.indexOf(i) == -1) items[i].classList.remove("select-open");
        }
    }
    document.addEventListener("click", closeAllSelect);

    // Initial Calculator Load Logic (Router)
    function initRouter() {
        const hash = window.location.hash.substring(1);

        if (hash) {
            const [cat, id] = hash.split('/');
            if (cat && id) {
                if (id === 'scientific') {
                    loadCalculator('math', 'scientific');
                    return;
                }
                if (window.calculatorConfig[cat]?.[id]) {
                    loadCalculator(cat, id);
                    return;
                }
            }
        }

        // Fallback to LocalStorage
        const saved = localStorage.getItem('lastCalc');
        if (saved) {
            try {
                const { category, id } = JSON.parse(saved);
                if (id === 'scientific') {
                    loadCalculator('math', 'scientific');
                    return;
                }
                if (window.calculatorConfig[category]?.[id]) {
                    loadCalculator(category, id);
                    return;
                }
            } catch (e) { }
        }

        // Default
        loadCalculator('financial', 'mortgage');
    }

    // Call init
    initRouter();

    // Listen for hash changes manually
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const [cat, id] = hash.split('/');
            if (cat && id) {
                loadCalculator(cat, id);
            }
        }
    });
    // Navbar Customization (Wait for generic header to load)
    const checkHeader = setInterval(() => {
        const logo = document.querySelector('.logo a');
        const linksContainer = document.querySelector('.links');

        if (logo && linksContainer) {
            clearInterval(checkHeader);

            // 1. Change Brand
            logo.innerText = 'calc.io';
            logo.href = '/calculator';

            // 2. Inject Currency Selector
            // 2. Inject Currency Selector (Custom Dropdown)
            if (!document.getElementById('currency-select-container')) {
                const currencyLi = document.createElement('li');
                currencyLi.id = 'currency-select-container';
                currencyLi.style.display = 'flex';
                currencyLi.style.alignItems = 'center';
                currencyLi.style.marginLeft = '15px';

                // Custom Select UI
                const customSelect = document.createElement('div');
                customSelect.className = 'custom-select';
                customSelect.id = 'navbar-currency-select'; // Helper ID
                // Styles are now handled by #currency-select-container CSS pattern

                const selectedDiv = document.createElement('div');
                selectedDiv.className = 'select-selected';
                selectedDiv.innerText = "$ (USD)";
                // Styles are now handled by #currency-select-container in CSS

                customSelect.appendChild(selectedDiv);

                const itemsDiv = document.createElement('div');
                itemsDiv.className = 'select-items';

                const currencies = [
                    { val: '$', label: '$ (USD)' },
                    { val: '€', label: '€ (EUR)' },
                    { val: '£', label: '£ (GBP)' },
                    { val: '₹', label: '₹ (INR)' },
                    { val: '¥', label: '¥ (JPY)' }
                ];

                currencies.forEach(c => {
                    const item = document.createElement('div');
                    item.innerText = c.label;
                    item.addEventListener('click', function (e) {
                        window.currentCurrency = c.val;
                        selectedDiv.innerText = c.label;
                        // Close dropdown
                        itemsDiv.classList.remove('select-open');
                        selectedDiv.classList.remove('select-arrow-active');
                    });
                    itemsDiv.appendChild(item);
                });

                customSelect.appendChild(itemsDiv);
                currencyLi.appendChild(customSelect);

                // Toggle logic
                selectedDiv.addEventListener('click', function (e) {
                    e.stopPropagation();
                    // Close others
                    closeAllSelect(this);
                    itemsDiv.classList.toggle('select-open');
                    this.classList.toggle('select-arrow-active');
                });

                linksContainer.insertBefore(currencyLi, linksContainer.firstChild);

                // 3. Handle Change (Custom Event already handled above in click listener)
                // The 'change' event on the original select is no longer used directly here
                // because we are using a custom div structure. 
                // Any logic needed on change should be inside the 'click' handler for the custom options.

            }
        }
    }, 100);
    // Theme Toggle Logic
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        const themeIcon = themeBtn.querySelector('i');

        // Check saved theme
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            themeIcon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';

            // Update Chart colors if chart exists
            if (window.currentChart) {
                Chart.defaults.color = isLight ? '#333' : '#ccc';
                Chart.defaults.borderColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
                window.currentChart.update();
            }
        });
    }

    // Export Logic
    const exportBtn = document.getElementById('calc-export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            if (window.exportPDF) {
                window.exportPDF(); // Use shared function
            } else {
                alert("PDF Export not available.");
            }
        });
    }
});
