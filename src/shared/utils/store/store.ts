import { set } from "..";

// Тип функции-обработчика изменений
type Listener = () => void;

class Store {
	private state: Record<string, unknown> = {}; // Единое хранилище состояния
	private listeners = new Set<Listener>(); // Подписчики на обновления

	// Получить текущее состояние
	getState(): Record<string, unknown> {
		return this.state;
	}

	// Установить значение по пути, уведомить подписчиков
	setState(path: string, value: unknown): void {
		this.state = set(this.state, path, value);
		this.emit();
	}

	// Подписаться на изменения, вернуть функцию отписки
	subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	// Уведомить всех подписчиков
	private emit(): void {
		this.listeners.forEach((listener) => listener());
	}
}

// Singleton — один экземпляр Store на всё приложение
export default new Store();
