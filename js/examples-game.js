let currentProblem = null;
let userInput = '';

class MathProblem {
  constructor(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    
    this.num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    this.num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    this.operation = '+'; // For now, only addition
    
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

  get solutionLength() {
    return this.solution.toString().length;
  }

  toString() {
    const spaces = ' '.repeat(this.solutionLength);
    return `${this.num1} ${this.operation} ${this.num2} = ${spaces}`;
  }
}

function updateDisplay() {
  if (!currentProblem) return;
  
  const solution = currentProblem.solution.toString();
  const spaces = ' '.repeat(solution.length - userInput.length);
  let display = userInput;
  
  // Only add spaces if we haven't filled all digits
  if (userInput.length < solution.length) {
    display += spaces;
  }
  
  // Wrap each character in a span
  const wrappedDisplay = Array.from(display).map(char => `<span>${char}</span>`).join('');
  
  const displayText = `${currentProblem.num1} ${currentProblem.operation} ${currentProblem.num2} = \u00A0` + 
    `<span class="user-input" id="userInput">${wrappedDisplay}</span>`;
  document.getElementById('problemDisplay').innerHTML = displayText;
}

function handleDigitInput(digit) {
  if (!currentProblem) return;
  
  // Only allow input up to solution length
  if (userInput.length < currentProblem.solutionLength) {
    userInput += digit;
    updateDisplay();
  }
}

function clearInput() {
  userInput = '';
  updateDisplay();
}

function checkAnswer() {
  if (!currentProblem) return;

  // Check if input is empty
  if (userInput.length === 0) {
    const userInputSpan = document.getElementById('userInput');
    userInputSpan.classList.add('incorrect');
    
    // Show error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'Введите ответ';
    document.body.appendChild(errorMessage);

    // Remove error message after 2 seconds
    setTimeout(() => {
      errorMessage.remove();
      userInputSpan.classList.remove('incorrect');
    }, 2000);
    return;
  }

  const userAnswer = parseInt(userInput, 10);
  const isCorrect = userAnswer === currentProblem.solution;
  
  const userInputSpan = document.getElementById('userInput');
  userInputSpan.classList.add(isCorrect ? 'correct' : 'incorrect');

  // Wait a moment to show the result, then generate new problem
  setTimeout(() => {
    userInputSpan.classList.remove('correct', 'incorrect');
    generateNewProblem();
  }, 1000);
}

function generateNewProblem() {
  const digits = parseInt(localStorage.getItem('mathGameDigits') || '1', 10);
  currentProblem = new MathProblem(digits);
  userInput = '';
  
  // Update display class based on digits
  const problemDisplay = document.getElementById('problemDisplay');
  problemDisplay.className = 'problem-display';
  if (window.innerWidth <= 480) { // Only add class on mobile
    problemDisplay.classList.add(`digits-${digits}`);
  }
  
  updateDisplay();
}

// Add window resize handler
window.addEventListener('resize', () => {
  if (!currentProblem) return;
  
  const digits = parseInt(localStorage.getItem('mathGameDigits') || '1', 10);
  const problemDisplay = document.getElementById('problemDisplay');
  problemDisplay.className = 'problem-display';
  if (window.innerWidth <= 480) {
    problemDisplay.classList.add(`digits-${digits}`);
  }
});

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if we have the digits setting
  const digits = localStorage.getItem('mathGameDigits');
  if (!digits) {
    window.location.href = 'примеры.html';
    return;
  }

  // Start first problem
  generateNewProblem();

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
    if (e.key >= '0' && e.key <= '9') {
      handleDigitInput(e.key);
    } else if (e.key === 'Enter') {
      checkAnswer();
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      clearInput();
    }
  });
}); 