import styles from "./app.module.css";
import {
  ChatPage,
  Error404Page,
  Error500Page,
  LoginPage,
  ProfilePage,
  RegisterPage,
} from "../pages";

export class App {
  init() {
    const appContainer = document.createElement("main");
    appContainer.className = styles.app;

    // const loginPage = new LoginPage();
    // loginPage.render(appContainer);

    // const registerPage = new RegisterPage();
    // registerPage.render(appContainer);

    // const chatsPage = new ChatPage();
    // chatsPage.render(appContainer);

    const profilePage = new ProfilePage();
    profilePage.render(appContainer);

    // const error404Page = new Error404Page();
    // error404Page.render(appContainer);

    // const error500Page = new Error500Page();
    // error500Page.render(appContainer);

    document.body.appendChild(appContainer);
  }
}
