import './src/styles/main.css';

// TODO: add keyboard support
// TODO: add dark mode switch
// TODO: add sound effects
// TODO: Display a snarky error message if the user tries to divide by 0
// TODO: Make responsive

// -----------------------------------------------------------------------------
// DOM ELEMENTS
// -----------------------------------------------------------------------------

const numericButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandText = document.querySelector('[data-previous-operand]');
const currentOperandText = document.querySelector('[data-current-operand]');

// -----------------------------------------------------------------------------
// CALCULATOR CLASS
// -----------------------------------------------------------------------------

class Calculator {
    constructor(previousOperandText, currentOperandText) {
        // Constructor arguments are the operands because they are the only
        // elements that need to be updated during the calculation
        this.previousOperandText = previousOperandText;
        this.currentOperandText = currentOperandText;

        // Clear the calculator when it is initialized
        // Set key values to empty or undefined
        this.clear();

        // Bind events to the buttons
        this.bindEvents();
    }

    clear() {
        // These values are defined on initialization and are updated during the various class methods
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined; // No operation selected
    }

    delete() {
        // Remove the last character from the current operand
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        // Pass in the number pressed as an argument

        // If the number is a '.' and the current operand already contains a '.',
        // stop the function from executing
        if (number === '.' && this.currentOperand.includes('.')) return;

        // Convert the number to a string and append it to the current operand
        // This allows multi-digit numbers to be formed
        this.currentOperand =
            this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        // Pass in the operation selected as an argument

        // If the current operand is empty, stop the function from executing
        if (this.currentOperand === '') return;

        // If previousOperand is not empty, calculate the result
        // it means there is a previous operand available for calculation.
        if (this.previousOperand !== '') {
            // calculation based on the current and previous operands
            // and the operation passed in
            this.calculate();
        }

        // Set the operation to the operation passed in
        this.operation = operation;

        // Set the previous operand to the current operand
        // This allows the current operand to be cleared
        // and the previous operand to be displayed
        this.previousOperand = this.currentOperand;
        // Clear the current operand
        this.currentOperand = '';
    }

    calculate() {
        // Declare a variable to hold the result of the calculation
        let calculation;
        // Convert the previous and current operands to numbers
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        // If either the previous or current operand is NaN,
        // stop the function from executing
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                calculation = prev + current;
                break;
            case '-':
                calculation = prev - current;
                break;
            case '*':
                calculation = prev * current;
                break;
            case '÷':
                calculation = prev / current;
                break;
            default:
                return;
        }
        // Set the current operand to the result of the calculation
        this.currentOperand = calculation;
        // Set the operation to undefined because the calculation is complete
        this.operation = undefined;
        // Clear the previous operand because the calculation is complete
        this.previousOperand = '';
    }

    // TODO: Understand this method
    // Format the number for localization and decimal handling
    formatNumber(number) {
        // Convert the number to a string
        const stringNumber = number.toString();
        // Split the string at the decimal point and convert the integer part to a number
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        // Get the decimal part of the number as a string
        const decimalDigits = stringNumber.split('.')[1];
        // Declare a variable to hold the formatted integer part
        let integerDisplay;
        // If the integer part is not a number (NaN), set integerDisplay to an empty string
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            // Convert the integer part to a localized string with no decimal places
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0,
            });
        }
        // If there are decimal digits, return the formatted integer part followed by the decimal part
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            // If there are no decimal digits, return just the formatted integer part
            return integerDisplay;
        }
    }

    updateDisplay() {
        // A - Update the display of the current operand
        this.currentOperandText.innerText = this.formatNumber(
            this.currentOperand,
        );

        // B - Update the display of the previous operand
        // if an operation is selected...
        if (this.operation != null) {
            // Display the previous operand and the operation in the previous operand text
            this.previousOperandText.innerText = `${this.formatNumber(this.previousOperand)} ${this.operation}`;
        } else {
            // if no operation is selected, previous operand text is empty
            this.previousOperandText.innerText = '';
        }
    }

    handleKeyPress(event) {
        console.log(event.key);
        if ((event.key >= '0' && event.key <= '9') || event.key === '.') {
            this.appendNumber(event.key);
            this.updateDisplay();
        } else if (['+', '-', '*', '/'].includes(event.key)) {
            this.chooseOperation(event.key);
            this.updateDisplay();
        } else if (event.key === 'Enter' || ['='].includes(event.key)) {
            this.calculate();
            this.updateDisplay();
        } else if (event.key === '.') {
            console.log('BOOM!');
        } else if (event.key === 'Escape') {
            this.clear();
            this.updateDisplay();
        }
    }

    bindEvents() {
        // Button clicks
        numericButtons.forEach(button => {
            button.addEventListener('click', event => {
                // Pass in the number from the button as an argument
                this.appendNumber(event.target.innerText);
                // Update the display after the number is appended
                this.updateDisplay();
            });
        });
        operationButtons.forEach(button => {
            button.addEventListener('click', event => {
                // Pass in the operation from the button as an argument
                this.chooseOperation(event.target.innerText);
                // Update the display after the operation is chosen
                this.updateDisplay();
            });
        });
        equalsButton.addEventListener('click', () => {
            this.calculate();
            this.updateDisplay();
        });
        allClearButton.addEventListener('click', () => {
            this.clear();
            this.updateDisplay();
        });
        deleteButton.addEventListener('click', () => {
            this.delete();
            this.updateDisplay();
        });
        // Keyboard events
        document.addEventListener('keydown', event =>
            this.handleKeyPress(event),
        );
    }
}

// -----------------------------------------------------------------------------
// INITIALIZE CALCULATOR
// -----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator(previousOperandText, currentOperandText);
});
