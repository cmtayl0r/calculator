import './src/styles/main.css';

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
        // These values are defined on initialization and are updated during the calculation
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

        // If the previous operand is not empty, calculate the result
        // this shows the result of the previous operation in the previous operand
        if (this.previousOperand !== '') {
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
        // Clear the previous operand
        this.previousOperand = '';
    }

    // Format the display of the number to use commas
    formatDisplay(number) {
        // Convert from a string to a number
        const floatNumber = parseFloat(number);
        // If the number is NaN, return an empty string
        // because the number cannot be formatted
        if (isNaN(floatNumber)) return '';
        // Return the number formatted with commas
        return floatNumber.toLocaleString('en');
    }

    updateDisplay() {
        // A - Update the display of the current operand
        this.currentOperandText.innerText = this.formatDisplay(
            this.currentOperand,
        );

        // B - Update the display of the previous operand
        // If an operation is selected
        if (this.operation != null) {
            // Display the previous operand and the operation in the previous operand text
            this.previousOperandText.innerText = `${this.formatDisplay(this.previousOperand)} ${this.operation}`;
        }
    }

    bindEvents() {
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
    }
}

// -----------------------------------------------------------------------------
// INITIALIZE CALCULATOR
// -----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator(previousOperandText, currentOperandText);
});
