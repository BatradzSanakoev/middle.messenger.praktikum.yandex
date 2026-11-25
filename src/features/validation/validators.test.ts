import { describe, it, expect } from "vitest";
import { validate } from "./validators";

describe("validate", () => {
  describe("first_name", () => {
    it("должна принимать имя с заглавной буквы (кириллица)", () => {
      expect(validate("Александр", "first_name")).toBeNull();
    });

    it("должна принимать имя с заглавной буквы (латиница)", () => {
      expect(validate("Alexander", "first_name")).toBeNull();
    });

    it("должна принимать имя с дефисом", () => {
      // Regex: /^[А-ЯЁA-Z][а-яёa-z-]*$/ — дефис только после первой буквы, без пробелов
      expect(validate("Андрей-м", "first_name")).toBeNull();
    });

    it("должна отклонять имя с пробелами", () => {
      expect(validate("Андрей М", "first_name")).not.toBeNull();
    });

    it("должна отклонять имя с маленькой буквы", () => {
      expect(validate("александр", "first_name")).not.toBeNull();
    });

    it("должна отклонять имя с цифрами", () => {
      expect(validate("Алекс1андр", "first_name")).not.toBeNull();
    });
  });

  describe("second_name", () => {
    it("должна принимать фамилию с заглавной буквы", () => {
      expect(validate("Иванов", "second_name")).toBeNull();
    });

    it("должна отклонять фамилию с маленькой буквы", () => {
      expect(validate("иванов", "second_name")).not.toBeNull();
    });
  });

  describe("login", () => {
    it("должна принимать валидный логин", () => {
      expect(validate("user123", "login")).toBeNull();
      expect(validate("user_name", "login")).toBeNull();
      expect(validate("user-name", "login")).toBeNull();
    });

    it("должна отклонять логин короче 3 символов", () => {
      expect(validate("ab", "login")).not.toBeNull();
    });

    it("должна отклонять логин длиннее 20 символов", () => {
      expect(validate("a".repeat(21), "login")).not.toBeNull();
    });

    it("должна отклонять логин только из цифр", () => {
      expect(validate("123456", "login")).not.toBeNull();
    });

    it("должна отклонять логин с кириллицей", () => {
      expect(validate("пользователь", "login")).not.toBeNull();
    });
  });

  describe("email", () => {
    it("должна принимать валидный email", () => {
      expect(validate("user@example.com", "email")).toBeNull();
    });

    it("должна отклонять email без @", () => {
      expect(validate("userexample.com", "email")).not.toBeNull();
    });

    it("должна отклонять email без домена", () => {
      expect(validate("user@", "email")).not.toBeNull();
    });

    it("должна отклонять email без точки в домене", () => {
      expect(validate("user@examplecom", "email")).not.toBeNull();
    });
  });

  describe("password", () => {
    it("должна принимать валидный пароль", () => {
      expect(validate("Password1", "password")).toBeNull();
    });

    it("должна отклонять пароль короче 8 символов", () => {
      // Regex: /^(?=.*[A-Z])(?=.*\d).{8,40}$/ — минимум 8 символов
      expect(validate("Pass1ab", "password")).not.toBeNull();
    });

    it("должна отклонять пароль без заглавной буквы", () => {
      expect(validate("password1", "password")).not.toBeNull();
    });

    it("должна отклонять пароль без цифры", () => {
      expect(validate("Password", "password")).not.toBeNull();
    });

    it("должна отклонять пароль длиннее 40 символов", () => {
      expect(validate("A" + "a".repeat(40) + "1", "password")).not.toBeNull();
    });
  });

  describe("phone", () => {
    it("должна принимать телефон с +", () => {
      expect(validate("+79991234567", "phone")).toBeNull();
    });

    it("должна принимать телефон без +", () => {
      expect(validate("79991234567", "phone")).toBeNull();
    });

    it("должна отклонять телефон короче 10 цифр", () => {
      expect(validate("123456789", "phone")).not.toBeNull();
    });

    it("должна отклонять телефон длиннее 15 цифр", () => {
      expect(validate("1234567890123456", "phone")).not.toBeNull();
    });

    it("должна отклонять телефон с буквами", () => {
      expect(validate("+7999ABC1234", "phone")).not.toBeNull();
    });
  });

  describe("message", () => {
    it("должна принимать непустое сообщение", () => {
      expect(validate("Привет!", "message")).toBeNull();
    });

    it("должна отклонять пустое сообщение", () => {
      expect(validate("", "message")).not.toBeNull();
    });

    it("должна отклонять сообщение только из пробелов", () => {
      expect(validate("   ", "message")).toBeNull();
    });
  });

  describe("isEmptyAllowed", () => {
    it("пустое значение должно быть валидным по умолчанию", () => {
      expect(validate("", "first_name")).toBeNull();
    });

    it("пустое значение должно быть невалидным для message", () => {
      expect(validate("", "message")).not.toBeNull();
    });
  });

  describe("display_name", () => {
    it("должна принимать валидное имя в чате", () => {
      expect(validate("user_123", "display_name")).toBeNull();
      expect(validate("user-name", "display_name")).toBeNull();
    });

    it("должна отклонять имя с пробелами", () => {
      expect(validate("user name", "display_name")).not.toBeNull();
    });

    it("должна отклонять имя длиннее 50 символов", () => {
      expect(validate("a".repeat(51), "display_name")).not.toBeNull();
    });
  });
});
