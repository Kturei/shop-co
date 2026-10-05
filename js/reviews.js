// load-reviews-simple.js

function loadMoreReviews() {
  const reviewsList = document.querySelector(".reviews__feedback-list");
  const buttonWrapper = document.querySelector(".reviews__button-wrapper");

  if (!reviewsList || !buttonWrapper) return;

  // Получаем второй отзыв (индекс 1, так как первый имеет индекс 0)
  const secondReview = document.querySelectorAll(".reviews__feedback")[1];

  if (!secondReview) {
    console.warn("Второй отзыв не найден");
    buttonWrapper.remove();
    return;
  }

  // Создаем 2 копии второго отзыва (без картинок)
  for (let i = 0; i < 2; i++) {
    const clonedReview = secondReview.cloneNode(true);

    // Удаляем все элементы галереи (изображения и кнопки)
    const galleryElements = clonedReview.querySelectorAll(
      ".reviews__feedback-image-list, " +
        ".toggle-gallery-btn, " +
        ".reviews__feedback-image, " +
        "[data-gallery], " +
        "[data-fslightbox]",
    );

    galleryElements.forEach((element) => {
      element.remove();
    });

    // Обновляем имя (можно сделать разные имена)
    const nameElement = clonedReview.querySelector(".reviews__feedback-name");
    if (nameElement) {
      const names = ["Анна", "Мария", "Ирина", "Елена", "Светлана"];
      nameElement.textContent = names[i] || "Анна";
    }

    // Обновляем заголовок
    const titleElement = clonedReview.querySelector(".reviews__feedback-title");
    if (titleElement) {
      const titles = [
        "Отличная покупка!",
        "Рекомендую!",
        "Очень доволен",
        "Качество на высоте",
        "Лучший фен",
      ];
      titleElement.textContent = titles[i] || "Отличная покупка!";
    }

    // Обновляем текст отзыва
    const textElement = clonedReview.querySelector(".reviews__feedback-text");
    if (textElement) {
      const texts = [
        "Фен превзошел все ожидания. Качественный, тихий, удобный в использовании. Цена полностью оправдана!",
        "Пользуюсь уже месяц, очень нравится. Волосы сушит быстро, не пересушивает. Легкий и удобный.",
        "Покупала после прочтения отзывов и не пожалела. Действительно хороший фен за свои деньги.",
        "Отличное соотношение цены и качества. Пользуюсь 2 недели, пока все нравится.",
        "Хороший фен, работает тихо, несколько режимов скорости и температуры. Удобная ручка.",
      ];
      textElement.textContent =
        texts[i] ||
        "Фен превзошел все ожидания. Качественный, тихий, удобный в использовании.";
    }

    // Обновляем дату
    const dateElement = clonedReview.querySelector(".reviews__feedback-date");
    if (dateElement) {
      // Создаем случайную дату за последние 2 месяца
      const now = new Date();
      const randomDaysAgo = Math.floor(Math.random() * 60) + 1; // 1-60 дней назад
      const pastDate = new Date(now);
      pastDate.setDate(now.getDate() - randomDaysAgo);

      const day = String(pastDate.getDate()).padStart(2, "0");
      const month = String(pastDate.getMonth() + 1).padStart(2, "0");
      const year = pastDate.getFullYear();

      dateElement.textContent = `${day}/${month}/${year}`;
    }

    // Добавляем отзыв в список
    reviewsList.appendChild(clonedReview);
  }

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
  const loadButton = document.getElementById("loadMoreReviews");

  if (loadButton) {
    loadButton.addEventListener("click", loadMoreReviews, { once: true });

    // Для доступности - поддержка клавиши Enter
    loadButton.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        loadMoreReviews();
      }
    });
  }
});

// Добавляем стили для анимации
function addAnimationStyles() {
  if (!document.getElementById("review-animation-styles")) {
    const style = document.createElement("style");
    style.id = "review-animation-styles";
    style.textContent = `
      /* Анимация появления новых отзывов */
      .reviews__feedback:nth-last-child(-n+2) {
        animation: fadeInSlideUp 0.6s ease-out forwards;
      }
      
      @keyframes fadeInSlideUp {
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
      .reviews__button-wrapper {
        transition: all 0.5s ease;
      }
      
      /* Стили для кнопки */
      .reviews__button-more {
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .reviews__button-more:hover {
        transform: translateY(-2px);
      }
      
      .reviews__button-more:active {
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }
}

// Добавляем стили
addAnimationStyles();
