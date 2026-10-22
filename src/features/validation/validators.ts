/**
 * Правила валидации для каждого поля.
 * Ключ объекта — имя поля (совпадает с name в формах).
 */
const validators = {
  first_name: {
    regex: /^[A-ЯёA-Z][a-яёa-z-]*$/,
    message:
      "Имя должно начинаться с заглавной буквы, содержать только буквы и дефис",
  },
  second_name: {
    regex: /^[A-ЯёA-Z][a-яёa-z-]*$/,
    message:
      "Фамилия должна начинаться с заглавной буквы, содержать только буквы и дефис",
  },
  login: {
    regex: /^[a-zA-Z0-9_-]{3,20}$/,
    message:
      "Логин: 3–20 символов, латиница, цифры, дефис и подчёркивание, не может состоять только из цифр",
  },
  email: {
    regex: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/,
    message: "Введите корректный email (например: user@example.com)",
  },
  password: {
    regex: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
    message:
      "Пароль: 8–40 символов, хотя бы одна заглавная буква и одна цифра",
  },
  old_password: {
    regex: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
    message:
      "Пароль: 8–40 символов, хотя бы одна заглавная буква и одна цифра",
  },
  new_password: {
    regex: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
    message:
      "Пароль: 8–40 символов, хотя бы одна заглавная буква и одна цифра",
  },
  phone: {
    regex: /^\+?\d{10,15}$/,
    message: "Телефон: 10–15 цифр, возможен + в начале",
  },
  message: {
    regex: /.+/,
    message: "Сообщение не может быть пустым",
  },
} as const;

/** Тип ключей валидаторов */
export type ValidationKey = keyof typeof validators;

/**
 * Проверяет значение поля по правилу.
 * @param value — введённое значение
 * @param key — ключ валидации (имя поля)
 * @returns null если валидация пройдена, иначе — сообщение об ошибке
 */
export function validate(
  value: string,
  key: ValidationKey
): string | null {
  const validator = validators[key];
  if (value.length === 0) {
    return null; // пустое поле — ошибку показываем только после blur/submit
  }
  if (!validator.regex.test(value)) {
    return validator.message;
  }
  return null;
}
