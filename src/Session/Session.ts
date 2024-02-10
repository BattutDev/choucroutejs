import {BaseStore, SessionOptions, Store} from './';
import {Request, Response} from '../Classes';
import {v4 as uuidv4} from 'uuid';
import * as cookie from 'cookie';

export default class Session {

	private store: BaseStore<unknown> = new Store();

	constructor (options?: SessionOptions) {
		if (options && options.store) {
			this.store = options?.store;
		}
	}

	get (sessionId: string): Promise<unknown> {
		return this.store.get(sessionId);
	}

	set (sessionId: string, session: unknown): Promise<unknown> {
		return this.store.set(sessionId, session);
	}

	createSession (request: Request, response: Response, instance: Session): Promise<string> {
		const sessionId = uuidv4();

		response.setHeader('Set-Cookie', cookie.serialize('sessionId', sessionId, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7 // 1 week
		}));

		request.setSessionId(sessionId);
		request.setSession({});
		instance.set(sessionId, {});

		return Promise.resolve(sessionId);
	}



}