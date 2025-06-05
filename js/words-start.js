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
    lengthInput.value = length < 2 ? 2 : (length > 5 ? 5 : length);
  }

  // Input validation
  speedInput.addEventListener('input', () => {
    let value = parseInt(speedInput.value, 10);
    if (value > 999) speedInput.value = 999;
    if (value < 1) speedInput.value = 1;
  });

  lengthInput.addEventListener('input', () => {
    let value = parseInt(lengthInput.value, 10);
    if (value > 5) lengthInput.value = 5;
    if (value < 2) lengthInput.value = 2;
  });

  // Start button handler
  startBtn.addEventListener('click', () => {
    const speed = parseInt(speedInput.value, 10);
    const length = parseInt(lengthInput.value, 10);

    if (speed < 1 || speed > 999) {
      showError("Скорость должна быть от 1 до 999");
      return;
    }

    if (length < 2 || length > 5) {
      showError("Длина слова должна быть от 2 до 5");
      return;
    }

    // Store settings
    localStorage.setItem('wordsSpeed', speed);
    localStorage.setItem('wordsLength', length);

    // Navigate to game page
    window.location.href = './слова-игра.html';
  });
}); 