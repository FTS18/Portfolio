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
