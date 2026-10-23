import { validate } from "../validation";
import { inputStyles } from "@shared/ui";

import type { ValidationKey } from "../validation";

// Очищает ошибку валидации для конкретного инпута
// Удаляет span с текстом ошибки и класс ошибки с input
function clearInputError(input: HTMLInputElement): void {
  // Ищем wrapper (inputWrapper) вокруг инпута
  const wrapper = input.closest("[class*='inputWrapper']");
  if (wrapper) {
    // Находим и удаляем span с ошибкой
    const errorSpan = wrapper.querySelector("[class*='error']");
    errorSpan?.remove();
    // Убираем класс ошибки с инпута
    input.classList.remove(inputStyles.inputError);
  }
}

// Валидирует все инпуты в форме, показывает ошибки и собирает данные
// Возвращает true если ошибок нет, false если есть ошибки
export function validateForm(form: HTMLFormElement): boolean {
  // Получаем все input-элементы внутри формы
  const inputs = form.querySelectorAll<HTMLInputElement>("input");

  // Очищаем все существующие ошибки перед новой валидацией
  inputs.forEach(clearInputError);

  let hasError = false;

  // Проходим по всем инпутам и проверяем их значения
  inputs.forEach((input) => {
    // Получаем ключ валидации из data-validation-key
    const validationKey = input.getAttribute("data-validation-key");
    if (!validationKey) return;

    // Вызываем валидацию для текущего поля
    const error = validate(input.value, validationKey as ValidationKey);
    // Ищем wrapper вокруг инпута для отображения ошибки
    const wrapper = input.closest("[class*='inputWrapper']");
    if (wrapper) {
      // Находим существующий span с ошибкой
      const errorSpan = wrapper.querySelector("[class*='error']");
      const inputElement = wrapper.querySelector("input");

      // Если есть ошибка — показываем её
      if (error) {
        hasError = true;
        // Создаём новый span с ошибкой или обновляем существующий
        if (!errorSpan) {
          const span = document.createElement("span");
          span.className = inputStyles.error;
          span.textContent = error;
          wrapper.appendChild(span);
        } else {
          errorSpan.textContent = error;
        }
        // Добавляем класс ошибки к инпуту
        inputElement?.classList.add(inputStyles.inputError);
      }
    }
  });

  // Если есть ошибки — возвращаем false (форма не отправлена)
  if (hasError) return false;

  // Собираем данные формы в объект и выводим в консоль
  const formData = new FormData(form);
  const data: Record<string, string> = {};
  formData.forEach((value, key) => (data[key] = value as string));
  // eslint-disable-next-line no-console
  console.log("Form data:", data);
  return true;
}
