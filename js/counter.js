document.addEventListener("DOMContentLoaded", function () {
  // Находим все счетчики на странице
  const counters = document.querySelectorAll(".counter");

  // Обрабатываем каждый счетчик
  counters.forEach((counter) => {
    // Элементы счетчика
    const minusBtn = counter.querySelector(".counter__btn--minus");
    const plusBtn = counter.querySelector(".counter__btn--plus");
    const valueElement = counter.querySelector(".counter__value");

    // Параметры счетчика
    const min = parseInt(counter.dataset.min) || 1;
    const max = 9; // Фиксированное максимальное значение 9
    const step = parseInt(counter.dataset.step) || 1;

    // Получаем текущее значение
    let currentValue = parseInt(valueElement.textContent) || min;

    // Проверяем, чтобы начальное значение не превышало 9
    if (currentValue > max) {
      currentValue = max;
      valueElement.textContent = max;
    }

    // Функция обновления значения
    function updateValue(newValue) {
      // Ограничиваем значение min и max
      if (newValue < min) newValue = min;
      if (newValue > max) newValue = max;

      currentValue = newValue;
      valueElement.textContent = currentValue;

      // Обновляем состояние кнопок
      updateButtons();

      // Добавляем визуальную анимацию изменения значения
      valueElement.classList.add("counter__value--changed");
      setTimeout(() => {
        valueElement.classList.remove("counter__value--changed");
      }, 200);

      // Вызываем пользовательское событие
      const event = new CustomEvent("counterChange", {
        detail: {
          value: currentValue,
          isMax: currentValue === max,
          isMin: currentValue === min,
        },
        bubbles: true,
      });
      counter.dispatchEvent(event);
    }

    // Функция обновления состояния кнопок
    function updateButtons() {
      const isMin = currentValue <= min;
      const isMax = currentValue >= max;

      // Просто обновляем состояние disabled
      minusBtn.disabled = isMin;
      plusBtn.disabled = isMax;

      // Обновляем ARIA-атрибуты
      minusBtn.setAttribute("aria-disabled", isMin);
      plusBtn.setAttribute("aria-disabled", isMax);

      // Обновляем aria-label
      plusBtn.setAttribute(
        "aria-label",
        isMax ? "Достигнут максимум 9" : "Увеличить",
      );
      minusBtn.setAttribute(
        "aria-label",
        isMin ? "Достигнут минимум" : "Уменьшить",
      );

      // Удаляем инлайн-стили, пусть CSS делает свою работу
      plusBtn.style.opacity = "";
      plusBtn.style.cursor = "";
      minusBtn.style.opacity = "";
      minusBtn.style.cursor = "";
    }

    // Обработчик увеличения
    plusBtn.addEventListener("click", function () {
      if (currentValue < max) {
        updateValue(currentValue + step);
      } else {
        // Визуальная обратная связь при достижении максимума
        valueElement.classList.add("counter__value--shake");
        setTimeout(() => {
          valueElement.classList.remove("counter__value--shake");
        }, 300);
      }
    });

    // Поддержка клавиатуры
    minusBtn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (currentValue > min) {
          updateValue(currentValue - step);
        }
      }
    });

    plusBtn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (currentValue < max) {
          updateValue(currentValue + step);
        } else {
          valueElement.classList.add("counter__value--shake");
          setTimeout(() => {
            valueElement.classList.remove("counter__value--shake");
          }, 300);
        }
      }
    });

    // Обработка клавиш стрелок для элемента значения
    valueElement.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentValue < max) {
          updateValue(currentValue + step);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (currentValue > min) {
          updateValue(currentValue - step);
        }
      }
    });

    // Долгое нажатие (зажатие кнопки)
    let pressTimer;

    function startLongPress(button, isPlus) {
      if ((isPlus && currentValue >= max) || (!isPlus && currentValue <= min)) {
        return;
      }

      pressTimer = setTimeout(() => {
        const interval = setInterval(() => {
          if (isPlus && currentValue < max) {
            updateValue(currentValue + step);
          } else if (!isPlus && currentValue > min) {
            updateValue(currentValue - step);
          } else {
            clearInterval(interval);
          }
        }, 100);

        function stopAction() {
          clearInterval(interval);
          document.removeEventListener("mouseup", stopAction);
          document.removeEventListener("touchend", stopAction);
          document.removeEventListener("mouseleave", stopAction);
        }

        document.addEventListener("mouseup", stopAction);
        document.addEventListener("touchend", stopAction);
        document.addEventListener("mouseleave", stopAction);
      }, 300);
    }

    function stopLongPress() {
      clearTimeout(pressTimer);
    }

    // Для мыши
    minusBtn.addEventListener("mousedown", () =>
      startLongPress(minusBtn, false),
    );
    plusBtn.addEventListener("mousedown", () => startLongPress(plusBtn, true));

    minusBtn.addEventListener("mouseup", stopLongPress);
    minusBtn.addEventListener("mouseleave", stopLongPress);
    plusBtn.addEventListener("mouseup", stopLongPress);
    plusBtn.addEventListener("mouseleave", stopLongPress);

    // Для сенсорных устройств
    minusBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startLongPress(minusBtn, false);
    });

    plusBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startLongPress(plusBtn, true);
    });

    minusBtn.addEventListener("touchend", stopLongPress);
    plusBtn.addEventListener("touchend", stopLongPress);

    // Инициализация
    updateButtons();

    // Публичные методы для внешнего использования
    counter.setValue = function (value) {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        updateValue(numValue);
      }
    };

    counter.getValue = function () {
      return currentValue;
    };

    counter.reset = function () {
      updateValue(min);
    };

    counter.getMax = function () {
      return max;
    };
  });

  // Глобальные функции для работы со счетчиками
  window.getCounterValue = function (counterElement) {
    const counterInstance = counterElement;
    if (counterInstance.getValue) {
      return counterInstance.getValue();
    }
    return (
      parseInt(counterElement.querySelector(".counter__value").textContent) || 1
    );
  };

  window.setCounterValue = function (counterElement, value) {
    const counterInstance = counterElement;
    if (counterInstance.setValue) {
      counterInstance.setValue(value);
    }
  };

  window.resetCounter = function (counterElement) {
    const counterInstance = counterElement;
    if (counterInstance.reset) {
      counterInstance.reset();
    }
  };

  window.checkIsMax = function (counterElement) {
    const counterInstance = counterElement;
    if (counterInstance.getValue && counterInstance.getMax) {
      return counterInstance.getValue() === counterInstance.getMax();
    }
    return (
      parseInt(counterElement.querySelector(".counter__value").textContent) ===
      9
    );
  };
});
