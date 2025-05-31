let interval;

const wordEl = document.getElementById('word');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const speedInput = document.getElementById('speedInput');
const lengthInput = document.getElementById('lengthInput');

async function startShowing() {
  const speed = Math.min(parseInt(speedInput.value, 10), 999);
  const maxLength = Math.min(parseInt(lengthInput.value, 10), 5);

  if (!validateInputs(speed, maxLength)) return;
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
    const filteredWordSet = filterWords(words, maxLength, true);

    if (filteredWordSet.length === 0) {
      showError(`Нет слов длиной ${maxLength} букв и менее`);
      return;
    }

    const intervalMs = (60 / speed) * 1000;

    startBtn.style.display = "none";
    speedInput.style.display = "none";
    lengthInput.style.display = "none";
    document.querySelectorAll(".hint").forEach(h => h.style.display = "none");
    stopBtn.style.display = "block";
    wordEl.style.display = "block";

    showWord(filteredWordSet);
    interval = setInterval(() => showWord(filteredWordSet), intervalMs);
  } catch (error) {
    showError("Произошла ошибка при запуске игры");
    console.error(error);
  }
}

function stopShowing() {
  clearInterval(interval);
  wordEl.style.display = "none";
  stopBtn.style.display = "none";
  startBtn.style.display = "block";
  speedInput.style.display = "block";
  lengthInput.style.display = "block";
  document.querySelectorAll(".hint").forEach(h => h.style.display = "block");
}

function showWord(filteredWordSet) {
  try {
    wordEl.textContent = getRandomWord(filteredWordSet);
  } catch (error) {
    showError("Ошибка при показе слова");
    console.error(error);
    stopShowing();
  }
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
  });
}); 