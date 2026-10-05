document.addEventListener("DOMContentLoaded", function () {
  const burgerButton = document.querySelector(".header__button-burger");
  const menuNav = document.querySelector(".menu__list");

  if (burgerButton && menuNav) {
    // Функция для проверки ширины экрана
    function isMobileWidth() {
      return window.innerWidth <= 1250;
    }

    // Функция для переключения меню
    function toggleMenu() {
      if (!isMobileWidth()) return; // Работает только на мобильных

      const isOpening = !burgerButton.classList.contains("active");

      burgerButton.classList.toggle("active");
      menuNav.classList.toggle("menu__list--open");

      const isExpanded = burgerButton.getAttribute("aria-expanded") === "true";
      burgerButton.setAttribute("aria-expanded", !isExpanded);

      // Блокируем скролл
      document.body.style.overflow = isOpening ? "hidden" : "";
    }

    // Вешаем обработчик клика
    burgerButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    // Добавляем проверку при ресайзе
    window.addEventListener("resize", function () {
      // Если перешли на десктоп, закрываем меню
      if (window.innerWidth > 1250) {
        burgerButton.classList.remove("active");
        menuNav.classList.remove("menu__list--open");
        burgerButton.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });

    // Закрытие меню при клике на ссылку
    const menuLinks = document.querySelectorAll(".menu__list");
    menuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (isMobileWidth()) {
          burgerButton.classList.remove("active");
          menuNav.classList.remove("menu__list--open");
          burgerButton.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });
    });
  }
});
