// Версия приложения
const APP_VERSION = 'v1.4.10';

// Устанавливаем версию при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const versionElements = document.querySelectorAll('.version-number');
    versionElements.forEach(element => {
        element.textContent = APP_VERSION;
    });
}); 