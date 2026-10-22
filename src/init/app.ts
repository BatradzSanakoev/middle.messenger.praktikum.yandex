import { Block } from "@shared/ui/block";
import {
  ChatPage,
  Error404Page,
  Error500Page,
  LoginPage,
  ProfilePage,
  RegisterPage,
} from "../pages";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import { Link } from "@shared/ui/link";
import { ChatList } from "@shared/ui/chat-list";
import { ProfileAvatar } from "@shared/ui/profile-avatar";
import { Modal } from "@shared/ui/modal";
import { registerComponent } from "@shared/ui/block";
import styles from "./app.module.css";

// Регистрация компонентов в Handlebars
registerComponent("Input", Input);
registerComponent("Button", Button);
registerComponent("Link", Link);
registerComponent("ChatList", ChatList);
registerComponent("ProfileAvatar", ProfileAvatar);
registerComponent("Modal", Modal);

type PageComponent = new () => Block<any>;

const pageComponents: Record<string, PageComponent> = {
  login: LoginPage,
  register: RegisterPage,
  chat: ChatPage,
  profile: ProfilePage,
  "404": Error404Page,
  "500": Error500Page,
};

const navItems = [
  { hash: "login", label: "Авторизация" },
  { hash: "register", label: "Регистрация" },
  { hash: "chat", label: "Чаты" },
  { hash: "profile", label: "Профиль" },
  { hash: "404", label: "404" },
  { hash: "500", label: "500" },
];

export class App {
  private pageContainer: HTMLElement | null = null;
  private currentPage: Block<any> | null = null;

  private renderPage(hash: string) {
    // Размонтируем предыдущую страницу
    if (this.currentPage) {
      this.currentPage.destroy();
    }

    const Component = pageComponents[hash];
    if (Component && this.pageContainer) {
      this.currentPage = new Component();
      const element = this.currentPage.element();
      if (element) {
        this.pageContainer.replaceChildren(element);
      }
    }
  }

  init() {
    const app = document.createElement("div");
    app.className = styles.app;

    // Навигация
    const nav = document.createElement("nav");
    nav.className = styles.nav;
    const list = document.createElement("ul");
    list.className = styles.navList;

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

    // Контейнер страницы
    const main = document.createElement("main");
    main.className = styles.pageContainer;
    this.pageContainer = main;
    app.appendChild(main);

    // Навигация
    list.addEventListener("click", (e) => {
      const a = (e.target as HTMLElement).closest("a");
      if (a) {
        e.preventDefault();
        window.location.hash = a.getAttribute("href")?.slice(1) || "profile";
      }
    });

    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.slice(1) || "profile";
      this.renderPage(hash);
    });

    document.body.appendChild(app);
    this.renderPage(window.location.hash.slice(1) || "profile");
  }
}
