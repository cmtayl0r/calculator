import './src/styles/main.css';

const calculatorDisplay = document.querySelector('.output');
const numericButtons = document.querySelectorAll('.numbers');
const operatorButtons = document.querySelectorAll('.operators');

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

document.addEventListener('DOMContentLoaded', () => {
    const calc = new Calculator();
});
