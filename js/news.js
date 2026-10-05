// load-news-cards.js

function loadMoreNews() {
  const newsGrid = document.querySelector(".news__grid");
  const buttonWrapper = document.querySelector(".news__button-wrapper");
  const button = document.querySelector(".news__button-more");

  if (!newsGrid || !buttonWrapper || !button) {
    console.warn("Не найдены необходимые элементы для загрузки новостей");
    return;
  }

  // Находим все существующие карточки новостей
  const existingCards = document.querySelectorAll(".news__item");

  if (existingCards.length === 0) {
    console.warn("Карточки новостей не найдены");
    buttonWrapper.remove();
    return;
  }

  // Создаем копии первых 3 карточек (или меньше, если их меньше 3)
  for (let i = 0; i < Math.min(3, existingCards.length); i++) {
    const originalCard = existingCards[i];

    // Создаем глубокую копию карточки
    const clonedCard = originalCard.cloneNode(true);

    // Добавляем класс для анимации
    clonedCard.classList.add("news-card-new");

    // Добавляем карточку в сетку
    newsGrid.appendChild(clonedCard);
  }

  // Анимация появления новых карточек
  const newCards = document.querySelectorAll(".news-card-new");

  // Активируем анимацию с небольшой задержкой
  setTimeout(() => {
    newCards.forEach((card) => {
      card.classList.add("news-card-visible");
    });
  }, 50);

  // Удаляем классы анимации после завершения
  setTimeout(() => {
    newCards.forEach((card) => {
      card.classList.remove("news-card-new", "news-card-visible");
    });
  }, 600);

  // Удаляем кнопку с анимацией
  buttonWrapper.style.transition = "all 0.5s ease";
  buttonWrapper.style.opacity = "0";
  buttonWrapper.style.transform = "translateY(20px)";

  setTimeout(() => {
    buttonWrapper.remove();
  }, 500);
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  const loadButton = document.querySelector(".news__button-more");

  if (loadButton) {
    loadButton.addEventListener("click", loadMoreNews, { once: true });

    // Для доступности - поддержка клавиши Enter
    loadButton.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        loadMoreNews();
      }
    });
  }
});

// Добавляем стили для анимации
function addAnimationStyles() {
  if (!document.getElementById("news-animation-styles")) {
    const style = document.createElement("style");
    style.id = "news-animation-styles";
    style.textContent = `
      /* Анимация появления новых карточек */
      .news-card-new {
        opacity: 0;
        transform: translateY(30px);
      }
      
      .news-card-visible {
        animation: newsFadeInSlideUp 0.6s ease-out forwards;
      }
      
      @keyframes newsFadeInSlideUp {
        0% {
          opacity: 0;
          transform: translateY(30px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Плавное исчезновение кнопки */
      .news__button-wrapper {
        transition: all 0.5s ease;
      }
      
      /* Стили для кнопки */
      .news__button-more {
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .news__button-more:hover {
        transform: translateY(-2px);
      }
      
      .news__button-more:active {
        transform: translateY(0);
      }
      
      /* Фокус для доступности */
      .news__button-more:focus {
        outline: 2px solid #007bff;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }
}

// Добавляем стили
addAnimationStyles();
