document.addEventListener("DOMContentLoaded", function () {
  // Находим все слайдеры на странице
  const sliders = document.querySelectorAll(".special-slider");

  // Конфигурация
  const BREAKPOINT = 456; // px
  const CARDS_PER_SLIDE_DESKTOP = 6;
  const CARDS_PER_SLIDE_MOBILE = 4;

  sliders.forEach((slider) => {
    // Элементы слайдера
    const container = slider.querySelector(".special-slider__container");
    let slides = Array.from(slider.querySelectorAll(".special-slider__slide"));
    const prevBtn = slider.querySelector(".special-slider__btn--prev");
    const nextBtn = slider.querySelector(".special-slider__btn--next");
    const currentPage = slider.querySelector(".special-slider__current");
    const totalPage = slider.querySelector(".special-slider__total");

    // Переменные состояния
    let currentSlide = 0;
    let totalSlides = slides.length;
    let isMobile = window.innerWidth <= BREAKPOINT;
    let originalCards = [];

    // Инициализация - сохраняем все карточки
    function initSlider() {
      // Собираем все карточки из всех слайдов
      originalCards = [];
      slides.forEach((slide) => {
        const cards = Array.from(slide.querySelectorAll(".special__card"));
        originalCards.push(...cards);
      });

      // Пересоздаем слайды в зависимости от размера экрана
      recreateSlides();
    }

    // Функция пересоздания слайдов
    function recreateSlides() {
      isMobile = window.innerWidth <= BREAKPOINT;
      const cardsPerSlide = isMobile
        ? CARDS_PER_SLIDE_MOBILE
        : CARDS_PER_SLIDE_DESKTOP;

      // Очищаем контейнер
      container.innerHTML = "";

      // Создаем новые слайды
      slides = [];
      const totalCards = originalCards.length;

      for (let i = 0; i < totalCards; i += cardsPerSlide) {
        const slide = document.createElement("div");
        slide.className = "special-slider__slide";

        const grid = document.createElement("div");
        grid.className = "grid";

        // Берем карточки для этого слайда
        const slideCards = originalCards.slice(i, i + cardsPerSlide);
        slideCards.forEach((card) => {
          grid.appendChild(card.cloneNode(true));
        });

        slide.appendChild(grid);
        container.appendChild(slide);
        slides.push(slide);
      }

      // Обновляем количество слайдов
      totalSlides = slides.length;

      // Обновляем пагинацию
      updatePagination();

      // Возвращаемся к первому слайду
      currentSlide = 0;
      goToSlide(0, false); // false - без анимации при ресайзе

      // Инициализируем счетчики на новых карточках
      initCounters();
    }

    // Функция инициализации счетчиков
    function initCounters() {
      // Находим все новые счетчики
      const counters = container.querySelectorAll(".counter");

      counters.forEach((counter) => {
        // Элементы счетчика
        const minusBtn = counter.querySelector(".counter__btn--minus");
        const plusBtn = counter.querySelector(".counter__btn--plus");
        const valueElement = counter.querySelector(".counter__value");

        // Параметры счетчика
        const min = 1;
        const max = 9;
        let currentValue = parseInt(valueElement.textContent) || min;

        // Проверяем, чтобы начальное значение не превышало 9
        if (currentValue > max) {
          currentValue = max;
          valueElement.textContent = max;
        }

        // Функция обновления значения
        function updateValue(newValue) {
          if (newValue < min) newValue = min;
          if (newValue > max) newValue = max;

          currentValue = newValue;
          valueElement.textContent = currentValue;
          updateCounterButtons();
        }

        // Функция обновления состояния кнопок
        function updateCounterButtons() {
          minusBtn.disabled = currentValue <= min;
          plusBtn.disabled = currentValue >= max;
        }

        // Обработчики кнопок
        minusBtn.addEventListener("click", () => {
          if (currentValue > min) {
            updateValue(currentValue - 1);
          }
        });

        plusBtn.addEventListener("click", () => {
          if (currentValue < max) {
            updateValue(currentValue + 1);
          }
        });

        // Инициализация
        updateCounterButtons();
      });
    }

    // Функция обновления пагинации
    function updatePagination() {
      if (totalPage) {
        totalPage.textContent = totalSlides;
      }
      if (currentPage) {
        currentPage.textContent = currentSlide + 1;
      }
      updateButtons();
    }

    // Функция перехода к конкретному слайду
    function goToSlide(index, animate = true) {
      // Ограничиваем индекс в пределах слайдов
      if (index < 0) index = 0;
      if (index >= totalSlides) index = totalSlides - 1;

      currentSlide = index;

      // Перемещаем контейнер
      if (animate) {
        container.style.transition = "transform 0.3s ease-in-out";
      } else {
        container.style.transition = "none";
      }
      container.style.transform = `translateX(-${currentSlide * 100}%)`;

      // Обновляем пагинацию
      updatePagination();

      // Вызываем событие изменения слайда
      const event = new CustomEvent("slideChange", {
        detail: {
          currentSlide: currentSlide + 1,
          totalSlides: totalSlides,
          isMobile: isMobile,
          cardsPerSlide: isMobile
            ? CARDS_PER_SLIDE_MOBILE
            : CARDS_PER_SLIDE_DESKTOP,
        },
        bubbles: true,
      });
      slider.dispatchEvent(event);
    }

    // Функция обновления состояния кнопок
    function updateButtons() {
      if (prevBtn) {
        prevBtn.disabled = currentSlide === 0;
        prevBtn.setAttribute("aria-disabled", currentSlide === 0);
      }

      if (nextBtn) {
        nextBtn.disabled = currentSlide === totalSlides - 1;
        nextBtn.setAttribute("aria-disabled", currentSlide === totalSlides - 1);
      }
    }

    // Обработчики кнопок
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentSlide > 0) {
          goToSlide(currentSlide - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (currentSlide < totalSlides - 1) {
          goToSlide(currentSlide + 1);
        }
      });
    }

    // Ресайз окна с дебаунсингом
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const wasMobile = isMobile;
        recreateSlides();

        // Если изменился режим (мобильный/десктоп), сбрасываем на первый слайд
        if (wasMobile !== isMobile) {
          currentSlide = 0;
          goToSlide(0, false);
        } else {
          // Иначе сохраняем текущую позицию
          goToSlide(currentSlide, false);
        }
      }, 150);
    });

    // Swipe для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    container.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true },
    );

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentSlide < totalSlides - 1) {
          // Свайп влево - следующий слайд
          goToSlide(currentSlide + 1);
        } else if (diff < 0 && currentSlide > 0) {
          // Свайп вправо - предыдущий слайд
          goToSlide(currentSlide - 1);
        }
      }
    }

    // Автоматическое определение высоты контейнера
    function updateContainerHeight() {
      if (slides.length > 0 && slides[currentSlide]) {
        const activeSlide = slides[currentSlide];
        const slideHeight = activeSlide.offsetHeight;
        container.style.height = slideHeight + "px";
      }
    }

    // Обновление высоты при изменении слайда
    container.addEventListener("transitionend", updateContainerHeight);

    // Инициализация
    initSlider();

    // Обновление высоты после загрузки изображений
    window.addEventListener("load", () => {
      updateContainerHeight();
    });

    // Публичные методы API
    slider.nextSlide = function () {
      if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      }
    };

    slider.prevSlide = function () {
      if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    };

    slider.goToSlide = function (index) {
      goToSlide(index);
    };

    slider.getCurrentSlide = function () {
      return currentSlide + 1;
    };

    slider.getTotalSlides = function () {
      return totalSlides;
    };

    slider.isMobileMode = function () {
      return isMobile;
    };

    slider.recreateSlides = function () {
      recreateSlides();
    };
  });
});
