document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const digitsInput = document.getElementById('digitsInput');

  // Input validation
  digitsInput.addEventListener('input', () => {
    let value = parseInt(digitsInput.value, 10);
    if (value > 3) digitsInput.value = 3;
    if (value < 1) digitsInput.value = 1;
  });

  // Start button handler
  startBtn.addEventListener('click', () => {
    const digits = parseInt(digitsInput.value, 10);
    if (digits < 1 || digits > 3) {
      alert("Количество знаков должно быть от 1 до 3");
      return;
    }
    
    // Store the digits value and redirect to the game page
    localStorage.setItem('mathGameDigits', digits);
    window.location.href = 'примеры-игра.html';
  });
}); 