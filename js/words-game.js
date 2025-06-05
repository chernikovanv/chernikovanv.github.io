let interval;

const wordEl = document.getElementById('word');
const backArrow = document.querySelector('.back-arrow');
const loadingElement = document.querySelector('.loading');

function createStressedWord(word) {
  const container = document.createElement('div');
  container.className = 'word-with-stress';
  
  let currentPos = 0;
  const chars = word.split('');
  
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === '\u0301') { // Если это знак ударения
      // Создаем ударение для предыдущей буквы
      const stress = document.createElement('span');
      stress.className = 'stress-mark';
      stress.textContent = '´';
      const letter = container.lastElementChild;
      if (letter) {
        letter.appendChild(stress);
      }
    } else {
      // Создаем контейнер для буквы
      const letterSpan = document.createElement('span');
      letterSpan.className = 'letter';
      letterSpan.textContent = chars[i];
      container.appendChild(letterSpan);
    }
  }
  
  return container;
}

async function loadWordsFromFile() {
  try {
    const response = await fetch('слова.txt');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    return text.split('\n').map(word => word.trim()).filter(word => word);
  } catch (error) {
    console.error('Error loading words:', error);
    throw error;
  }
}

function getWordLength(word) {
  // Считаем длину слова без учета знака ударения
  return word.replace(/[\u0301\u0300]/g, '').length;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function startGame() {
  try {
    const speed = parseInt(localStorage.getItem('wordsSpeed')) || 20;
    const length = parseInt(localStorage.getItem('wordsLength')) || 5;

    let wordSet;
    if (length === 2) {
      // Для длины 2 используем слоги
      if (!window.syllable || !Array.isArray(window.syllable)) {
        throw new Error('Слоги не загружены');
      }
      wordSet = window.syllable;
    } else {
      // Для остальных длин используем слова из файла
      const allWords = await loadWordsFromFile();
      wordSet = allWords.filter(word => getWordLength(word) === length);
      if (wordSet.length === 0) {
        showError(`Нет слов длиной ${length} букв`);
        return;
      }
    }

    // Перемешиваем массив слов
    wordSet = shuffleArray([...wordSet]);
    let currentIndex = 0;

    const intervalMs = (60 / speed) * 1000;
    wordEl.style.display = "block";
    loadingElement.style.display = "none";

    function showNextWord() {
      if (currentIndex >= wordSet.length) {
        currentIndex = 0;
        wordSet = shuffleArray([...wordSet]); // Перемешиваем заново
      }

      const word = wordSet[currentIndex++];
      wordEl.innerHTML = '';
      const stressedWord = createStressedWord(word);
      wordEl.appendChild(stressedWord);
    }

    showNextWord(); // Показываем первое слово
    interval = setInterval(showNextWord, intervalMs);
  } catch (error) {
    console.error('Error:', error);
    loadingElement.textContent = error.message || "Произошла ошибка при запуске игры";
  }
}

function stopGame() {
  clearInterval(interval);
  wordEl.style.display = "none";
  window.location.href = './слова.html';
}

function showError(message) {
  console.error(message);
  loadingElement.textContent = message;
  loadingElement.style.display = "block";
  wordEl.style.display = "none";
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    stopGame();
  }
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopGame();
  }
});

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  backArrow.addEventListener('click', stopGame);
  startGame();
}); 