import { registerComponent } from "@shared/ui/block";
import { Button, ChatList, Input, Link, Modal, ProfileAvatar } from "@shared/ui";
import { Router } from "@features/router";
import { AuthController } from "@features";

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

// Приложение: создаёт DOM и подключает роутер
export class App {
  init() {
    // Создаём корневой div
    const app = document.createElement("div");
    app.className = styles.app;

    // Создаём контейнер для страниц
    const main = document.createElement("main");
    main.className = styles.pageContainer;
    app.appendChild(main);

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

    // Проверяем авторизацию — загружаем данные пользователя при старте
    AuthController.checkAuth();
  }
}
