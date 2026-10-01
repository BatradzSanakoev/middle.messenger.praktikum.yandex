import styles from "./app.module.css";
import { ProfilePage } from "../pages";

export class App {
  init() {
    const appContainer = document.createElement("main");
    appContainer.className = styles.app;

    const profilePage = new ProfilePage();
    profilePage.render(appContainer);

    document.body.appendChild(appContainer);
  }
}
