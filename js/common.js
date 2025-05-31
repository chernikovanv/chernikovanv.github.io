// Cache for words
let wordsCache = null;

// Utility functions
async function loadWords() {
  if (wordsCache) return wordsCache;
  
  const loadingEl = document.querySelector('.loading');
  if (loadingEl) loadingEl.classList.add('active');
  
  try {
    const response = await fetch('слова.txt');
    if (!response.ok) throw new Error('Network response was not ok');
    const text = await response.text();
    wordsCache = text.split('\n').map(w => w.trim()).filter(w => w);
    return wordsCache;
  } catch(e) {
    console.error('Error loading words:', e);
    showError('Ошибка загрузки файла слов: ' + e.message);
    throw e;
  } finally {
    if (loadingEl) loadingEl.classList.remove('active');
  }
}

function showError(message) {
  const existingError = document.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

function validateInputs(speed, maxLength) {
  if (isNaN(speed) || speed < 1) {
    showError("Скорость должна быть числом больше 0");
    return false;
  }
  if (isNaN(maxLength) || maxLength < 1) {
    showError("Длина слова должна быть числом больше 0");
    return false;
  }
  return true;
}

function filterWords(words, maxLength, includeSyllables = false) {
  let filtered = words.filter(w => w.replace(/[\u0300-\u036f]/g, '').length <= maxLength);
  if (includeSyllables && maxLength === 2) {
    filtered = [...filtered, ...syllable];
  }
  return filtered;
}

function getRandomWord(filteredWords) {
  if (!filteredWords || filteredWords.length === 0) {
    throw new Error('Нет доступных слов');
  }
  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
} 