document.addEventListener("DOMContentLoaded", function () {
  // Инициализация всех галерей на странице
  initGalleries();

  function initGalleries() {
    // Находим все кнопки переключения галерей
    const toggleButtons = document.querySelectorAll(".toggle-gallery-btn");

    toggleButtons.forEach((button) => {
      const galleryId = button.getAttribute("data-gallery");
      const galleryContainer = document.querySelector(
        `[data-gallery="${galleryId}"]`,
      );

      if (!galleryContainer) return;

      // Находим все переключаемые изображения в этой галерее
      const toggleableImages =
        galleryContainer.querySelectorAll(".toggleable-image");

      // Если нет скрытых изображений, скрываем кнопку
      if (toggleableImages.length === 0) {
        button.style.display = "none";
        return;
      }

      // Инициализируем состояние
      let isVisible = false;
      button.setAttribute("data-state", "hidden");

      // Обработчик клика для этой кнопки
      button.addEventListener("click", function (e) {
        e.preventDefault();

        if (!isVisible) {
          // Показать скрытые изображения
          showImages(toggleableImages, button);
          isVisible = true;
        } else {
          // Скрыть изображения
          hideImages(toggleableImages, button);
          isVisible = false;
        }

        // Обновляем FsLightbox для этой галереи
        updateGalleryLightbox(galleryId);
      });
    });
  }

  // Функция для показа изображений
  function showImages(images, button) {
    images.forEach((img, index) => {
      setTimeout(() => {
        img.style.display = "block";
        // Запускаем анимацию
        setTimeout(() => {
          img.classList.remove("hiding");
          img.classList.add("showing");
        }, 10);
      }, index * 100);
    });

    button.textContent = "Скрыть фото";
    button.setAttribute("data-state", "visible");
  }

  // Функция для скрытия изображений
  function hideImages(images, button) {
    images.forEach((img, index) => {
      setTimeout(() => {
        img.classList.remove("showing");
        img.classList.add("hiding");

        // После анимации скрываем элемент
        setTimeout(() => {
          img.style.display = "none";
          img.classList.remove("hiding");
        }, 300);
      }, index * 50);
    });

    button.textContent = "Смотреть все фото";
    button.setAttribute("data-state", "hidden");
  }

  // Функция для обновления FsLightbox конкретной галереи
  function updateGalleryLightbox(galleryId) {
    // Даем время для завершения анимации
    setTimeout(() => {
      // Способ 1: стандартный метод FsLightbox
      if (typeof refreshFsLightbox === "function") {
        refreshFsLightbox();
      }
      // Способ 2: если доступны экземпляры
      else if (
        window.fsLightboxInstances &&
        window.fsLightboxInstances[galleryId]
      ) {
        // Получаем только видимые изображения этой галереи
        const visibleImages = document.querySelectorAll(
          `[data-fslightbox="${galleryId}"]:not(.toggleable-image), 
                     [data-fslightbox="${galleryId}"].toggleable-image.showing`,
        );

        const sources = Array.from(visibleImages).map((link) =>
          link.getAttribute("href"),
        );
        window.fsLightboxInstances[galleryId].props.sources = sources;
      }
      // Способ 3: полная переинициализация
      else {
        // Переинициализируем все галереи
        document.querySelectorAll("[data-fslightbox]").forEach((link) => {
          link.removeAttribute("data-fslightbox-handled");
        });

        if (typeof fsLightbox === "function") {
          fsLightbox();
        }
      }
    }, 350);
  }
});
