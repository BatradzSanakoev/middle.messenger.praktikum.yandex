import { Block, registerComponent } from "@shared/ui/block";
import { Button, ChatList, Input, Link, Modal, ProfileAvatar } from "@shared/ui";

import {
  ChatPage,
  Error404Page,
  Error500Page,
  LoginPage,
  ProfilePage,
  RegisterPage,
} from "../pages";
import styles from "./app.module.css";

import type { BlockOwnProps } from "@shared/ui/block";

// Регистрируем все UI-компоненты как Handlebars-хелперы
registerComponent("Input", Input);
registerComponent("Button", Button);
registerComponent("Link", Link);
registerComponent("ChatList", ChatList);
registerComponent("ProfileAvatar", ProfileAvatar);
registerComponent("Modal", Modal);

// Тип для компонент-страниц (без пропсов)
type PageComponent = new () => Block<BlockOwnProps>;

// Маппинг hash-роутов на компоненты страниц
const pageComponents: Record<string, PageComponent> = {
  login: LoginPage,
  register: RegisterPage,
  chat: ChatPage,
  profile: ProfilePage,
  "404": Error404Page,
  "500": Error500Page,
};

// Список элементов навигации
const navItems = [
  { hash: "login", label: "Авторизация" },
  { hash: "register", label: "Регистрация" },
  { hash: "chat", label: "Чаты" },
  { hash: "profile", label: "Профиль" },
  { hash: "404", label: "404" },
  { hash: "500", label: "500" },
];

// Приложение: создаёт DOM, навигацию и управляет роутингом
export class App {
  // Контейнер для рендера страниц
  private pageContainer: HTMLElement | null = null;
  // Текущий активный компонент страницы
  private currentPage: Block<BlockOwnProps> | null = null;

  // Рендерит страницу по hash: уничтожает старую, создаёт новую
  private renderPage(hash: string) {
    // Уничтожаем текущую страницу
    if (this.currentPage) {
      this.currentPage.destroy();
    }

    // Получаем компонент по hash и рендерим
    const Component = pageComponents[hash];
    if (Component && this.pageContainer) {
      this.currentPage = new Component();
      const element = this.currentPage.element();
      if (element) {
        this.pageContainer.replaceChildren(element);
      }
    }
  }

  // Инициализация приложения: создаёт DOM, навигацию, вешает слушатели
  init() {
    // Создаём корневой div
    const app = document.createElement("div");
    app.className = styles.app;

    // Создаём навигацию
    const nav = document.createElement("nav");
    nav.className = styles.nav;
    const list = document.createElement("ul");
    list.className = styles.navList;

    // Генерируем пункты навигации из navItems
    navItems.forEach(({ hash, label }) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${hash}`;
      a.textContent = label;
      li.appendChild(a);
      list.appendChild(li);
    });

    nav.appendChild(list);
    app.appendChild(nav);

    // Создаём контейнер для страниц
    const main = document.createElement("main");
    main.className = styles.pageContainer;
    this.pageContainer = main;
    app.appendChild(main);

    // Обработчик кликов по навигации — меняет hash
    list.addEventListener("click", (e) => {
      const a = (e.target as HTMLElement).closest("a");
      if (a) {
        e.preventDefault();
        window.location.hash = a.getAttribute("href")?.slice(1) || "profile";
      }
    });

    // Обработчик изменения hash — рендерит нужную страницу
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.slice(1) || "profile";
      this.renderPage(hash);
    });

    // Добавляем app в DOM и рендерим начальную страницу
    document.body.appendChild(app);
    this.renderPage(window.location.hash.slice(1) || "profile");
  }
}
