document.addEventListener('DOMContentLoaded', () => {
  const originalWordElement = document.getElementById('originalWord');
  const wordElement = document.getElementById('word');
  const backArrow = document.querySelector('.back-arrow');
  const loadingElement = document.querySelector('.loading');

  // Получение настроек из localStorage
  const speed = parseInt(localStorage.getItem('anagramsSpeed')) || 20;
  const length = parseInt(localStorage.getItem('anagramsLength')) || 5;

  let words = [];
  let currentIndex = 0;
  let intervalId = null;
  let showOriginalTimeout = null;
  let hideOriginalTimeout = null;
  let nextWordTimeout = null;

  // Проверка корректности длины
  if (length < 3 || length > 5) {
    loadingElement.textContent = 'Длина слова должна быть от 3 до 5 букв';
    return;
  }

  // Загружаем слова из файла
  fetch('слова.txt')
    .then(response => response.text())
    .then(text => {
      // Разбиваем текст на строки и фильтруем по точной длине
      words = text.split('\n')
        .map(word => word.trim())
        .filter(word => word && word.length === length);

      if (words.length === 0) {
        loadingElement.textContent = `Нет слов длиной ${length} букв`;
        return;
      }

      // Перемешивание слов
      words = shuffleArray(words);

      // Скрываем индикатор загрузки
      loadingElement.style.display = 'none';

      // Запускаем игру
      startGame();
    })
    .catch(error => {
      console.error('Error loading words:', error);
      loadingElement.textContent = 'Ошибка загрузки слов';
    });

  // Запуск показа слов
  function startGame() {
    if (intervalId) return;
    currentIndex = 0;
    showNextWord();
  }

  // Показ следующего слова
  function showNextWord() {
    if (currentIndex >= words.length) {
      currentIndex = 0;
      words = shuffleArray(words);
    }

    const word = words[currentIndex];
    const interval = Math.floor(60000 / speed); // Конвертируем скорость в миллисекунды
    
    // Очищаем предыдущие таймауты
    clearAllTimeouts();

    // Показываем анаграмму
    originalWordElement.textContent = '';
    wordElement.textContent = createAnagram(word);

    // Через interval показываем исходное слово на 2 секунды
    showOriginalTimeout = setTimeout(() => {
      originalWordElement.textContent = word;
      
      // Через 2 секунды очищаем оба слова и показываем следующую анаграмму
      hideOriginalTimeout = setTimeout(() => {
        originalWordElement.textContent = '';
        wordElement.textContent = '';
        
        // Показываем следующее слово
        nextWordTimeout = setTimeout(() => {
          currentIndex++;
          showNextWord();
        }, 100); // Небольшая пауза перед следующим словом
      }, 2000);
    }, interval);
  }

  // Очистка всех таймаутов
  function clearAllTimeouts() {
    if (showOriginalTimeout) {
      clearTimeout(showOriginalTimeout);
      showOriginalTimeout = null;
    }
    if (hideOriginalTimeout) {
      clearTimeout(hideOriginalTimeout);
      hideOriginalTimeout = null;
    }
    if (nextWordTimeout) {
      clearTimeout(nextWordTimeout);
      nextWordTimeout = null;
    }
  }

  // Создание анаграммы
  function createAnagram(word) {
    let chars = word.split('');
    let anagram = '';
    
    // Пытаемся создать анаграмму до 10 раз
    for (let attempt = 0; attempt < 10; attempt++) {
      chars = shuffleArray([...word]);
      anagram = chars.join('');
      if (anagram !== word) {
        return anagram;
      }
    }
    
    // Если не удалось создать анаграмму, возвращаем перевернутое слово
    return word.split('').reverse().join('');
  }

  // Остановка игры
  function stopGame() {
    clearAllTimeouts();
    originalWordElement.textContent = '';
    wordElement.textContent = '';
  }

  // Перемешивание массива
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Обработчики событий
  backArrow.addEventListener('click', () => {
    stopGame();
  });

  // Обработка видимости страницы
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopGame();
    } else {
      startGame();
    }
  });
}); 