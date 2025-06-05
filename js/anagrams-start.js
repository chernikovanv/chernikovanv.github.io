document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const speedInput = document.getElementById('speedInput');
  const lengthInput = document.getElementById('lengthInput');

  // Загрузка сохраненных настроек
  const savedSpeed = localStorage.getItem('anagramsSpeed');
  const savedLength = localStorage.getItem('anagramsLength');

  if (savedSpeed) speedInput.value = savedSpeed;
  if (savedLength) lengthInput.value = savedLength;

  // Обработчик кнопки "Старт"
  startBtn.addEventListener('click', () => {
    // Сохранение настроек
    localStorage.setItem('anagramsSpeed', speedInput.value);
    localStorage.setItem('anagramsLength', lengthInput.value);

    // Переход на страницу игры
    window.location.href = './анаграммы-игра.html';
  });

  // Валидация ввода
  speedInput.addEventListener('input', () => {
    let value = parseInt(speedInput.value);
    if (isNaN(value) || value < 1) speedInput.value = 1;
    if (value > 999) speedInput.value = 999;
  });

  lengthInput.addEventListener('input', () => {
    let value = parseInt(lengthInput.value);
    if (isNaN(value) || value < 3) lengthInput.value = 3;
    if (value > 5) lengthInput.value = 5;
  });
}); 