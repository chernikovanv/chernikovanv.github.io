let currentProblem = null;
let userInput = '';
const startBtn = document.getElementById('startBtn');
const digitsInput = document.getElementById('digitsInput');
const problemDisplay = document.getElementById('problemDisplay');

class MathProblem {
  constructor(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    
    this.num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    this.num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    this.operation = '+'; // For now, only addition. Can be expanded later
    
    // Ensure numbers are properly ordered for subtraction if needed
    if (this.operation === '-' && this.num1 < this.num2) {
      [this.num1, this.num2] = [this.num2, this.num1];
    }
  }

  get solution() {
    switch(this.operation) {
      case '+': return this.num1 + this.num2;
      case '-': return this.num1 - this.num2;
      default: return 0;
    }
  }

  toString() {
    return `${this.num1} ${this.operation} ${this.num2} = `;
  }
}

function startGame() {
  const digits = Math.min(parseInt(digitsInput.value, 10), 3);
  
  if (digits < 1 || digits > 3) {
    showError("Количество знаков должно быть от 1 до 3");
    return;
  }

  // Hide start controls
  startBtn.style.display = "none";
  digitsInput.style.display = "none";
  document.querySelector(".hint").style.display = "none";

  // Show calculator grid
  document.querySelector(".calculator-grid").style.display = "grid";
  
  // Generate and display first problem
  generateNewProblem(digits);
}

function generateNewProblem(digits) {
  currentProblem = new MathProblem(digits);
  userInput = '';
  updateDisplay();
}

function updateDisplay() {
  if (!currentProblem) return;
  
  const displayText = currentProblem.toString() + 
    `<span class="user-input" id="userInput">${userInput}</span>`;
  problemDisplay.innerHTML = displayText;
}

function handleDigitInput(digit) {
  if (!currentProblem) return;
  userInput += digit;
  updateDisplay();
}

function clearInput() {
  userInput = '';
  updateDisplay();
}

function checkAnswer() {
  if (!currentProblem || userInput === '') return;

  const userAnswer = parseInt(userInput, 10);
  const isCorrect = userAnswer === currentProblem.solution;
  
  const userInputSpan = document.getElementById('userInput');
  userInputSpan.classList.add(isCorrect ? 'correct' : 'incorrect');

  // Wait a moment to show the result, then generate new problem
  setTimeout(() => {
    userInputSpan.classList.remove('correct', 'incorrect');
    generateNewProblem(parseInt(digitsInput.value, 10));
  }, 1000);
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Hide calculator grid initially
  document.querySelector(".calculator-grid").style.display = "none";
  
  startBtn.addEventListener('click', startGame);

  // Calculator button listeners
  document.querySelectorAll('.calculator-button').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.dataset.value;
      
      switch(value) {
        case 'C':
          clearInput();
          break;
        case 'enter':
          checkAnswer();
          break;
        default:
          handleDigitInput(value);
      }
    });
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (!currentProblem) return;

    if (e.key >= '0' && e.key <= '9') {
      handleDigitInput(e.key);
    } else if (e.key === 'Enter') {
      checkAnswer();
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      clearInput();
    }
  });

  // Input validation
  digitsInput.addEventListener('input', () => {
    let value = parseInt(digitsInput.value, 10);
    if (value > 3) digitsInput.value = 3;
    if (value < 1) digitsInput.value = 1;
  });
}); 