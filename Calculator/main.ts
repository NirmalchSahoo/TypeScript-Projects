// main.ts

// Select display and all buttons
const display = document.getElementById("display") as HTMLDivElement;
const buttons = document.querySelectorAll("button");

// State to store the current and previous values, and the operator
let currentValue: string = "";
let previousValue: string = "";
let operator: string = "";
let expression: string = "";  // Stores the full expression
let isOperatorClicked: boolean = false;

// Function to update the display
function updateDisplay(): void {
  display.textContent = expression || "0";
}

// Function to handle button clicks
function handleClick(event: Event): void {
  const button = event.target as HTMLButtonElement;
  const buttonValue = button.getAttribute("data-value")!;

  if (!isNaN(parseFloat(buttonValue)) || buttonValue === ".") {
    if (isOperatorClicked) {
      currentValue = buttonValue;
      isOperatorClicked = false;
    } else {
      currentValue += buttonValue;
    }
    expression += buttonValue;
    updateDisplay();
  } else if (buttonValue === "clear") {
    clearCalculator();
  } else if (buttonValue === "delete") {
    deleteLast();  // Call the delete function
  } else if (buttonValue === "=") {
    if (previousValue && operator && currentValue) {
      calculate();
    }
  } else {
    // Operator clicked
    if (currentValue) {
      previousValue = currentValue;
      operator = buttonValue;
      expression += ` ${operator} `;
      currentValue = "";
      isOperatorClicked = true;
      updateDisplay();
    }
  }
}

// Function to perform the calculation
function calculate(): void {
  const prev = parseFloat(previousValue);
  const curr = parseFloat(currentValue);

  let result: number;

  switch (operator) {
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "*":
      result = prev * curr;
      break;
    case "/":
      result = prev / curr;
      break;
    default:
      result = 0;
      break;
  }

  expression += ` = ${result}`;  // Show the complete expression with result
  updateDisplay();
  currentValue = result.toString();
  previousValue = "";
  operator = "";
  isOperatorClicked = false;
}

// Function to clear the calculator
function clearCalculator(): void {
  currentValue = "";
  previousValue = "";
  operator = "";
  expression = "";  // Clear the expression
  updateDisplay();
}

// Function to delete the last entered character or operator
function deleteLast(): void {
  if (currentValue) {
    // Remove last character from current value
    currentValue = currentValue.slice(0, -1);
    expression = expression.slice(0, -1);  // Remove last character from expression
  } else if (operator) {
    // Remove the last operator
    operator = "";
    expression = expression.slice(0, -3);  // Remove operator and the spaces around it
  }
  updateDisplay();
}

// Attach event listeners to buttons
buttons.forEach((button) => {
  button.addEventListener("click", handleClick);
});
