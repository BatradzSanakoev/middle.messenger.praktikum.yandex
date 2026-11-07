import { registerComponent } from "@shared/ui/block";
import { Button, ChatList, Input, Link, Modal, ProfileAvatar } from "@shared/ui";
import { Router } from "@features/router";

import {
  ChatPage,
  Error404Page,
  Error500Page,
  LoginPage,
  ProfilePage,
  RegisterPage,
} from "../pages";
import styles from "./app.module.css";

// Регистрируем все UI-компоненты как Handlebars-хелперы
registerComponent("Input", Input);
registerComponent("Button", Button);
registerComponent("Link", Link);
registerComponent("ChatList", ChatList);
registerComponent("ProfileAvatar", ProfileAvatar);
registerComponent("Modal", Modal);

// Приложение: создаёт DOM, навигацию и подключает роутер
export class App {
  init() {
    // Создаём корневой div
    const app = document.createElement("div");
    app.className = styles.app;

    // Создаём навигацию
    const nav = document.createElement("nav");
    nav.className = styles.nav;
    const list = document.createElement("ul");
    list.className = styles.navList;

    // Генерируем пункты навигации с реальными путями
    const navItems = [
      { path: "/", label: "Авторизация" },
      { path: "/sign-up", label: "Регистрация" },
      { path: "/messenger", label: "Чаты" },
      { path: "/settings", label: "Профиль" },
      { path: "/404", label: "404" },
      { path: "/500", label: "500" },
    ];

    navItems.forEach(({ path, label }) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = path;
      a.textContent = label;
      li.appendChild(a);
      list.appendChild(li);
    });

    nav.appendChild(list);
    app.appendChild(nav);

    // Создаём контейнер для страниц
    const main = document.createElement("main");
    main.className = styles.pageContainer;
    app.appendChild(main);

    // Обработчик кликов по навигации — использует router.go()
    list.addEventListener("click", (e) => {
      const a = (e.target as HTMLElement).closest("a");
      if (a) {
        e.preventDefault();
        const path = a.getAttribute("href");
        if (path) {
          Router.getInstance().go(path);
        }
      }
    });

    // Добавляем app в DOM
    document.body.appendChild(app);

    // Подключаем роутер — все маршруты
    const router = Router.getInstance();
    router
      .use("/", LoginPage)
      .use("/sign-up", RegisterPage)
      .use("/messenger", ChatPage)
      .use("/settings", ProfilePage)
      .use("/404", Error404Page)
      .use("/500", Error500Page);

    // Запускаем роутер с контейнером main
    router.start(main);
  }
}
