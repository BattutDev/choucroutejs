import http, {createServer} from 'http';
import {CallBackType, Method, Request, BaseMiddleware, MethodStringType} from './';

export default class Server {

	private listener: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | null = null;

	constructor () {}

	public connect (port: number = 8080, address: string = 'localhost'): Promise<void> {
		return new Promise<void>((resolve) => {
			this.getListener().listen(port, address, resolve.bind(this));
		});
	}

	private getListener (): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>  {
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
		this.getListener().on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
			if (req.url === route && req.method === method) {

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
							const response = callback(request, res);
							res.writeHead(200, {'Content-Type': 'application/json'});
							res.end(JSON.stringify(response));
						}).catch((e) => {
							res.writeHead(400, {'Content-Type': 'application/json'});
							res.end(JSON.stringify({message: e.message}));
						});
					});
			}
		});
	}
}