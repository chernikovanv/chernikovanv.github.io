document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const wordEl = document.getElementById('word');
  const originalWordEl = document.getElementById('originalWord');
  const backArrow = document.querySelector('.back-arrow');
  const loadingElement = document.querySelector('.loading');

  // Game state
  let wordIterator = null;
  let usedWords = new Set();
  let currentWordSet = [];
  let isGameRunning = false;

  function* createWordIterator(words) {
    currentWordSet = [...words];
    usedWords.clear();

    while (true) {
      if (usedWords.size >= currentWordSet.length) {
        console.log('Resetting word pool');
        usedWords.clear();
      }

      let word;
      do {
        const index = Math.floor(Math.random() * currentWordSet.length);
        word = currentWordSet[index];
      } while (usedWords.has(word));

      usedWords.add(word);
      yield word;
    }
  }

  function removeStressMarks(word) {
    return word.normalize('NFD').replace(/[\u0301\u0300]/g, '');
  }

  function shuffleWord(word) {
    // Remove stress marks for shuffling
    const wordWithoutStress = removeStressMarks(word);
    
    if (wordWithoutStress.length <= 1) return wordWithoutStress;

    const letters = wordWithoutStress.split('');
    let shuffled;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      for(let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
      shuffled = letters.join('');
      attempts++;
    } while (shuffled === wordWithoutStress && attempts < maxAttempts);

    if (shuffled === wordWithoutStress && wordWithoutStress.length > 1) {
      [letters[0], letters[1]] = [letters[1], letters[0]];
      shuffled = letters.join('');
    }

    return shuffled;
  }

  function startGame() {
    console.log('Starting game...');
    if (isGameRunning) {
      console.log('Game already running, returning');
      return;
    }
    isGameRunning = true;
    showNextWord();
  }

  async function showNextWord() {
    if (!isGameRunning) return;

    try {
      const word = wordIterator.next().value;
      console.log('Got word:', word);
      const shuffledWord = shuffleWord(word);
      console.log('Shuffled to:', shuffledWord);

      // Show shuffled version without stress marks
      wordEl.style.display = "block";
      wordEl.textContent = shuffledWord;
      originalWordEl.style.display = "block";
      originalWordEl.textContent = '';

      // Wait based on speed
      const speed = parseInt(localStorage.getItem('anagramsSpeed')) || 20;
      const intervalMs = (60 / speed) * 1000;
      await new Promise(resolve => setTimeout(resolve, intervalMs));

      // Show original word without stress marks
      originalWordEl.textContent = removeStressMarks(word);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear both words
      wordEl.textContent = '';
      originalWordEl.textContent = '';

      // Small pause before next word
      await new Promise(resolve => setTimeout(resolve, 200));

      // Schedule next word if game is still running
      if (isGameRunning) {
        requestAnimationFrame(showNextWord);
      }
    } catch (error) {
      console.error('Error in game cycle:', error);
      stopGame();
    }
  }

  function stopGame() {
    console.log('Stopping game');
    isGameRunning = false;
    wordIterator = null;
    wordEl.textContent = '';
    originalWordEl.textContent = '';
    wordEl.style.display = 'none';
    originalWordEl.style.display = 'none';
    window.location.href = './анаграммы.html';
  }

  // Event handlers
  backArrow.addEventListener('click', stopGame);

  // Handle page visibility
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopGame();
    } else {
      startGame();
    }
  });

  // Initialize game
  async function initGame() {
    // Get settings from localStorage
    const length = parseInt(localStorage.getItem('anagramsLength')) || 5;

    if (length < 3 || length > 5) {
      console.error('Invalid length:', length);
      loadingElement.textContent = 'Длина слова должна быть от 3 до 5 букв';
      return;
    }

    try {
      const response = await fetch('слова.txt');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      // Filter words and remove stress marks for length comparison
      const words = text.split('\n')
        .map(word => word.trim())
        .filter(word => {
          const wordWithoutStress = removeStressMarks(word);
          return word && wordWithoutStress.length === length;
        });

      if (words.length === 0) {
        loadingElement.textContent = `Нет слов длиной ${length} букв`;
        return;
      }

      wordIterator = createWordIterator(words);
      loadingElement.style.display = 'none';
      startGame();
    } catch (error) {
      console.error('Error loading words:', error);
      loadingElement.textContent = 'Ошибка загрузки слов';
    }
  }

  // Hide word elements initially
  wordEl.style.display = "none";
  originalWordEl.style.display = "none";
  
  // Start the game
  initGame();
}); 