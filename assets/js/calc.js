const display = document.querySelector("#display");
const buttons = document.querySelectorAll("button");

let isDegreeMode = true; // Initial mode is degrees

// Function to calculate factorial
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = n; i > 1; i--) {
        result *= i;
    }
    return result;
}

// Function to check if the last character is an operator
function isLastCharOperator(str) {
    return /[\+\-\*\/^%!]+$/.test(str);
}

// Function to replace the last operator with the new one
function replaceLastOperator(str, newOperator) {
    return str.slice(0, -1) + newOperator;
}
function handleSpecialOperatorsForDisplay(operator) {
    switch (operator) {
        case "sin(":
        case "cos(":
        case "tan(":
        case "asin(":
        case "acos(":
        case "atan(":
        case "ln(":
        case "log(":
        case "√":
        case "1/":
            return operator;
        case "π":
            return "π";
        case "e":
            return "e";
        case "^":
            return "^";
        default:
            // Check if the last character is a number or a closing parenthesis
            if (/[\d\)]$/.test(display.value)) {
                // Check if the current operator includes a parenthesis
                if (/^[a-zA-Z]+\($/.test(operator)) {
                    return "*" + operator;
                } else {
                    return operator;
                }
            } else {
                return operator;
            }
    }
}

// Function to handle special operators for evaluation
function handleSpecialOperatorsForEvaluation(operator) {
    switch (operator) {
        case "sin(":
            return isDegreeMode ? `Math.sin(Math.PI / 180 * ` : `Math.${operator}`;
        case "cos(":
            return isDegreeMode ? `Math.cos(Math.PI / 180 * ` : `Math.${operator}`;
        case "tan(":
            return isDegreeMode ? `Math.tan(Math.PI / 180 * ` : `Math.${operator}`;
        case "asin(":
            return isDegreeMode ? `180 / Math.PI * Math.asin(` : `Math.${operator}`;
        case "acos(":
            return isDegreeMode ? `180 / Math.PI * Math.acos(` : `Math.${operator}`;
        case "atan(":
            return isDegreeMode ? `180 / Math.PI * Math.atan(` : `Math.${operator}`;
        case "ln(":
            return "Math.log(";
        case "log(":
            return "Math.log10(";
        case "%":
            return "/100";
        case "π":
            return "Math.PI";
        case "e":
            return "Math.E";
        case "√":
            return "Math.sqrt(";
        case "^":
            return "**";
        case "1/":
            return "1/(";
        default:
            return operator;
    }
}

// Function to evaluate the expression
function evaluate() {
    let displayExpression = display.value;
    let evalExpression = display.getAttribute("data-eval") || "";
    if (displayExpression) {
        try {
            // Handle factorials: find and replace with factorial calculation
            evalExpression = evalExpression.replace(/(\d+)!/g, (match, num) => factorial(parseInt(num)));

            // Handle percentage: replace '%' with '/100'
            evalExpression = evalExpression.replace(/(\d+(\.\d+)?)%/g, (match, num) => `${num}/100`);

            // Handle π symbol
            evalExpression = evalExpression.replace(/π/g, Math.PI);

            // Count open and close parentheses
            let openParentheses = (evalExpression.match(/\(/g) || []).length;
            let closeParentheses = (evalExpression.match(/\)/g) || []).length;

            // Add missing closing parentheses
            if (openParentheses > closeParentheses) {
                evalExpression += ")".repeat(openParentheses - closeParentheses);
            }

            let result = eval(evalExpression);
            // Round the result to 10 decimal places to handle precision issues
            result = Math.round(result * 1e10) / 1e10;
            display.value = result;
            display.setAttribute("data-eval", "");
        } catch {
            display.value = "Error";
            setTimeout(() => {
                display.value = "";
                display.setAttribute("data-eval", "");
            }, 2000);
        }
    } else {
        display.value = "Empty!";
        setTimeout(() => {
            display.value = "";
            display.setAttribute("data-eval", "");
        }, 2000);
    }
}

// Modify button click handler
buttons.forEach((item) => {
    item.onclick = () => {
        let displayExpression = display.value;
        let evalExpression = display.getAttribute("data-eval") || "";

        if (item.id === "clear") {
            display.value = "";
            display.setAttribute("data-eval", "");
        } else if (item.id === "backspace") {
            display.value = displayExpression.slice(0, -1);
            display.setAttribute("data-eval", evalExpression.slice(0, -1));
        } else if (item.id === "equal") {
            evaluate();
        } else if (item.id === "toggleMode") {
            isDegreeMode = !isDegreeMode;
            item.innerText = isDegreeMode ? "deg" : "rad";
        } else if (item.id === "|") {
            // Absolute value
            display.value += "|";
            evalExpression += "Math.abs(";
            display.setAttribute("data-eval", evalExpression);
        } else if (item.id === "∛") {
            // Cube root
            display.value += "∛";
            evalExpression += "Math.cbrt(";
            display.setAttribute("data-eval", evalExpression);
        } else {
            if (isLastCharOperator(displayExpression) && /[\+\-\*\/\^]/.test(item.id)) {
                display.value = replaceLastOperator(displayExpression, item.id);
                evalExpression = replaceLastOperator(evalExpression, handleSpecialOperatorsForEvaluation(item.id));
            } else {
                display.value += handleSpecialOperatorsForDisplay(item.id);
                evalExpression += handleSpecialOperatorsForEvaluation(item.id);
            }
            display.setAttribute("data-eval", evalExpression);
        }
    };
});
const moreBtn = document.querySelector('.more-btn');
const c2 = document.querySelector('.c2');

// Function to handle click event on the "More" button
moreBtn.addEventListener('click', () => {
    // Check if the screen width is less than or equal to a mobile device width
    if (window.innerWidth <= 767) {
        // Toggle a CSS class to expand/collapse c2
        c2.classList.toggle('expanded');
    }
});
// Function to calculate BMI
function calculateBMI() {
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight values.');
        return;
    }

    const bmi = weight / Math.pow(height / 100, 2);
    displayBMI(bmi);
}

function displayBMI(bmi) {
    const bmiResultDiv = document.getElementById('bmiResult');
    bmiResultDiv.textContent = `Your BMI is: ${bmi.toFixed(2)}`;

    const bmiIndicator = document.getElementById('bmiIndicator');
    let category = "";
    let position = 0;

    if (bmi < 18.5) {
        category = "Underweight";
        position = 10;
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = "Healthy";
        position = 35;
    } else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
        position = 65;
    } else {
        category = "Obese";
        position = 90;
    }

    bmiIndicator.style.left = `calc(${position}% - 10px)`;

    const categoryDiv = document.createElement('div');
    categoryDiv.textContent = `Category: ${category}`;
    categoryDiv.className = 'bmi-category-text';

    const previousCategory = document.querySelector('.bmi-category-text');
    if (previousCategory) {
        previousCategory.remove();
    }
    bmiResultDiv.appendChild(categoryDiv);
}

document.querySelector('.submit-bmi').addEventListener('click', calculateBMI);

function solveEquations() {
    const variableCount = document.getElementById('variable-count').value;
    const eq1 = document.getElementById('eq1').value;
    const eq2 = document.getElementById('eq2').value;
    const eq3 = variableCount === '3' ? document.getElementById('eq3').value : null;

    try {
        const equations = [eq1, eq2];
        if (eq3) equations.push(eq3);
        const result = solveSystemOfEquations(equations);
        displayEquationResult(result);
    } catch (error) {
        alert('Invalid equations. Please enter valid equations.');
    }
}

function displayEquationResult(result) {
    const equationResultDiv = document.getElementById('equationResult');
    equationResultDiv.textContent = `Solution: ${result}`;
}

function solveSystemOfEquations(equations) {
    // Placeholder solution - replace with actual logic
    return "x = 1, y = 2, z = 3";
}

document.querySelector('.submit-equation').addEventListener('click', solveEquations);

document.getElementById('variable-count').addEventListener('change', function () {
    const variableCount = this.value;
    const equationsInputDiv = document.getElementById('equations-input');
    equationsInputDiv.innerHTML = `
        <input id="eq1" type="text" placeholder="Equation 1 (e.g., 2x + 3y = 6)">
        <input id="eq2" type="text" placeholder="Equation 2 (e.g., x - y = 1)">
    `;
    if (variableCount === '3') {
        const eq3Input = document.createElement('input');
        eq3Input.id = 'eq3';
        eq3Input.type = 'text';
        eq3Input.placeholder = 'Equation 3 (e.g., x + y + z = 3)';
        equationsInputDiv.appendChild(eq3Input);
    }
});
