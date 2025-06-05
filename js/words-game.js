document.addEventListener('DOMContentLoaded', () => {
  const wordElement = document.getElementById('word');
  const backArrow = document.querySelector('.back-arrow');
  const loadingElement = document.querySelector('.loading');

  // Получение настроек из localStorage
  const speed = parseInt(localStorage.getItem('wordsSpeed')) || 20;
  const length = parseInt(localStorage.getItem('wordsLength')) || 5;

  // Проверка корректности длины
  if (length < 2) {
    loadingElement.textContent = 'Некорректная длина слов';
    return;
  }

  let words = [];
  let currentIndex = 0;
  let intervalId = null;

  // Если длина 2, используем слоги
  if (length === 2) {
    words = syllable.filter(s => s.length === 2);
    if (words.length === 0) {
      loadingElement.textContent = 'Нет слогов заданной длины';
      return;
    }
    words = shuffleArray(words);
    loadingElement.style.display = 'none';
    startGame();
  } 
  // Иначе загружаем слова из файла
  else {
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
  }

  // Запуск показа слов
  function startGame() {
    if (intervalId) return;

    currentIndex = 0;
    const interval = Math.floor(60000 / speed); // Конвертируем скорость в миллисекунды

    showNextWord();
    intervalId = setInterval(showNextWord, interval);
  }

  // Показ следующего слова
  function showNextWord() {
    if (currentIndex >= words.length) {
      currentIndex = 0;
      words = shuffleArray(words);
    }

    wordElement.textContent = words[currentIndex];
    wordElement.style.display = 'block';
    currentIndex++;
  }

  // Остановка игры
  function stopGame() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      wordElement.textContent = '';
      wordElement.style.display = 'none';
    }
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