document.addEventListener("DOMContentLoaded", function () {
  // Переопределяем поведение всех details
  document.querySelectorAll("details.accordion__item").forEach((details) => {
    const summary = details.querySelector("summary");
    const content = details.querySelector(".accordion__text");

    // Настройка стилей для плавной анимации
    content.style.transition = "max-height 0.4s ease, opacity 0.3s ease 0.1s";
    content.style.overflow = "hidden";
    content.style.opacity = "0";

    // Инициализация высоты
    if (details.open) {
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.opacity = "1";
    } else {
      content.style.maxHeight = "0";
      content.style.opacity = "0";
    }

    // Функция для обновления высоты
    function updateContentHeight() {
      if (details.open) {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    }

    // Перехват клика для плавной анимации
    summary.onclick = function (e) {
      e.preventDefault();

      // Если аккордеон уже открыт - плавно закрываем
      if (details.open) {
        content.style.opacity = "0";
        content.style.maxHeight = "0";

        // Ждем окончания анимации перед установкой open=false
        setTimeout(() => {
          details.open = false;
        }, 400); // Время должно совпадать с transition
      }
      // Если аккордеон закрыт - плавно открываем
      else {
        details.open = true;

        // Небольшая задержка для корректного расчета высоты
        setTimeout(() => {
          const contentHeight = content.scrollHeight;
          content.style.maxHeight = contentHeight + "px";

          // После начала анимации высоты добавляем плавное появление текста
          setTimeout(() => {
            content.style.opacity = "1";
          }, 50);
        }, 10);
      }
    };

    // Обновление высоты при изменении содержимого
    const observer = new MutationObserver(function () {
      if (details.open) {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });

    observer.observe(content, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Обновление высоты при изменении размера окна
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (details.open) {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      }, 100);
    });
  });
});
