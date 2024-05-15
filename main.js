import './src/styles/main.css';

const calculatorDisplay = document.querySelector('.display');
const numericButtons = document.querySelectorAll('.numbers');
const operatorButtons = document.querySelectorAll('.operators');

class Calculator {
    constructor() {
        this.result = 0;
        this.displayValue = '';
        this.currentOperator = null;
        this.pendingValue = null;
        this.shouldResetDisplay = false;

        this.bindEvents();
    }

    bindEvents() {
        numericButtons.forEach(button => {
            button.addEventListener('click', event =>
                this.handleNumericInput(event),
            );
        });

        operatorButtons.forEach(button => {
            button.addEventListener('click', event =>
                this.handleOperatorInput(event),
            );
        });
    }

    handleNumericInput(event) {
        const dataNum = event.target.dataset.num;
        if (this.shouldResetDisplay) {
            this.displayValue = dataNum;
            this.shouldResetDisplay = false;
        } else {
            this.displayValue += dataNum;
        }
        this.display();
    }

    handleOperatorInput(event) {
        const operator = event.target.dataset.op;
        if (operator === 'eq') {
            this.calculate();
            this.display();
        } else {
            if (this.currentOperator) {
                this.calculate();
            } else {
                this.result = Number(this.displayValue);
            }
            this.currentOperator = operator;
            this.pendingValue = Number(this.displayValue);
            this.shouldResetDisplay = true;
        }
    }

    display() {
        calculatorDisplay.innerText = this.displayValue;
    }

    clearDisplay() {
        this.displayValue = '';
        this.display();
    }

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
            default:
                return;
        }
        this.displayValue = this.result.toString();
        this.currentOperator = null;
    }

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
