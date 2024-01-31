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
	MethodStringType
} from './';

export default class Server {

	private listener: HttpServer<typeof IncomingMessage, typeof ServerResponse> | null = null;

	constructor () {}

	public connect (port: number = 8080, address: string = 'localhost'): Promise<void> {
		return new Promise<void>((resolve) => {
			this.getListener().listen(port, address, resolve.bind(this));
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
			if (req.url === route && req.method === method) {

				const response = new Response(res);

				new Request()
					.setHeaders(req.headers)
					.setMethod(method)
					.setBody(req).then((request) => {

						new Promise<boolean>((resolve) => {
							Promise.all(middlewares.map((middleware) => {
								middleware.run(request, res);
							})).then(() => {
								resolve(true);
							});
						}).then(() => {
							const json = callback(request, response);
							response.send(json, 200, {'Content-Type': 'application/json'});
						}).catch((e) => {
							response.send({message: e.message}, 400, {'Content-Type': 'application/json'});
						});
					});
			}
		});
	}

	public close () {
		return new Promise((resolve, reject) => {
			this.getListener().close((err) => {
				if (err) reject(err);
				else resolve(true);
			});
		});
	}
}