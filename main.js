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
        this.clear();
        // Bind events to the buttons
        this.bindEvents();
    }

    clear() {
        console.log('HELLO!');
        console.log(previousOperandText);
        console.log(currentOperandText);
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

    updateDisplay() {
        this.currentOperandText.innerText = this.currentOperand;
        this.previousOperandText.innerText = this.previousOperand;

        // If an operation is selected, display the previous operand and the operation
        if (this.operation != null) {
            this.previousOperandText.innerText = `${this.previousOperand} ${this.operation}`;
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

/*
class Calculator {
    constructor() {
        // Initialize calculator properties
        // The result of the calculation
        this.result = 0;
        // The value displayed on the calculator
        this.displayValue = '';
        // The current operator
        this.currentOperator = null;
        // The value to be used in the next calculation
        this.pendingValue = null;
        // Whether to reset the display on the next input
        this.shouldResetDisplay = false;
        // Bind events to the buttons
        this.bindEvents();
    }

    bindEvents() {
        // Numeric buttons
        numericButtons.forEach(button => {
            button.addEventListener('click', event =>
                this.handleNumericInput(event),
            );
        });
        // Operator buttons
        operatorButtons.forEach(button => {
            button.addEventListener('click', event =>
                this.handleOperatorInput(event),
            );
        });
    }

    // 01 - Handle numeric input
    handleNumericInput(event) {
        // Get the number from the data attribute
        const dataNum = event.target.dataset.num;

        // If the shouldResetDisplay flag is true,
        // it means an operator was just pressed,
        // and we should start fresh with the new number
        if (this.shouldResetDisplay) {
            // Reset display with the new number
            this.displayValue = dataNum;
            // Reset the flag
            this.shouldResetDisplay = false;
        } else {
            // else, append the number to the current display value
            this.displayValue += dataNum;
        }
        // Update the display
        this.display();
    }

    // 02 - Handle operator input
    handleOperatorInput(event) {
        // Get the operator from the data attribute
        const operator = event.target.dataset.op;
        // Check if the operator is the equals sign
        if (operator === 'eq') {
            // If it is, calculate the result
            this.calculate();
            // Update the display
            this.display();
        } else {
            // If any other operator was pressed
            if (this.currentOperator) {
                // If there's already a current operator stored
                // it means we are chaining operations,
                // so call calculate() to compute the result so far.
                this.calculate();
            } else {
                // flag is false, the new number is appended to the existing displayValue,
                // allowing multi-digit numbers to be formed.
                this.result = Number(this.displayValue);
            }
            // Set the current operator
            this.currentOperator = operator;
            // Set the pending value to the current display value
            this.pendingValue = Number(this.displayValue);
            // Set the flag to reset the display
            this.shouldResetDisplay = true;
        }
    }

    // 03 - Display the value
    display() {
        calculatorDisplay.innerText = this.displayValue;
    }

    // 04 - Clear the display
    clearDisplay() {
        this.displayValue = '';
        this.display();
    }

    // 05 - Calculate the result
    calculate() {
        const currentValue = Number(this.displayValue);
        switch (this.currentOperator) {
            case 'add':
                this.result += currentValue;
                break;
            case 'sub':
                this.result -= currentValue;
                break;
            case 'mul':
                this.result *= currentValue;
                break;
            case 'div':
                if (currentValue === 0) {
                    alert('Cannot divide by zero');
                    return;
                }
                this.result /= currentValue;
                break;
            case 'clear':
                this.clear();
                return;
            default:
                return;
        }
        // Update the display with the result as a string
        this.displayValue = this.result.toString();
        // Reset the flag
        this.currentOperator = null;
    }

    // 06 - Clear the calculator
    clear() {
        this.result = 0;
        this.displayValue = '';
        this.currentOperator = null;
        this.pendingValue = null;
        this.shouldResetDisplay = false;
        this.display();
    }
}
*/
// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator(previousOperandText, currentOperandText);
});
