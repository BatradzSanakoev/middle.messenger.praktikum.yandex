import { Button } from "@/shared";

export class App {
  init() {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "1rem";
    container.style.alignItems = "center";

    document.body.appendChild(container);

    new Button(container, { text: "Войти", variant: "primary" });
    new Button(container, { text: "Нет аккаунта?", variant: "secondary" });
  }
}
