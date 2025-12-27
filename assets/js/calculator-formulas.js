/**
 * Calculator Formulas and Configuration
 * This file contains the definitions, inputs, and calculation logic for all calculators.
 */

// Global Currency Helper
window.currentCurrency = "$"; // Default
window.formatCurrency = (value) => {
    return `${window.currentCurrency}${value}`;
};

const calculatorConfig = {
    // ==========================================
    // FINANCIAL CALCULATORS
    // ==========================================
    financial: {
        universal_loan: {
            title: "Universal Loan Calculator",
            description: "Calculate Mortgage, Auto, or Personal Loans in one place.",
            inputs: [
                { id: "type", label: "Loan Type", type: "select", options: [{ value: "mortgage", label: "Mortgage" }, { value: "auto", label: "Auto Loan" }, { value: "personal", label: "Personal Loan" }] },
                { id: "amount", label: "Loan Amount", type: "number", placeholder: "e.g. 50000" },
                { id: "rate", label: "Interest Rate (%)", type: "number", step: "0.1", placeholder: "e.g. 4.5" },
                { id: "term", label: "Term (Years)", type: "number", placeholder: "e.g. 5" },
                { id: "down", label: "Down Payment (Optional)", type: "number", placeholder: "0" }
            ],
            calculate: (vals) => {
                const P = parseFloat(vals.amount) - (parseFloat(vals.down) || 0);
                const r = parseFloat(vals.rate) / 100 / 12;
                const n = parseFloat(vals.term) * 12;

                if (P <= 0 || !r || !n) return "Please check your inputs.";

                const M = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
                const totalInterest = (M * n) - P;
                const totalCost = (M * n) + (parseFloat(vals.down) || 0);

                return {
                    "Monthly Payment": window.formatCurrency(M.toFixed(2)),
                    "Total Interest": window.formatCurrency(totalInterest.toFixed(2)),
                    "Total Cost": window.formatCurrency(totalCost.toFixed(2)),
                    _chartData: {
                        type: 'doughnut',
                        labels: ['Principal', 'Interest'],
                        data: [P.toFixed(2), totalInterest.toFixed(2)],
                        colors: ['rgba(56, 189, 248, 0.7)', 'rgba(248, 113, 113, 0.7)']
                    }
                };
            }
        },
        investment_suite: {
            title: "Investment Growth Suite",
            description: "Calculate SIP, Lumpsum, and Compound Interest.",
            inputs: [
                { id: "type", label: "Investment Mode", type: "select", options: [{ value: "sip", label: "SIP (Monthly)" }, { value: "lumpsum", label: "One-time (Lumpsum)" }] },
                { id: "principal", label: "Amount", type: "number", placeholder: "Monthly Invest or Principal" },
                { id: "rate", label: "Expected Return (%)", type: "number", step: "0.1" },
                { id: "years", label: "Time Period (Years)", type: "number" }
            ],
            calculate: (vals) => {
                const P = parseFloat(vals.principal);
                const r = parseFloat(vals.rate) / 100;
                const t = parseFloat(vals.years);
                const n = 12; // Monthly compounding assumption for simplicity

                let FV = 0, invested = 0;

                if (vals.type === 'lumpsum') {
                    FV = P * Math.pow((1 + r / n), n * t);
                    invested = P;
                } else {
                    // SIP Formula: P * ({[1 + i]^n - 1} / i) * (1 + i)
                    const i = r / 12;
                    const months = t * 12;
                    FV = P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
                    invested = P * months;
                }

                const returns = FV - invested;

                // Trend Chart
                const labels = [];
                const data = [];
                for (let k = 0; k <= t; k++) {
                    labels.push(`Year ${k}`);
                    if (vals.type === 'lumpsum') data.push(P * Math.pow((1 + r / n), n * k));
                    else {
                        const m = k * 12;
                        const i = r / 12;
                        if (k === 0) data.push(0);
                        else data.push(P * ((Math.pow(1 + i, m) - 1) / i) * (1 + i));
                    }
                }

                return {
                    "Total Value": window.formatCurrency(FV.toFixed(2)),
                    "Invested Amount": window.formatCurrency(invested.toFixed(2)),
                    "Est. Returns": window.formatCurrency(returns.toFixed(2)),
                    _chartData: {
                        type: 'line',
                        labels: labels,
                        datasets: [{
                            label: 'Growth',
                            data: data,
                            borderColor: '#00ff88',
                            backgroundColor: 'rgba(0, 255, 136, 0.1)',
                            fill: true
                        }]
                    }
                }
            }
        },
        income_tax: {
            title: "Income Tax Estimator",
            description: "Estimate roughly 20% tax deduction.",
            inputs: [
                { id: "income", label: "Annual Income", type: "number" }
            ],
            calculate: (vals) => {
                const inc = parseFloat(vals.income);
                const tax = inc * 0.2;
                const net = inc * 0.8;
                return {
                    "Estimated Tax (20%)": window.formatCurrency(tax.toFixed(2)),
                    "Net Income": window.formatCurrency(net.toFixed(2)),
                    _chartData: {
                        type: 'pie',
                        labels: ['Net', 'Tax'],
                        data: [net.toFixed(2), tax.toFixed(2)],
                        colors: ['#10b981', '#ef4444']
                    }
                }
            }
        },
        payment: {
            title: "Payment Calculator",
            description: "Generic credit card or debt payment calculator.",
            inputs: [
                { id: "balance", label: "Current Balance", type: "number" },
                { id: "rate", label: "Interest Rate (%)", type: "number" },
                { id: "monthly", label: "Monthly Payment", type: "number" }
            ],
            calculate: (vals) => {
                // Calculate months to payoff
                const b = parseFloat(vals.balance);
                const r = parseFloat(vals.rate) / 100 / 12;
                const p = parseFloat(vals.monthly);

                if (p <= b * r) return "Payment too low to cover interest.";

                const n = -Math.log(1 - (b * r) / p) / Math.log(1 + r);
                const totalInterest = (Math.ceil(n) * p - b);

                // Chart Data
                const labels = [];
                const balData = [];
                let currBal = b;
                for (let i = 0; i <= Math.ceil(n); i++) {
                    if (i % 6 === 0 || i === Math.ceil(n)) { // Sample every 6 months to avoid clutter
                        labels.push(`Month ${i}`);
                        balData.push(Math.max(0, currBal).toFixed(0));
                    }
                    currBal = currBal * (1 + r) - p;
                }

                return {
                    "Months to Payoff": `${Math.ceil(n)} months`,
                    "Total Interest": window.formatCurrency(totalInterest.toFixed(2)),
                    _chartData: {
                        type: 'line',
                        labels: labels,
                        datasets: [{
                            label: 'Debt Balance',
                            data: balData,
                            borderColor: '#f87171',
                            backgroundColor: 'rgba(248, 113, 113, 0.1)',
                            fill: true
                        }]
                    }
                }
            }
        },
        sip: {
            title: "SIP Calculator",
            description: "Calculate the future value of your Systematic Investment Plan.",
            inputs: [
                { id: "investment", label: "Monthly Investment", type: "number", placeholder: "5000" },
                { id: "rate", label: "Expected Return Rate (p.a) %", type: "number", placeholder: "12" },
                { id: "years", label: "Time Period (Years)", type: "number", placeholder: "10" }
            ],
            calculate: (vals) => {
                const P = parseFloat(vals.investment);
                const r = parseFloat(vals.rate) / 100 / 12;
                const n = parseFloat(vals.years) * 12;

                if (!P || !r || !n) return "Please enter valid values";

                const M = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
                const invested = P * n;
                const returns = M - invested;

                // Trend Data
                const labels = [];
                const totalData = [];
                const investedData = [];
                let currentVal = 0;
                let currentInv = 0;

                for (let i = 0; i <= parseFloat(vals.years); i++) {
                    labels.push(`Year ${i}`);
                    if (i === 0) {
                        totalData.push(0);
                        investedData.push(0);
                    } else {
                        const months = i * 12;
                        const val = P * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
                        totalData.push(val.toFixed(0));
                        investedData.push((P * months).toFixed(0));
                    }
                }

                return {
                    "Total Value": window.formatCurrency(M.toFixed(2)),
                    "Invested Amount": window.formatCurrency(invested.toFixed(2)),
                    "Est. Returns": window.formatCurrency(returns.toFixed(2)),
                    _chartData: {
                        type: 'line',
                        labels: labels,
                        datasets: [
                            {
                                label: 'Total Value',
                                data: totalData,
                                borderColor: '#4ade80',
                                backgroundColor: 'rgba(74, 222, 128, 0.2)',
                                fill: true
                            },
                            {
                                label: 'Amount Invested',
                                data: investedData,
                                borderColor: '#fbbf24',
                                borderDash: [5, 5]
                            }
                        ]
                    }
                };
            }
        },
        retirement: {
            title: "Retirement Calculator",
            description: "Estimate investment growth for retirement.",
            inputs: [
                { id: "current", label: "Current Savings", type: "number" },
                { id: "monthly", label: "Monthly Contribution", type: "number" },
                { id: "rate", label: "Annual Return (%)", type: "number" },
                { id: "years", label: "Years to Grow", type: "number" }
            ],
            calculate: (vals) => {
                let pv = parseFloat(vals.current);
                const pmt = parseFloat(vals.monthly);
                const r = parseFloat(vals.rate) / 100 / 12;
                const n = parseFloat(vals.years) * 12;

                const fv = pv * Math.pow(1 + r, n) + (pmt * (Math.pow(1 + r, n) - 1)) / r;

                // Trend Data
                const labels = [];
                const totalData = [];
                const investedData = [];
                let currentBal = parseFloat(vals.current);
                let currentInv = parseFloat(vals.current);
                const years = parseFloat(vals.years);

                for (let i = 0; i <= years; i++) {
                    labels.push(`Year ${i}`);
                    totalData.push(currentBal.toFixed(0));
                    investedData.push(currentInv.toFixed(0));

                    if (i < years) {
                        // Advance 1 year
                        currentInv += pmt * 12;
                        currentBal = currentBal * Math.pow(1 + r, 12) + (pmt * (Math.pow(1 + r, 12) - 1)) / r;
                    }
                }

                return {
                    "Future Value": window.formatCurrency(fv.toFixed(2)),
                    "Total Contributed": window.formatCurrency((parseFloat(vals.current) + pmt * n).toFixed(2)),
                    _chartData: {
                        type: 'line',
                        labels: labels,
                        datasets: [
                            {
                                label: 'Total Balance',
                                data: totalData,
                                borderColor: '#4ade80', // Green
                                backgroundColor: 'rgba(74, 222, 128, 0.2)',
                                fill: true
                            },
                            {
                                label: 'Amount Invested',
                                data: investedData,
                                borderColor: '#fbbf24', // Yellow
                                borderDash: [5, 5]
                            }
                        ]
                    }
                };
            }
        },
        amortization: {
            title: "Amortization Estimator",
            description: "See how much of payment goes to principal vs interest.",
            inputs: [
                { id: "amount", label: "Loan Amount", type: "number" },
                { id: "rate", label: "Annual Rate (%)", type: "number" },
                { id: "years", label: "Years", type: "number" }
            ],
            calculate: (vals) => {
                const P = parseFloat(vals.amount);
                const r = parseFloat(vals.rate) / 100 / 12;
                const n = parseFloat(vals.years) * 12;
                const M = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

                const firstMonthInterest = P * r;
                const firstMonthPrincipal = M - firstMonthInterest;

                return {
                    "Monthly Payment": window.formatCurrency(M.toFixed(2)),
                    "First Month Interest": window.formatCurrency(firstMonthInterest.toFixed(2)),
                    "First Month Principal": window.formatCurrency(firstMonthPrincipal.toFixed(2)),
                    _chartData: {
                        type: 'pie',
                        labels: ['Principal', 'Interest'],
                        data: [firstMonthPrincipal.toFixed(2), firstMonthInterest.toFixed(2)],
                        colors: ['rgba(56, 189, 248, 0.7)', 'rgba(248, 113, 113, 0.7)'],
                        options: { plugins: { title: { display: true, text: 'First Month Breakdown' } } }
                    }
                };
            }
        },
        investment: {
            title: "Investment Return",
            description: "Calculate return on investment (ROI).",
            inputs: [
                { id: "invested", label: "Amount Invested", type: "number" },
                { id: "returned", label: "Amount Returned", type: "number" }
            ],
            calculate: (vals) => {
                const inv = parseFloat(vals.invested);
                const ret = parseFloat(vals.returned);
                const roi = ((ret - inv) / inv) * 100;
                return {
                    "ROI": `${roi.toFixed(2)}%`,
                    "Profit": window.formatCurrency((ret - inv).toFixed(2)),
                    _chartData: {
                        type: 'doughnut',
                        labels: ['Invested', 'Profit'],
                        data: [inv.toFixed(2), (ret - inv).toFixed(2)],
                        colors: ['rgba(74, 222, 128, 0.7)', 'rgba(250, 204, 21, 0.7)']
                    }
                }
            }
        },
        inflation: {
            title: "Inflation Calculator",
            description: "Calculate future purchasing power.",
            inputs: [
                { id: "amount", label: "Current Amount", type: "number" },
                { id: "rate", label: "Inflation Rate (%)", type: "number" },
                { id: "years", label: "Years", type: "number" }
            ],
            calculate: (vals) => {
                const amt = parseFloat(vals.amount);
                const r = parseFloat(vals.rate) / 100;
                const n = parseFloat(vals.years);
                const fv = amt * Math.pow(1 + r, n);

                // Trend
                const labels = [];
                const powerData = [];
                let currentVal = amt;

                for (let i = 0; i <= n; i++) {
                    labels.push(`Year ${i}`);
                    // Purchasing power: value / (1+r)^year
                    const power = amt / Math.pow(1 + r, i);
                    powerData.push(power.toFixed(2));
                }

                return {
                    "Future Cost": window.formatCurrency(fv.toFixed(2)),
                    "Purchasing Power": window.formatCurrency((amt / Math.pow(1 + r, n)).toFixed(2)),
                    _chartData: {
                        type: 'line',
                        labels: labels,
                        datasets: [{
                            label: 'Purchasing Power',
                            data: powerData,
                            borderColor: '#f87171',
                            backgroundColor: 'rgba(248, 113, 113, 0.2)',
                            fill: true
                        }]
                    }
                }
            }
        },
        finance: {
            title: "Finance Calculator",
            description: "General purpose financial goal time estimator.",
            inputs: [
                { id: "goal", label: "Goal Amount", type: "number" },
                { id: "savings", label: "Monthly Savings", type: "number" }
            ],
            calculate: (vals) => {
                const months = parseFloat(vals.goal) / parseFloat(vals.savings);
                return {
                    "Time to Goal": `${(months / 12).toFixed(1)} Years`
                }
            }
        },
        income_tax: {
            title: "Income Tax Estimator",
            description: "Estimate roughly 20% tax deduction.",
            inputs: [
                { id: "income", label: "Annual Income", type: "number" }
            ],
            calculate: (vals) => {
                const inc = parseFloat(vals.income);
                // Very rough estimation
                const tax = inc * 0.2;
                const net = inc * 0.8;
                return {
                    "Estimated Tax (20%)": window.formatCurrency(tax.toFixed(2)),
                    "Net Income": window.formatCurrency(net.toFixed(2)),
                    _chartData: {
                        type: 'pie',
                        labels: ['Net', 'Tax'],
                        data: [net.toFixed(2), tax.toFixed(2)],
                        colors: ['#10b981', '#ef4444']
                    }
                }
            }
        },
        compound_interest: {
            title: "Compound Interest",
            inputs: [
                { id: "p", label: "Principal", type: "number" },
                { id: "r", label: "Rate (%)", type: "number" },
                { id: "t", label: "Years", type: "number" },
                { id: "n", label: "Times Compounded/Year", type: "number" }
            ],
            calculate: (vals) => {
                const p = parseFloat(vals.p);
                const r = parseFloat(vals.r) / 100;
                const t = parseFloat(vals.t);
                const n = parseFloat(vals.n);
                const amount = p * Math.pow((1 + r / n), n * t);

                // Chart
                const labels = [];
                const data = [];
                for (let i = 0; i <= t; i++) {
                    labels.push(`Year ${i}`);
                    data.push((p * Math.pow((1 + r / n), n * i)).toFixed(2));
                }

                return {
                    "Total Amount": window.formatCurrency(amount.toFixed(2)),
                    "Interest Earned": window.formatCurrency((amount - p).toFixed(2)),
                    _chartData: {
                        type: 'line',
                        labels: labels,
                        datasets: [{
                            label: 'Growth',
                            data: data,
                            borderColor: '#8b5cf6',
                            backgroundColor: 'rgba(139, 92, 246, 0.2)',
                            fill: true
                        }]
                    }
                }
            }
        },
        salary: {
            title: "Salary Converter",
            inputs: [{ id: "hourly", label: "Hourly Wage", type: "number" }],
            calculate: (vals) => {
                const h = parseFloat(vals.hourly);
                const w = h * 40;
                const m = w * 52 / 12;
                const a = w * 52;

                return {
                    "Weekly (40h)": window.formatCurrency(w.toFixed(2)),
                    "Monthly (approx)": window.formatCurrency(m.toFixed(2)),
                    "Annual": window.formatCurrency(a.toFixed(2)),
                    _chartData: {
                        type: 'bar',
                        labels: ['Weekly', 'Monthly', 'Annual'],
                        data: [w, m, a],
                        colors: ['#60a5fa', '#3b82f6', '#2563eb'],
                        options: {
                            indexAxis: 'y',
                            scales: { x: { type: 'logarithmic' } } // Use log scale due to large difference
                        }
                    }
                }
            }
        },
        interest_rate: {
            title: "Effective Interest Rate",
            inputs: [
                { id: "nom", label: "Nominal Rate (%)", type: "number" },
                { id: "n", label: "Compounding Periods", type: "number" }
            ],
            calculate: (vals) => {
                const r = parseFloat(vals.nom) / 100;
                const n = parseFloat(vals.n);
                const eff = Math.pow(1 + r / n, n) - 1;
                return { "Effective Rate": `${(eff * 100).toFixed(4)}%` }
            }
        },
        sales_tax: {
            title: "Sales Tax Calculator",
            inputs: [
                { id: "price", label: "Price", type: "number" },
                { id: "tax", label: "Tax Rate (%)", type: "number" }
            ],
            calculate: (vals) => {
                const p = parseFloat(vals.price);
                const t = parseFloat(vals.tax) / 100;
                return {
                    "Tax Amount": window.formatCurrency((p * t).toFixed(2)),
                    "Total Price": window.formatCurrency((p * (1 + t)).toFixed(2))
                }
            }
        }
    },

    // ==========================================
    // FITNESS & HEALTH CALCULATORS
    // ==========================================
    health: {
        bmi: {
            title: "BMI Calculator",
            description: "Body Mass Index.",
            inputs: [
                { id: "height", label: "Height (cm)", type: "number" },
                { id: "weight", label: "Weight (kg)", type: "number" }
            ],
            calculate: (vals) => {
                const h = parseFloat(vals.height) / 100;
                const w = parseFloat(vals.weight);
                const bmi = w / (h * h);
                let cat = "";
                let color = "";
                let percent = 0;

                if (bmi < 18.5) {
                    cat = "Underweight";
                    color = "#3498db"; // Blue
                    percent = (bmi / 18.5) * 25; // 0-25%
                }
                else if (bmi < 25) {
                    cat = "Healthy";
                    color = "#2ecc71"; // Green
                    percent = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25; // 25-50%
                }
                else if (bmi < 30) {
                    cat = "Overweight";
                    color = "#f1c40f"; // Yellow
                    percent = 50 + ((bmi - 25) / (30 - 25)) * 25; // 50-75%
                }
                else {
                    cat = "Obese";
                    color = "#e74c3c"; // Red
                    percent = 75 + Math.min(((bmi - 30) / 10) * 25, 25); // 75-100%
                }

                return {
                    "BMI": bmi.toFixed(2),
                    "Category": cat,
                    _visualScale: {
                        value: percent,
                        label: `BMI: ${bmi.toFixed(1)} (${cat})`,
                        color: color
                    },
                    _chartData: {
                        type: 'doughnut',
                        labels: ['Your BMI', 'Max Scale'],
                        data: [bmi.toFixed(2), (40 - bmi).toFixed(2)],
                        colors: [color, '#1f2937'],
                        options: { rotation: -90, circumference: 180 }
                    }
                };
            }
        },
        calorie: {
            title: "Calorie Calculator (TDEE)",
            inputs: [
                { id: "weight", label: "Weight (kg)", type: "number" },
                { id: "height", label: "Height (cm)", type: "number" },
                { id: "age", label: "Age", type: "number" },
                { id: "act", label: "Activity Level (1.2 - 1.9)", type: "number", step: "0.1" }
            ],
            calculate: (vals) => {
                // Mifflin-St Jeor
                const w = parseFloat(vals.weight);
                const h = parseFloat(vals.height);
                const a = parseFloat(vals.age);
                const act = parseFloat(vals.act);
                const bmr = 10 * w + 6.25 * h - 5 * a + 5; // Assumes male for simplicity or add gender selector later
                return {
                    "Daily Calories": `${Math.round(bmr * act)} kcal`,
                    _chartData: {
                        type: 'bar',
                        labels: ['BMR', 'TDEE'],
                        data: [bmr, bmr * act],
                        colors: ['#3b82f6', '#10b981'],
                        options: { indexAxis: 'y' }
                    }
                }
            }
        },
        body_fat: {
            title: "Body Fat (US Navy Method)",
            inputs: [
                { id: "waist", label: "Waist (cm)", type: "number" },
                { id: "neck", label: "Neck (cm)", type: "number" },
                { id: "height", label: "Height (cm)", type: "number" }
            ],
            calculate: (vals) => {
                // Male formula
                const w = parseFloat(vals.waist);
                const n = parseFloat(vals.neck);
                const h = parseFloat(vals.height);
                const bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;

                let color = "#10b981";
                if (bf > 25) color = "#f59e0b";
                if (bf > 30) color = "#ef4444";

                return {
                    "Body Fat": `${bf.toFixed(1)}%`,
                    _chartData: {
                        type: 'doughnut',
                        labels: ['Body Fat', 'Lean Mass'],
                        data: [bf.toFixed(1), (100 - bf).toFixed(1)],
                        colors: [color, '#374151']
                    }
                }
            }
        },
        bmr: {
            title: "BMR Calculator",
            inputs: [
                { id: "w", label: "Weight (kg)", type: "number" },
                { id: "h", label: "Height (cm)", type: "number" },
                { id: "a", label: "Age", type: "number" }
            ],
            calculate: (vals) => {
                const bmr = 10 * parseFloat(vals.w) + 6.25 * parseFloat(vals.h) - 5 * parseFloat(vals.a) + 5;
                return { "BMR": `${Math.round(bmr)} kcal/day` }
            }
        },
        ideal_weight: {
            title: "Ideal Weight (Devine)",
            inputs: [{ id: "h", label: "Height (inches)", type: "number" }],
            calculate: (vals) => {
                const h = parseFloat(vals.h);
                const w = 50 + 2.3 * (h - 60);
                return { "Ideal Weight": `${w.toFixed(1)} kg` }
            }
        },
        pace: {
            title: "Pace Calculator",
            inputs: [
                { id: "min", label: "Minutes", type: "number" },
                { id: "km", label: "Dist (km)", type: "number" }
            ],
            calculate: (vals) => {
                const m = parseFloat(vals.min);
                const d = parseFloat(vals.km);
                return { "Pace": `${(m / d).toFixed(2)} min/km` }
            }
        },
        pregnancy: {
            title: "Pregnancy Week Calc",
            inputs: [{ id: "lmp", label: "Weeks since LMP", type: "number" }],
            calculate: (vals) => {
                return { "Current Status": `Week ${vals.lmp}` }
            }
        },
        conception: {
            title: "Conception Date",
            inputs: [{ id: "due", label: "Due Date (YYYY-MM-DD)", type: "date" }],
            calculate: (vals) => {
                const d = new Date(vals.due);
                d.setDate(d.getDate() - 266);
                return { "Conception": d.toDateString() }
            }
        },
        due_date: {
            title: "Due Date Calculator",
            inputs: [{ id: "lmp", label: "LMP Date (YYYY-MM-DD)", type: "date" }],
            calculate: (vals) => {
                const d = new Date(vals.lmp);
                d.setDate(d.getDate() + 280);
                return { "Due Date": d.toDateString() }
            }
        }
    },

    // ==========================================
    // MATH CALCULATORS
    // ==========================================
    math: {
        scientific: {
            title: "Scientific Calculator",
            type: "custom", // Special flag to load the detailed keypad UI
            description: "Advanced scientific operations."
        },
        fraction: {
            title: "Fraction Adder",
            inputs: [
                { id: "n1", label: "Num 1", type: "number" }, { id: "d1", label: "Denom 1", type: "number" },
                { id: "n2", label: "Num 2", type: "number" }, { id: "d2", label: "Denom 2", type: "number" }
            ],
            calculate: (vals) => {
                const n1 = parseInt(vals.n1); const d1 = parseInt(vals.d1);
                const n2 = parseInt(vals.n2); const d2 = parseInt(vals.d2);
                const top = n1 * d2 + n2 * d1;
                const bot = d1 * d2;
                return { "Result": `${top}/${bot}` }
            }
        },
        percentage: {
            title: "Percentage Calculator",
            inputs: [
                { id: "x", label: "What is", type: "number" },
                { id: "y", label: "% of", type: "number" }
            ],
            calculate: (vals) => {
                return { "Result": (parseFloat(vals.x) / 100 * parseFloat(vals.y)).toFixed(2) }
            }
        },
        rng: {
            title: "Random Number",
            inputs: [{ id: "min", label: "Min", type: "number" }, { id: "max", label: "Max", type: "number" }],
            calculate: (vals) => {
                const min = Math.ceil(vals.min);
                const max = Math.floor(vals.max);
                return { "Random": Math.floor(Math.random() * (max - min + 1) + min) }
            }
        },
        triangle: {
            title: "Hypotenuse Calculator",
            inputs: [{ id: "a", label: "Side A", type: "number" }, { id: "b", label: "Side B", type: "number" }],
            calculate: (vals) => {
                return { "Hypotenuse": Math.sqrt(vals.a ** 2 + vals.b ** 2).toFixed(2) }
            }
        },
        std_dev: {
            title: "Standard Deviation",
            inputs: [{ id: "nums", label: "Numbers (1,2,3...)", type: "text" }],
            calculate: (vals) => {
                const arr = vals.nums.split(',').map(Number);
                const n = arr.length;
                const mean = arr.reduce((a, b) => a + b) / n;
                const s = Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
                return { "Std Dev (Pop)": s.toFixed(4) }
            }
        }
    },



    // ==========================================
    // PHYSICS CALCULATORS
    // ==========================================
    physics: {
        force: {
            title: "Force Calculator (Newton's 2nd Law)",
            inputs: [
                { id: "m", label: "Mass (kg)", type: "number" },
                { id: "a", label: "Acceleration (m/s²)", type: "number" }
            ],
            calculate: (vals) => {
                const f = parseFloat(vals.m) * parseFloat(vals.a);
                return {
                    "Force": `${f.toFixed(2)} N`,
                    _chartData: {
                        type: 'line',
                        labels: [0, parseFloat(vals.a) * 0.5, parseFloat(vals.a), parseFloat(vals.a) * 1.5, parseFloat(vals.a) * 2],
                        data: [0, (parseFloat(vals.m) * parseFloat(vals.a) * 0.5), f, (parseFloat(vals.m) * parseFloat(vals.a) * 1.5), (parseFloat(vals.m) * parseFloat(vals.a) * 2)],
                        colors: ['#60a5fa'],
                        label: 'Force vs Acceleration'
                    }
                }
            }
        },
        kinetic: {
            title: "Kinetic Energy",
            inputs: [
                { id: "m", label: "Mass (kg)", type: "number" },
                { id: "v", label: "Velocity (m/s)", type: "number" }
            ],
            calculate: (vals) => {
                const m = parseFloat(vals.m);
                const v = parseFloat(vals.v);
                const ke = 0.5 * m * Math.pow(v, 2);

                // Generate curve points
                const points = [];
                const labels = [];
                for (let i = 0; i <= v * 2; i += v / 5) {
                    labels.push(i.toFixed(1));
                    points.push(0.5 * m * Math.pow(i, 2));
                }

                return {
                    "Kinetic Energy": `${ke.toFixed(2)} J`,
                    _chartData: {
                        type: 'line',
                        labels: labels,
                        data: points,
                        colors: ['#ff0055'],
                        label: 'Energy (J) vs Velocity (m/s)'
                    }
                }
            }
        },
        velocity: {
            title: "Velocity Calculator",
            inputs: [
                { id: "d", label: "Distance (m)", type: "number" },
                { id: "t", label: "Time (s)", type: "number" }
            ],
            calculate: (vals) => {
                const d = parseFloat(vals.d);
                const t = parseFloat(vals.t);
                const v = d / t;

                const labels = [];
                const points = [];
                for (let i = 0; i <= t; i += t / 5) {
                    labels.push(i.toFixed(1) + "s");
                    points.push((v * i).toFixed(2));
                }

                return {
                    "Velocity": `${v.toFixed(2)} m/s`,
                    _chartData: {
                        type: 'line',
                        labels: labels,
                        datasets: [{
                            label: 'Distance (m) over Time',
                            data: points,
                            borderColor: '#34d399',
                            backgroundColor: 'rgba(52, 211, 153, 0.1)',
                            fill: true
                        }]
                    }
                };
            }
        },
        power: {
            title: "Power Calculator",
            inputs: [
                { id: "w", label: "Work (J)", type: "number" },
                { id: "t", label: "Time (s)", type: "number" }
            ],
            calculate: (vals) => {
                const w = parseFloat(vals.w);
                const t = parseFloat(vals.t);
                const p = w / t;

                return {
                    "Power": `${p.toFixed(2)} W`,
                    _chartData: {
                        type: 'bar',
                        labels: ['Work (J)', 'Power (W)', 'Time (s)'],
                        datasets: [{
                            label: 'Physics Values',
                            data: [w, p, t],
                            backgroundColor: ['#60a5fa', '#f87171', '#fbbf24']
                        }]
                    }
                }
            }
        }
    },

    // ==========================================
    // CHEMISTRY CALCULATORS
    // ==========================================
    chemistry: {
        ideal_gas: {
            title: "Ideal Gas Law (PV=nRT)",
            inputs: [
                { id: "p", label: "Pressure (atm)", type: "number" },
                { id: "v", label: "Volume (L)", type: "number" },
                { id: "t", label: "Temperature (K)", type: "number" }
            ],
            calculate: (vals) => {
                const p = parseFloat(vals.p);
                const v = parseFloat(vals.v);
                const t = parseFloat(vals.t);
                const n = (p * v) / (0.0821 * t);

                // Boyle's Law visualization (P vs V at constant T/n)
                const pLabels = [];
                const vData = [];
                for (let pt = 0.5; pt <= 5; pt += 0.5) {
                    pLabels.push(pt + " atm");
                    vData.push((n * 0.0821 * t / pt).toFixed(2));
                }

                return {
                    "Moles (n)": `${n.toFixed(4)} mol`,
                    _chartData: {
                        type: 'line',
                        labels: pLabels,
                        datasets: [{
                            label: 'Volume (L) vs Pressure (atm)',
                            data: vData,
                            borderColor: '#8b5cf6',
                            tension: 0.4
                        }]
                    }
                }
            }
        },
        ph: {
            title: "pH Calculator",
            inputs: [{ id: "h", label: "[H+] Concentration (mol/L)", type: "number", step: "0.000001" }],
            calculate: (vals) => {
                const ph = -Math.log10(parseFloat(vals.h));
                let color = "#10b981";
                if (ph < 7) color = "#ef4444"; // acidic
                if (ph > 7) color = "#3b82f6"; // basic

                return {
                    "pH": ph.toFixed(2),
                    _chartData: {
                        type: 'doughnut',
                        labels: ['pH Value', 'Remaining'],
                        datasets: [{
                            data: [ph.toFixed(2), (14 - ph).toFixed(2)],
                            backgroundColor: [color, 'rgba(255,255,255,0.05)']
                        }],
                        options: { circumference: 180, rotation: -90 }
                    }
                }
            }
        },
        molar: {
            title: "Molar Mass Estimator",
            description: "Binary/Diatomic only for demo (e.g. H2, O2)",
            inputs: [{ id: "elem", label: "Element (approx mass)", type: "number", placeholder: "Atomic Mass" }],
            calculate: (vals) => {
                const mass = parseFloat(vals.elem).toFixed(2);
                return {
                    "Molar Mass": `${mass} g/mol`,
                    _chartData: {
                        type: 'doughnut',
                        labels: ['Element Mass', 'Binder/Other'],
                        datasets: [{
                            data: [mass, (Math.random() * 50).toFixed(2)], // Mock composition for visual
                            backgroundColor: ['#00ff88', 'rgba(255,255,255,0.1)']
                        }]
                    }
                }
            }
        }
    },

    // ==========================================
    // CALCULUS CALCULATORS
    // ==========================================
    calculus: {
        derivative: {
            title: "Derivative Calculator",
            description: "Find the symbolic derivative.",
            inputs: [{ id: "fn", label: "Function f(x)", type: "text", placeholder: "x^2 + sin(x)" }],
            calculate: (vals) => {
                try {
                    const d = math.derivative(vals.fn, 'x').toString();
                    return { "Derivative f'(x)": d };
                } catch (e) { return "Invalid Function"; }
            }
        },
        integral: {
            title: "Definite Integral Calculator",
            description: "Calculate area under curve.",
            inputs: [
                { id: "fn", label: "Function f(x)", type: "text", placeholder: "x^2" },
                { id: "a", label: "Lower Limit (a)", type: "number" },
                { id: "b", label: "Upper Limit (b)", type: "number" }
            ],
            calculate: (vals) => {
                const expr = vals.fn;
                const a = parseFloat(vals.a);
                const b = parseFloat(vals.b);
                const n = 1000;
                const h = (b - a) / n;

                try {
                    let sum = 0.5 * (math.evaluate(expr, { x: a }) + math.evaluate(expr, { x: b }));
                    for (let i = 1; i < n; i++) {
                        const x = a + i * h;
                        sum += math.evaluate(expr, { x: x });
                    }
                    const result = sum * h;
                    return { "Definite Integral": result.toFixed(6) };
                } catch (e) { return "Calculation Error"; }
            }
        }
    },

    // ==========================================
    // ADVANCED MATH
    // ==========================================
    adv_math: {
        poly_solver: {
            title: "Polynomial Solver & Visualizer",
            description: "Solve Linear to Quartic equations and visualize the curve.",
            inputs: [{ id: "coeffs", label: "Coefficients (a, b, c... for ax^n + bx^n-1...)", type: "text", placeholder: "1, -3, 2 (for x² - 3x + 2)" }],
            calculate: (vals) => {
                const c = vals.coeffs.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
                const degree = c.length - 1;
                let roots = {};
                let status = "";

                if (degree === 1) roots = { "Root": (-c[1] / c[0]).toFixed(4) };
                else if (degree === 2) {
                    const [a, b, d] = c;
                    const D = b * b - 4 * a * d;
                    if (D < 0) roots = { "Roots": "Complex Numbers" };
                    else roots = { "x1": ((-b + Math.sqrt(D)) / (2 * a)).toFixed(4), "x2": ((-b - Math.sqrt(D)) / (2 * a)).toFixed(4) };
                }
                else if (degree === 3) {
                    status = "Solved using Cubic Formula";
                    // Simple Cardano implementation or fallback to Newton-Raphson could be here, 
                    // but for brevity we show graph + approximation message
                    roots = { "Info": "See graph for roots. Exact cubic solver coming soon." };
                }
                else roots = { "Info": "Higher order polynomial. Please check graph for roots." };

                // Generate Chart Data
                const labels = [];
                const data = [];
                // Dynamic range based on coefficients size estimate
                const range = 10;
                for (let x = -range; x <= range; x += 0.5) {
                    let y = 0;
                    for (let i = 0; i <= degree; i++) y += c[i] * Math.pow(x, degree - i);
                    labels.push(x.toFixed(1));
                    data.push(y);
                }

                return {
                    ...roots,
                    _chartData: {
                        type: 'line',
                        labels: labels,
                        datasets: [{
                            label: `Polynomial Curve`,
                            data: data,
                            borderColor: '#00ff88',
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false
                        }]
                    }
                };
            }
        },
        system_solver: {
            title: "N-Variable System Solver",
            description: "Solves systems of linear equations of any size (Ax = B).",
            inputs: [
                { id: "matrixA", label: "Matrix A (Coefficients, one row per line)", type: "textarea", placeholder: "1, 2\n3, 4" },
                { id: "matrixB", label: "Matrix B (Constants, comma separated)", type: "text", placeholder: "5, 6" }
            ],
            calculate: (vals) => {
                try {
                    const A = vals.matrixA.trim().split('\n').map(row => row.split(',').map(Number));
                    const B = vals.matrixB.split(',').map(Number);

                    if (A.length !== B.length) return "Error: Number of equations must match number of constants.";

                    const result = math.lusolve(A, B);
                    const out = {};
                    result.forEach((r, i) => out[`x${i + 1}`] = r[0].toFixed(4));

                    return out;
                } catch (e) { return "Singular Matrix or Invalid Input"; }
            }
        },
        matrix: {
            title: "Matrix Operations (N x N)",
            description: "Calculate Determinant, Inverse, and Trace.",
            inputs: [
                { id: "mat", label: "Matrix (Rows separated by newlines)", type: "textarea", placeholder: "1, 2, 3\n4, 5, 6\n7, 8, 9" }
            ],
            calculate: (vals) => {
                try {
                    const m = vals.mat.trim().split('\n').map(row => row.split(',').map(Number));
                    const det = math.det(m);
                    let inv = "Singular/Non-Square";
                    try { inv = JSON.stringify(math.inv(m).map(r => r.map(n => parseFloat(n.toFixed(2))))); } catch (e) { }

                    return {
                        "Determinant": det.toFixed(4),
                        "Inverse": inv,
                        "Dimensions": `${m.length}x${m[0].length}`
                    };
                } catch (e) { return "Invalid Matrix Format"; }
            }
        }
    },

    compsci: {
        binary_calc: {
            title: "Binary Calculator",
            description: "Perform arithmetic on binary numbers.",
            inputs: [
                { id: "bin1", label: "Binary Number 1", type: "text", placeholder: "1010" },
                {
                    id: "op", label: "Operation", type: "select", options: [
                        { value: "+", label: "+" },
                        { value: "-", label: "-" },
                        { value: "*", label: "*" },
                        { value: "/", label: "/" }
                    ]
                },
                { id: "bin2", label: "Binary Number 2", type: "text", placeholder: "0101" }
            ],
            calculate: (vals) => {
                const n1 = parseInt(vals.bin1, 2);
                const n2 = parseInt(vals.bin2, 2);
                if (isNaN(n1) || isNaN(n2)) return "Invalid binary input";

                let res = 0;
                switch (vals.op) {
                    case "+": res = n1 + n2; break;
                    case "-": res = n1 - n2; break;
                    case "*": res = n1 * n2; break;
                    case "/": res = Math.floor(n1 / n2); break;
                }
                return {
                    "Binary Result": res.toString(2),
                    "Decimal Result": res.toString(10)
                };
            }
        },
        bitwise_calc: {
            title: "Bitwise Calculator",
            description: "AND, OR, XOR, NOT operations.",
            inputs: [
                { id: "num1", label: "Number 1 (Decimal)", type: "number" },
                {
                    id: "op", label: "Operation", type: "select", options: [
                        { value: "&", label: "AND (&)" },
                        { value: "|", label: "OR (|)" },
                        { value: "^", label: "XOR (^)" },
                        { value: "<<", label: "Left Shift (<<)" },
                        { value: ">>", label: "Right Shift (>>)" }
                    ]
                },
                { id: "num2", label: "Number 2 (Decimal)", type: "number" }
            ],
            calculate: (vals) => {
                const n1 = parseInt(vals.num1);
                const n2 = parseInt(vals.num2);
                if (isNaN(n1) || isNaN(n2)) return "Invalid Input";

                let res = 0;
                let binStr = "";
                switch (vals.op) {
                    case "&": res = n1 & n2; break;
                    case "|": res = n1 | n2; break;
                    case "^": res = n1 ^ n2; break;
                    case "<<": res = n1 << n2; break;
                    case ">>": res = n1 >> n2; break;
                }
                return {
                    "Result (Decimal)": res,
                    "Result (Binary)": (res >>> 0).toString(2)
                };
            }
        },
        base_converter: {
            title: "Number Base Converter",
            description: "Convert between Dec, Bin, Hex, Oct.",
            inputs: [
                { id: "val", label: "Value", type: "text", placeholder: "FF or 255" },
                {
                    id: "from", label: "From Base", type: "select", options: [
                        { value: "10", label: "Decimal (10)" },
                        { value: "2", label: "Binary (2)" },
                        { value: "16", label: "Hexadecimal (16)" },
                        { value: "8", label: "Octal (8)" }
                    ]
                },
                {
                    id: "to", label: "To Base", type: "select", options: [
                        { value: "10", label: "Decimal (10)" },
                        { value: "2", label: "Binary (2)" },
                        { value: "16", label: "Hexadecimal (16)" },
                        { value: "8", label: "Octal (8)" }
                    ]
                }
            ],
            calculate: (vals) => {
                const num = parseInt(vals.val, parseInt(vals.from));
                if (isNaN(num)) return "Invalid input for selected base";
                return {
                    "Result": num.toString(parseInt(vals.to)).toUpperCase()
                };
            }
        }
    },
    // ==========================================
    // OTHER CALCULATORS
    // ==========================================
    other: {
        concrete: {
            title: "Concrete Slab Vol",
            inputs: [
                { id: "l", label: "Length", type: "number" },
                { id: "w", label: "Width", type: "number" },
                { id: "d", label: "Depth", type: "number" },
                {
                    id: "unit", label: "Unit", type: "select", options: [
                        { value: "m", label: "Meters" },
                        { value: "ft", label: "Feet" }
                    ]
                }
            ],
            calculate: (vals) => {
                let l = parseFloat(vals.l);
                let w = parseFloat(vals.w);
                let d = parseFloat(vals.d);

                if (vals.unit === "ft") {
                    l *= 0.3048;
                    w *= 0.3048;
                    d *= 0.3048;
                }

                return {
                    "Volume (m³)": `${(l * w * d).toFixed(2)} m³`,
                    "Volume (yd³)": `${((l * w * d) * 1.30795).toFixed(2)} yd³`
                }
            }
        },
        // ... (keep older simple calculators if needed)
        age: {
            title: "Age Calculator",
            inputs: [{ id: "dob", label: "Date of Birth", type: "date" }],
            calculate: (vals) => {
                const dob = new Date(vals.dob);
                const diff = Date.now() - dob.getTime();
                const ageDate = new Date(diff);
                return { "Age": Math.abs(ageDate.getUTCFullYear() - 1970) + " Years" }
            }
        },
        date: {
            title: "Date Difference",
            inputs: [
                { id: "d1", label: "Start Date", type: "date" },
                { id: "d2", label: "End Date", type: "date" }
            ],
            calculate: (vals) => {
                const d1 = new Date(vals.d1);
                const d2 = new Date(vals.d2);
                const diffTime = Math.abs(d2 - d1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return { "Difference": `${diffDays} Days` }
            }
        },
        time: {
            title: "Time Calculator (Add)",
            inputs: [
                { id: "t1", label: "Time 1 (HH:MM)", type: "text", placeholder: "12:30" },
                { id: "t2", label: "Time 2 (HH:MM)", type: "text", placeholder: "01:30" }
            ],
            calculate: (vals) => {
                const parse = (t) => {
                    const [h, m] = t.split(':').map(Number);
                    return h * 60 + m;
                }
                const totalM = parse(vals.t1) + parse(vals.t2);
                const h = Math.floor(totalM / 60);
                const m = totalM % 60;
                return { "Total": `${h}:${m.toString().padStart(2, '0')}` }
            }
        },
        hours: {
            title: "Hours Calculator",
            inputs: [
                { id: "start", label: "Start Time", type: "time" },
                { id: "end", label: "End Time", type: "time" }
            ],
            calculate: (vals) => {
                const s = new Date(`2000-01-01T${vals.start}`);
                const e = new Date(`2000-01-01T${vals.end}`);
                let diff = (e - s) / 1000 / 60 / 60;
                if (diff < 0) diff += 24;
                return { "Hours": diff.toFixed(2) }
            }
        },
        grade: {
            title: "Grade Calculator",
            inputs: [
                { id: "score", label: "Score", type: "number" },
                { id: "total", label: "Total", type: "number" }
            ],
            calculate: (vals) => {
                const p = (parseFloat(vals.score) / parseFloat(vals.total)) * 100;
                let g = 'F';
                if (p >= 90) g = 'A';
                else if (p >= 80) g = 'B';
                else if (p >= 70) g = 'C';
                else if (p >= 60) g = 'D';
                return { "Percentage": p.toFixed(2) + '%', "Letter Grade": g }
            }
        },
        password: {
            title: "Password Generator",
            inputs: [{ id: "len", label: "Length", type: "number", placeholder: "12" }],
            calculate: (vals) => {
                const len = parseInt(vals.len) || 12;
                const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
                let pass = "";
                for (let i = 0; i < len; i++) {
                    pass += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return { "Password": pass }
            }
        },
        subnet: {
            title: "Subnet Calculator",
            inputs: [
                { id: "ip", label: "IP Address", type: "text", placeholder: "192.168.1.1" },
                { id: "mask", label: "Subnet Mask (CIDR)", type: "number", placeholder: "24" }
            ],
            calculate: (vals) => {
                // Simplified Simulation
                const ip = vals.ip;
                const cidr = parseInt(vals.mask);
                const hosts = Math.pow(2, 32 - cidr) - 2;
                return {
                    "CIDR": `/${cidr}`,
                    "Usable Hosts": hosts > 0 ? hosts : 0,
                    "Netmask": "255.255.255.0 (Approx)"
                }
            }
        },
        conversion: {
            title: "Length Converter",
            inputs: [
                { id: "val", label: "Value", type: "number" },
                {
                    id: "from", label: "From", type: "select", options: [
                        { value: "m", label: "Meters" },
                        { value: "ft", label: "Feet" },
                        { value: "in", label: "Inches" },
                        { value: "km", label: "Kilometers" },
                        { value: "mi", label: "Miles" }
                    ]
                },
                {
                    id: "to", label: "To", type: "select", options: [
                        { value: "m", label: "Meters" },
                        { value: "ft", label: "Feet" },
                        { value: "in", label: "Inches" },
                        { value: "km", label: "Kilometers" },
                        { value: "mi", label: "Miles" }
                    ]
                }
            ],
            calculate: (vals) => {
                const v = parseFloat(vals.val);
                const conversions = { m: 1, km: 1000, ft: 0.3048, in: 0.0254, mi: 1609.34 };
                const meters = v * conversions[vals.from];
                const result = meters / conversions[vals.to];
                return { "Result": result.toFixed(4) };
            }
        },
        cgpa_planner: {
            title: "Overall CGPA Planner",
            description: "Calculate current CGPA and find out what you need to score in future semesters.",
            inputs: [
                { id: "grades", label: "Past SGPAs (comma separated, e.g., 8.5, 9.0)", type: "text" },
                { id: "total_sem", label: "Total Semesters in Course", type: "number" },
                { id: "target", label: "Target CGPA (Optional)", type: "number" }
            ],
            calculate: (vals) => {
                const grades = vals.grades.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
                const totalSem = parseInt(vals.total_sem);
                const target = parseFloat(vals.target);

                if (grades.length === 0) return "Please enter valid SGPAs";

                const currentSum = grades.reduce((a, b) => a + b, 0);
                const currentCGPA = currentSum / grades.length;
                const completedSem = grades.length;

                let result = {
                    "Current CGPA": currentCGPA.toFixed(2),
                    "Semesters Completed": completedSem
                };

                if (target && totalSem > completedSem) {
                    const remainingSem = totalSem - completedSem;
                    const requiredTotal = (target * totalSem) - currentSum;
                    const requiredAvg = requiredTotal / remainingSem;

                    if (requiredAvg > 10) {
                        result["Needed per Sem"] = "Impossible (> 10)";
                    } else if (requiredAvg < 0) {
                        result["Needed per Sem"] = "Achieved";
                    } else {
                        result["Needed per Sem"] = requiredAvg.toFixed(2);
                    }
                }

                // Add Chart Data
                result._chartData = {
                    type: 'line',
                    labels: grades.map((_, i) => `Sem ${i + 1}`),
                    datasets: [{
                        label: 'SGPA Trend',
                        data: grades,
                        borderColor: '#4ade80',
                        backgroundColor: 'rgba(74, 222, 128, 0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                };

                return result;
            }
        }
    }
};

window.calculatorConfig = calculatorConfig;
