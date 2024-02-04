import { BaseStore } from './';

export default class Store extends BaseStore<Map<string, unknown>> {

	storage: Map<string, unknown> = new Map<string, unknown>();

	constructor () {
		super();
	}

	get (key: string): Promise<unknown> {
		return new Promise((resolve) => {
			resolve(this.storage.get(key));
		});
	}

	set (key: string, value: unknown): Promise<boolean> {
		return new Promise((resolve) => {
			this.storage.set(key, value);
			resolve(true);
		});
	}

	destroy (sessionId: string): Promise<boolean> {
		return new Promise((resolve) => {
			resolve(this.storage.delete(sessionId));
		});
	}

}
