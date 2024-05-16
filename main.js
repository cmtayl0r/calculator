import './src/styles/main.css';

// TODO: add dark mode switch
// TODO: create handleButtonClick method to combine all button click events
// TODO: add sound effects
// TODO: Display a snarky error message toast if the user tries to divide by 0
// TODO: Make responsive

// -----------------------------------------------------------------------------
// DOM ELEMENTS
// -----------------------------------------------------------------------------

// Buttons
const numericButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const calculatorButtons = document.querySelectorAll('button');
// Display
const previousOperandText = document.querySelector('[data-previous-operand]');
const currentOperandText = document.querySelector('[data-current-operand]');

// -----------------------------------------------------------------------------
// CALCULATOR CLASS
// -----------------------------------------------------------------------------

/*
currentOperand = the number that is currently being typed
previousOperand = the number that was typed before the operation was selected
*/
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

        // A - If the current operand is empty, stop the function from executing
        if (this.currentOperand === '') return;

        // B - If previousOperand is not empty, calculate the result
        // it means there is a previous operand available for calculation.
        if (this.previousOperand !== '') {
            // calculation based on the current and previous operands
            // and the operation passed in
            this.calculate();
        }

        // C - else if the previous operand is empty, set the current operand to the previous operand
        // Set the operation to the operation passed in
        // because the operation is now selected and the calculation is not yet complete
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

    handleButtonClick(event) {
        // Get the innerText value of the button that was clicked
        const value = event.innerText;

        // Map object with button values and their corresponding methods
        const buttonActions = {
            '.': () => {
                this.appendNumber(value);
                this.updateDisplay();
            },
            '+': () => {
                this.chooseOperation(value);
                this.updateDisplay();
            },
            '-': () => {
                this.chooseOperation(value);
                this.updateDisplay();
            },
            '*': () => {
                this.chooseOperation(value);
                this.updateDisplay();
            },
            '/': () => {
                this.chooseOperation(value);
                this.updateDisplay();
            },
            '=': () => {
                this.calculate();
                this.updateDisplay();
            },
            DEL: () => {
                this.delete();
                this.updateDisplay();
            },
            AC: () => {
                this.clear();
                this.updateDisplay();
            },
        };
        if (value >= '0' && value <= '9') {
            // if button pressed is a number, append the number to the current operand
            this.appendNumber(value);
            this.updateDisplay();
        } else if (buttonActions[value]) {
            // if button pressed is in the buttonActions object, execute the corresponding method
            buttonActions[value]();
        }
    }

    handleKeyPress(event) {
        // Map object with key values and their corresponding methods
        const keyActions = {
            '.': () => {
                this.appendNumber(event.key);
                this.updateDisplay();
            },
            '+': () => {
                this.chooseOperation(event.key);
                this.updateDisplay();
            },
            '-': () => {
                this.chooseOperation(event.key);
                this.updateDisplay();
            },
            '*': () => {
                this.chooseOperation(event.key);
                this.updateDisplay();
            },
            '/': () => {
                this.chooseOperation(event.key);
                this.updateDisplay();
            },
            Enter: () => {
                this.calculate();
                this.updateDisplay();
            },
            '=': () => {
                this.calculate();
                this.updateDisplay();
            },
            Backspace: () => {
                this.delete();
                this.updateDisplay();
            },
            Escape: () => {
                this.clear();
                this.updateDisplay();
            },
        };
        if (event.key >= '0' && event.key <= '9') {
            // if the key pressed is a number, append the number to the current operand
            this.appendNumber(event.key);
            this.updateDisplay();
        } else if (keyActions[event.key]) {
            // if the key pressed is in the keyActions object, execute the corresponding method
            keyActions[event.key]();
        }
    }

    bindEvents() {
        // Combine all click event listeners into one method
        calculatorButtons.forEach(button => {
            button.addEventListener('click', event =>
                // pass in the button that was clicked
                this.handleButtonClick(event.target),
            );
        });
        // Keyboard events
        document.addEventListener('keydown', event =>
            // pass in the key that was pressed
            this.handleKeyPress(event),
        );
    }
}

// -----------------------------------------------------------------------------
// INITIALIZE CALCULATOR
// -----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Arguments are the operands because they are the only elements that need to be updated during the calculation
    const calculator = new Calculator(previousOperandText, currentOperandText);
});
