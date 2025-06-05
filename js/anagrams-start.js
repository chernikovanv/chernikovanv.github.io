document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const speedInput = document.getElementById('speedInput');
  const lengthInput = document.getElementById('lengthInput');

  // Загрузка сохраненных настроек
  const savedSpeed = localStorage.getItem('anagramsSpeed');
  const savedLength = localStorage.getItem('anagramsLength');

  console.log('Loading saved settings:', { savedSpeed, savedLength });

  if (savedSpeed) speedInput.value = savedSpeed;
  if (savedLength) lengthInput.value = savedLength;

  // Обработчик кнопки "Старт"
  startBtn.addEventListener('click', () => {
    // Проверяем и корректируем значения перед сохранением
    let speed = parseInt(speedInput.value);
    let length = parseInt(lengthInput.value);

    // Валидация значений
    if (isNaN(speed) || speed < 1) speed = 20;
    if (speed > 999) speed = 999;
    if (isNaN(length) || length < 3) length = 3;
    if (length > 5) length = 5;

    // Обновляем значения в полях ввода
    speedInput.value = speed;
    lengthInput.value = length;

    console.log('Saving settings:', { speed, length });

    // Сохранение настроек
    localStorage.setItem('anagramsSpeed', speed);
    localStorage.setItem('anagramsLength', length);

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