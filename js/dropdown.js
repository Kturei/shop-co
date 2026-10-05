document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.querySelector(".special__dropdown");
  const dropdownButton = dropdown.querySelector(".dropdown__button");
  const dropdownMenu = dropdown.querySelector(".dropdown__menu");
  const dropdownItems = dropdown.querySelectorAll(".dropdown__item");

  // Находим все слайдеры на странице
  const sliders = document.querySelectorAll(".special-slider");

  // Функция для сохранения навигации слайдера
  function preserveSliderNavigation() {
    sliders.forEach((slider) => {
      // Сохраняем навигацию слайдера
      const nav = slider.querySelector(".special-slider__nav");
      if (nav) {
        // Перемещаем навигацию в конец контейнера слайдера
        slider.appendChild(nav);
      }
    });
  }

  // Функция для очистки кнопок слайдера от лишнего текста
  function cleanupSliderButtons() {
    const buttons = document.querySelectorAll(".special-slider__btn");

    buttons.forEach((button) => {
      // Очищаем текстовое содержимое кроме SVG
      const textNodes = [];

      button.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textNodes.push(node);
        }
      });

      textNodes.forEach((node) => button.removeChild(node));
    });
  }

  // Функция для сортировки карточек внутри слайдов
  function sortCardsInSlides(sortType) {
    sliders.forEach((slider) => {
      const slides = slider.querySelectorAll(".special-slider__slide");

      slides.forEach((slide) => {
        const grid = slide.querySelector(".grid");
        if (!grid) return;

        const cards = Array.from(grid.querySelectorAll(".special__card"));

        // Анимация исчезновения
        cards.forEach((card) => {
          card.style.transform = "translateY(10px)";
          card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        });

        // Сортировка с задержкой для анимации
        setTimeout(() => {
          // Сортируем карточки по выбранному критерию
          cards.sort((a, b) => {
            let valueA, valueB;

            switch (sortType) {
              case "popular":
                // Для популярных - специальная сортировка
                valueA = a.dataset.sort === "popular" ? 1 : 0;
                valueB = b.dataset.sort === "popular" ? 1 : 0;
                break;

              case "cheap":
                // Сначала дешёвые
                valueA = parseFloat(a.dataset.price) || 0;
                valueB = parseFloat(b.dataset.price) || 0;
                return valueA - valueB;

              case "expensive":
                // Сначала дорогие
                valueA = parseFloat(a.dataset.price) || 0;
                valueB = parseFloat(b.dataset.price) || 0;
                return valueB - valueA;

              case "new":
                // Новинки
                valueA = a.dataset.date === "new" ? 1 : 0;
                valueB = b.dataset.date === "new" ? 1 : 0;
                break;

              case "rating":
                // Высокий рейтинг
                valueA = parseFloat(a.dataset.rating) || 0;
                valueB = parseFloat(b.dataset.rating) || 0;
                break;

              default:
                return 0;
            }

            return valueB - valueA;
          });

          // Перемещаем отсортированные карточки
          cards.forEach((card) => {
            grid.appendChild(card);
          });

          // Анимация появления
          setTimeout(() => {
            cards.forEach((card) => {
              card.style.transform = "translateY(0)";
            });
          }, 50);
        }, 300);
      });

      // Сохраняем навигацию после сортировки
      setTimeout(() => {
        preserveSliderNavigation();
        cleanupSliderButtons(); // Очищаем кнопки
      }, 350);
    });
  }

  // Инициализация - сохранение навигации при загрузке
  setTimeout(() => {
    preserveSliderNavigation();
    cleanupSliderButtons();
  }, 100);

  // Проверяем, есть ли уже активный элемент в меню
  let hasActiveItem = false;
  dropdownItems.forEach((item) => {
    if (item.classList.contains("active")) {
      hasActiveItem = true;
      const buttonText = dropdownButton.childNodes[0];
      if (buttonText.nodeType === Node.TEXT_NODE) {
        buttonText.textContent = item.textContent.trim();
      }
    }
  });

  // Если нет активного элемента, делаем первый активным
  if (!hasActiveItem && dropdownItems.length > 0) {
    dropdownItems[0].classList.add("active");
    // Сразу применяем сортировку "популярные"
    sortCardsInSlides("popular");
  }

  // Функция для открытия/закрытия меню
  function toggleDropdown() {
    dropdown.classList.toggle("active");
    dropdownMenu.classList.toggle("show");
  }

  // Функция для закрытия меню
  function closeDropdown() {
    dropdown.classList.remove("active");
    dropdownMenu.classList.remove("show");
  }

  // Открытие/закрытие меню по клику на кнопку
  dropdownButton.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleDropdown();
  });

  // Обработка клика по пунктам меню
  dropdownItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.stopPropagation();

      // Получаем текст выбранного пункта
      const selectedText = this.textContent.trim();
      const sortType = this.getAttribute("data-sort");

      // Обновляем текст кнопки
      const buttonText = dropdownButton.childNodes[0];
      if (buttonText.nodeType === Node.TEXT_NODE) {
        buttonText.textContent = selectedText;
      }

      // Убираем активный класс у всех пунктов
      dropdownItems.forEach((i) => {
        i.classList.remove("active");
      });

      // Добавляем активный класс выбранному пункту
      this.classList.add("active");

      // Закрываем меню
      closeDropdown();

      // Применяем сортировку
      sortCardsInSlides(sortType);
    });
  });

  // Закрытие меню при клике вне его
  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target)) {
      closeDropdown();
    }
  });

  // Закрытие меню при нажатии Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && dropdown.classList.contains("active")) {
      closeDropdown();
    }
  });

  // Закрытие меню при скролле страницы
  window.addEventListener("scroll", function () {
    if (dropdown.classList.contains("active")) {
      closeDropdown();
    }
  });
});
