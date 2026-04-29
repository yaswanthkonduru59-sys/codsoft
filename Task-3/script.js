// Variables to store the current calculation state
let displayValue = '0';
let previousValue = '';
let currentOperator = '';
let shouldResetDisplay = false;

// Get the display element
const display = document.getElementById('display');

// Function to handle number button clicks
function handleButtonClick(number) {
    // If display shows 0 or we should reset, replace with the new number
    if (displayValue === '0' || shouldResetDisplay) {
        displayValue = number;
        shouldResetDisplay = false;
    } else {
        // Append the number to the current display
        displayValue += number;
    }
    updateDisplay();
}

// Function to handle decimal point
function handleDecimal() {
    // Only add decimal if it doesn't already exist in the current number
    if (!displayValue.includes('.')) {
        if (shouldResetDisplay) {
            displayValue = '0.';
            shouldResetDisplay = false;
        } else {
            displayValue += '.';
        }
    }
    updateDisplay();
}

// Function to handle operator buttons
function handleOperator(operator) {
    // If we already have an operator and a previous value, calculate the result first
    if (currentOperator && previousValue && !shouldResetDisplay) {
        performCalculation();
    } else if (previousValue === '' && displayValue !== '') {
        previousValue = displayValue;
    }

    // Set the current operator (normalize division symbol)
    currentOperator = operator === '÷' ? '/' : operator;
    shouldResetDisplay = true;
    updateDisplay();
}

// Function to perform the actual calculation
function performCalculation() {
    if (previousValue === '' || currentOperator === '' || displayValue === '') {
        return;
    }

    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(displayValue);

    // Use if-else statements to determine which operation to perform
    if (currentOperator === '+') {
        result = prev + current;
    } else if (currentOperator === '-') {
        result = prev - current;
    } else if (currentOperator === '*') {
        result = prev * current;
    } else if (currentOperator === '/') {
        // Handle division by zero
        if (current === 0) {
            displayValue = 'Error: Division by zero';
            updateDisplay();
            resetCalculator();
            return;
        }
        result = prev / current;
    } else {
        return;
    }

    // Round result to avoid floating point errors
    displayValue = Math.round(result * 100000000) / 100000000;
    displayValue = displayValue.toString();
    previousValue = '';
    currentOperator = '';
    shouldResetDisplay = true;
    updateDisplay();
}

// Function to clear the display
function clearDisplay() {
    displayValue = '0';
    previousValue = '';
    currentOperator = '';
    shouldResetDisplay = false;
    updateDisplay();
}

// Function to reset the calculator (helper function)
function resetCalculator() {
    displayValue = '0';
    previousValue = '';
    currentOperator = '';
    shouldResetDisplay = true;
}

// Function to update the display
function updateDisplay() {
    // Limit the display length to avoid overflow
    if (displayValue.length > 12) {
        display.value = displayValue.substring(0, 12);
    } else {
        display.value = displayValue;
    }
}

// Event listener for keyboard input
document.addEventListener('keydown', function(event) {
    // Check if the key is a number
    if (event.key >= '0' && event.key <= '9') {
        handleButtonClick(event.key);
    }
    // Check if the key is an operator
    else if (event.key === '+') {
        event.preventDefault();
        handleOperator('+');
    } else if (event.key === '-') {
        event.preventDefault();
        handleOperator('-');
    } else if (event.key === '*') {
        event.preventDefault();
        handleOperator('*');
    } else if (event.key === '/') {
        event.preventDefault();
        handleOperator('/');
    } else if (event.key === '.') {
        handleDecimal();
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        performCalculation();
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        // Remove last digit using loop
        if (displayValue !== '0' && !shouldResetDisplay) {
            displayValue = displayValue.substring(0, displayValue.length - 1);
            if (displayValue === '') {
                displayValue = '0';
            }
        }
        updateDisplay();
    } else if (event.key === 'Escape') {
        clearDisplay();
    }
});

// Initialize display
updateDisplay();
