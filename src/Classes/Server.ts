import {
	createServer,
	Server as HttpServer,
	IncomingMessage,
	ServerResponse
} from 'node:http';

import {
	CallBackType,
	Method,
	Request,
	Response,
	BaseMiddleware,
	MethodStringType, ServerOptions
} from './';
import { Socket } from 'node:net';
import {Session} from '../Session';
import * as cookie from 'cookie';

export default class Server {

	private listener: HttpServer<typeof IncomingMessage, typeof ServerResponse> | null = null;

	private connections: Set<Socket> = new Set();

	private session: Session | null = null;

	constructor (options?: ServerOptions) {
		if (options) {
			if (options.session) this.useSession(options.session);
		}
	}

	public connect (port: number = 8080, address: string = 'localhost'): Promise<void> {
		return new Promise<void>((resolve) => {
			this.getListener().listen(port, address, resolve.bind(this));

			this.getListener().on('connection', (connection) => {
				this.connections.add(connection);
				connection.on('close', () => {
					this.connections.delete(connection);
				});
			});
		});
	}

	private getListener (): HttpServer<typeof IncomingMessage, typeof ServerResponse>  {
		if (this.listener === null) {
			this.listener = createServer();
		}
		return this.listener;
	}

	public get<T> (route: string, callback: CallBackType<T>, middlewares: Array<BaseMiddleware> = []) {
		this.request(route, Method.GET, callback, middlewares);
	}

	public post<T> (route: string, callback: CallBackType<T>, middlewares: Array<BaseMiddleware> = []) {
		this.request(route, Method.POST, callback, middlewares);
	}

	public patch<T> (route: string, callback: CallBackType<T>, middlewares: Array<BaseMiddleware> = []) {
		this.request(route, Method.PATCH, callback, middlewares);
	}

	public put<T> (route: string, callback: CallBackType<T>, middlewares: Array<BaseMiddleware> = []) {
		this.request(route, Method.PUT, callback, middlewares);
	}

	public delete<T> (route: string, callback: CallBackType<T>, middlewares: Array<BaseMiddleware> = []) {
		this.request(route, Method.DELETE, callback, middlewares);
	}

	public request<T> (route: string, method: Method | MethodStringType, callback: CallBackType<T>, middlewares: Array<BaseMiddleware> = []) {
		this.getListener().on('request', (req: IncomingMessage, res: ServerResponse) => {

			const splittedRequest = (<string>req.url).split('?');
			const path = splittedRequest[0];
			const queryParams = splittedRequest[1];

			if (path === route && req.method === method) {

				const response = new Response(res);

				new Request()
					.setHeaders(req.headers)
					.setMethod(method)
					.setBody(req).then(async (request) => {

						// Query params
						if (queryParams) {
							request.setQueryParams(queryParams);
						}

						// Session
						if (this.session) {
							if (request.headers?.cookie) {
								const parsedCookie = cookie.parse(request.headers.cookie);
								const sessionId = parsedCookie.sessionId;

								const session = await this.session.get(sessionId);
								if (session) {
									request.setSession(session);
									request.setSessionId(sessionId);
									/*
									response.setHeader('Set-Cookie', cookie.serialize('sessionId', sessionId, {
										httpOnly: true,
										maxAge: 60 * 60 * 24 * 7 // 1 week
									}));

									 */
								} else {
									this.session.createSession(request, response, this.session);
								}
							}
							else {
								this.session.createSession(request, response, this.session);
							}
						}

						new Promise<boolean>((resolve) => {
							Promise.all(middlewares.map((middleware) => {
								middleware.run(request, res);
							})).then(() => {
								resolve(true);
							});
						}).then(() => {
							const json = callback(request, response);
							if (this.session) {
								this.session.set(<string>request.sessionId, request.session);
							}
							response.send(json, 200, {'Content-Type': 'application/json'});
						}).catch((e) => {
							response.send({message: e.message}, 500, {'Content-Type': 'application/json'});
						});
					});
			}
		});
	}

	public close () {
		// Nota: close() function only close new connections, wait for all connections to be closed, and close the server
		// In case of unit tests, it can take a long time to close the server
		// So unit tests always failed :(
		return new Promise((resolve, reject) => {

			// Close all active sockets
			this.connections.forEach((connection) => {
				connection.destroy();
			});

			// Close new connections from now, and if no connections, close the server
			this.getListener().close((err) => {
				if (err) reject(err);
				else resolve(true);
			});
		});
	}

	public useSession (session: Session) {
		this.session = session;
	}
}