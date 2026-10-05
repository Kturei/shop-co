document.addEventListener("DOMContentLoaded", function () {
  const choiceList = document.querySelector(".special__choice-list");
  const button = document.querySelector(".special__choice-button");

  // Получаем все оригинальные элементы li с ссылками
  const originalItems = Array.from(
    document.querySelectorAll(".special__choice-list > li"),
  );

  let isExpanded = false;
  let addedItems = [];

  button.addEventListener("click", function () {
    if (!isExpanded) {
      // Добавляем 4 новых элемента li с ссылками (повторяем существующие)
      for (let i = 0; i < 4; i++) {
        // Берем элемент li по кругу
        const originalItem = originalItems[i % originalItems.length];

        // Создаем глубокую копию элемента li (вместе со всеми дочерними элементами)
        const newItem = originalItem.cloneNode(true);
        choiceList.appendChild(newItem);
        addedItems.push(newItem);
      }

      button.textContent = "Скрыть";
      isExpanded = true;
    } else {
      // Удаляем добавленные элементы li
      addedItems.forEach((item) => {
        if (item.parentNode) {
          item.parentNode.removeChild(item);
        }
      });

      addedItems = [];
      button.textContent = "Показать еще";
      isExpanded = false;
    }
  });
});
