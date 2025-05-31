let interval;
let showOriginal = false;
let currentWord = "";
let shuffledWord = "";

const wordEl = document.getElementById('word');
const originalWordEl = document.getElementById('originalWord');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const speedInput = document.getElementById('speedInput');
const lengthInput = document.getElementById('lengthInput');

function shuffleWord(word) {
  const letters = word.split('');
  for(let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.join('');
}

async function startShowing() {
  const speed = Math.min(parseInt(speedInput.value, 10), 999);
  const maxLength = Math.min(parseInt(lengthInput.value, 10), 5);

  if (!validateInputs(speed, maxLength)) return;
  if (maxLength < 3) {
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
    const words = await loadWords();
    const filteredWordSet = filterWords(words, maxLength);
    
    if (filteredWordSet.length === 0) {
      showError(`Нет слов длиной от 3 до ${maxLength} букв`);
      return;
    }

    const intervalMs = (60 / speed) * 1000;

    startBtn.style.display = "none";
    speedInput.style.display = "none";
    lengthInput.style.display = "none";
    document.querySelectorAll(".hint").forEach(h => h.style.display = "none");
    stopBtn.style.display = "block";
    wordEl.style.display = "block";
    originalWordEl.style.display = "block";

    showOriginal = false;
    nextWord(filteredWordSet);
    interval = setInterval(() => nextWord(filteredWordSet), intervalMs);
  } catch (error) {
    showError("Произошла ошибка при запуске игры");
    console.error(error);
  }
}

function nextWord(filteredWordSet) {
  try {
    if (showOriginal) {
      originalWordEl.textContent = currentWord;
      wordEl.textContent = shuffledWord;
    } else {
      currentWord = getRandomWord(filteredWordSet);
      shuffledWord = shuffleWord(currentWord);
      while (shuffledWord === currentWord) {
        shuffledWord = shuffleWord(currentWord);
      }
      originalWordEl.textContent = '';
      wordEl.textContent = shuffledWord;
    }
    showOriginal = !showOriginal;
  } catch (error) {
    showError("Ошибка при показе слова");
    console.error(error);
    stopShowing();
  }
}

function stopShowing() {
  clearInterval(interval);
  wordEl.textContent = "";
  originalWordEl.textContent = "";
  wordEl.style.display = "none";
  originalWordEl.style.display = "none";
  stopBtn.style.display = "none";
  startBtn.style.display = "block";
  speedInput.style.display = "block";
  lengthInput.style.display = "block";
  document.querySelectorAll(".hint").forEach(h => h.style.display = "block");
  showOriginal = false;
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