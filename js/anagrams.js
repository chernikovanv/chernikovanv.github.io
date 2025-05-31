let interval;
let wordIterator = null;
let usedWords = new Set();
let currentWordSet = [];

const wordEl = document.getElementById('word');
const originalWordEl = document.getElementById('originalWord');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const speedInput = document.getElementById('speedInput');
const lengthInput = document.getElementById('lengthInput');

// Create infinite iterator for words
function* createWordIterator(words) {
  // Initialize the current set of words
  currentWordSet = [...words];
  usedWords.clear();

  while (true) {
    // If we've used all words, reset the pool
    if (usedWords.size >= currentWordSet.length) {
      console.log('Resetting word pool');
      usedWords.clear();
    }

    // Get a word that hasn't been used recently
    let word;
    do {
      const index = Math.floor(Math.random() * currentWordSet.length);
      word = currentWordSet[index];
    } while (usedWords.has(word));

    // Mark word as used
    usedWords.add(word);
    yield word;
  }
}

function shuffleWord(word) {
  if (word.length <= 1) return word;

  const letters = word.split('');
  let shuffled;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    // Fisher-Yates shuffle
    for(let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    shuffled = letters.join('');
    attempts++;
  } while (shuffled === word && attempts < maxAttempts);

  // If we couldn't get a different arrangement after max attempts,
  // force a change by swapping the first two letters
  if (shuffled === word && word.length > 1) {
    [letters[0], letters[1]] = [letters[1], letters[0]];
    shuffled = letters.join('');
  }

  return shuffled;
}

async function startShowing() {
  const speed = Math.min(parseInt(speedInput.value, 10), 999);
  const maxLength = Math.min(parseInt(lengthInput.value, 10), 5);
  const MIN_LENGTH = 3;

  if (!validateInputs(speed, maxLength)) return;
  if (maxLength < MIN_LENGTH) {
    showError("Для анаграмм минимальная длина слова - 3 буквы");
    return;
  }
  if (maxLength > 5) {
    showError("Максимальная длина слова - 5 букв");
    return;
  }
  if (speed > 999) {
    showError("Максимальная скорость - 999 слов в минуту");
    return;
  }

  // Update input values to reflect any clamping
  speedInput.value = speed;
  lengthInput.value = maxLength;

  try {
    const words = await loadAnagramWords();
    // Filter words by maxLength (all words are already 3+ letters)
    const filteredWordSet = words.filter(word => {
      const len = word.replace(/[\u0300-\u036f]/g, '').length;
      return len <= maxLength;
    });
    
    if (filteredWordSet.length === 0) {
      showError(`Нет слов длиной до ${maxLength} букв`);
      return;
    }

    // Create iterator for filtered words
    wordIterator = createWordIterator(filteredWordSet);
    
    // Hide controls
    startBtn.style.display = "none";
    speedInput.style.display = "none";
    lengthInput.style.display = "none";
    document.querySelectorAll(".hint").forEach(h => h.style.display = "none");
    stopBtn.style.display = "block";
    
    // Start the game cycle
    const intervalMs = (60 / speed) * 1000;
    startGameCycle(intervalMs);
  } catch (error) {
    showError("Произошла ошибка при запуске игры");
    console.error(error);
  }
}

function startGameCycle(intervalMs) {
  let cycleCount = 0;
  
  async function gameCycle() {
    cycleCount++;
    console.log(`Starting cycle ${cycleCount}`);
    
    try {
      // Get next word from iterator
      const currentWord = wordIterator.next().value;
      console.log(`Got word: ${currentWord}`);
      const shuffledWord = shuffleWord(currentWord);
      console.log(`Shuffled to: ${shuffledWord}`);

      // Show shuffled version
      wordEl.style.display = "block";
      wordEl.textContent = shuffledWord;
      originalWordEl.style.display = "block";
      originalWordEl.textContent = '';

      // Wait interval based on speed
      console.log(`Waiting first interval ${intervalMs}ms`);
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      console.log('First interval complete');

      // Show original version for exactly 1 second
      originalWordEl.textContent = currentWord;
      console.log('Showing original word for 1 second');
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Original word display complete');

      // Clear both words
      wordEl.textContent = '';
      originalWordEl.textContent = '';

      // Add a small pause between words
      await new Promise(resolve => setTimeout(resolve, 200));

      // Schedule next cycle if game is still running
      const isRunning = stopBtn.style.display === "block";
      console.log(`Game running: ${isRunning}, iterator valid: ${wordIterator !== null}`);
      
      if (isRunning) {
        console.log('Scheduling next cycle');
        requestAnimationFrame(() => gameCycle());
      } else {
        console.log('Game stopped, not scheduling next cycle');
      }
    } catch (error) {
      console.error("Cycle error details:", {
        cycleNumber: cycleCount,
        error: error.message,
        stack: error.stack,
        iteratorState: wordIterator ? 'valid' : 'null',
        gameState: {
          stopButtonVisible: stopBtn.style.display,
          wordElementVisible: wordEl.style.display,
          originalWordVisible: originalWordEl.style.display
        }
      });
      stopShowing();
    }
  }

  console.log('Starting game cycle with interval:', intervalMs);
  gameCycle();
}

function stopShowing() {
  wordIterator = null;
  wordEl.textContent = "";
  originalWordEl.textContent = "";
  wordEl.style.display = "none";
  originalWordEl.style.display = "none";
  stopBtn.style.display = "none";
  startBtn.style.display = "block";
  speedInput.style.display = "block";
  lengthInput.style.display = "block";
  document.querySelectorAll(".hint").forEach(h => h.style.display = "block");
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (startBtn.style.display !== 'none') {
      startShowing();
    } else {
      stopShowing();
    }
  }
});

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Hide word elements initially
  wordEl.style.display = "none";
  originalWordEl.style.display = "none";
  stopBtn.style.display = "none";
  
  startBtn.addEventListener('click', startShowing);
  stopBtn.addEventListener('click', stopShowing);

  // Enforce input limits
  speedInput.addEventListener('input', () => {
    let value = parseInt(speedInput.value, 10);
    if (value > 999) {
      speedInput.value = 999;
    }
  });

  lengthInput.addEventListener('input', () => {
    let value = parseInt(lengthInput.value, 10);
    if (value > 5) {
      lengthInput.value = 5;
    }
    if (value < 3) {
      lengthInput.value = 3;
    }
  });
}); 