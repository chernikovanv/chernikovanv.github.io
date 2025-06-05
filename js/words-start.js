document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const speedInput = document.getElementById('speedInput');
  const lengthInput = document.getElementById('lengthInput');

  // Загрузка сохраненных настроек
  const savedSpeed = localStorage.getItem('wordsSpeed');
  const savedLength = localStorage.getItem('wordsLength');

  if (savedSpeed) speedInput.value = savedSpeed;
  if (savedLength) {
    const length = parseInt(savedLength);
    lengthInput.value = length < 2 ? 2 : length;
  }

  // Обработчик кнопки "Старт"
  startBtn.addEventListener('click', () => {
    // Сохранение настроек
    localStorage.setItem('wordsSpeed', speedInput.value);
    localStorage.setItem('wordsLength', lengthInput.value);

    // Переход на страницу игры
    window.location.href = './слова-игра.html';
  });

  // Валидация ввода
  speedInput.addEventListener('input', () => {
    let value = parseInt(speedInput.value);
    if (isNaN(value) || value < 1) speedInput.value = 1;
    if (value > 999) speedInput.value = 999;
  });

  lengthInput.addEventListener('input', () => {
    let value = parseInt(lengthInput.value);
    if (isNaN(value) || value < 2) lengthInput.value = 2;
    if (value > 5) lengthInput.value = 5;
  });
}); 