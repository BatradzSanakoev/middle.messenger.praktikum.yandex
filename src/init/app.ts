import styles from "./app.module.css";
import {
  LoginPage,
  RegisterPage,
  ChatPage,
  ProfilePage,
  Error404Page,
  Error500Page,
} from "../pages";

type PageComponent = new () => { render: (container: HTMLElement) => void };

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

  private renderPage(hash: string) {
    const Component = pageComponents[hash];
    if (Component && this.pageContainer) {
      const page = document.createElement("main");
      page.className = styles.pageContainer;
      new Component().render(page);
      this.pageContainer.replaceWith(page);
      this.pageContainer = page;
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
