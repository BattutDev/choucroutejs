import http, {createServer} from 'http';
import {CallBackType, Method} from './';

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

	public get<T> (route: string, callback: CallBackType<T>) {
		this.request(route, Method.GET, callback);
	}

	public post<T> (route: string, callback: CallBackType<T>) {
		this.request(route, Method.POST, callback);
	}

	public patch<T> (route: string, callback: CallBackType<T>) {
		this.request(route, Method.PATCH, callback);
	}

	public put<T> (route: string, callback: CallBackType<T>) {
		this.request(route, Method.PUT, callback);
	}

	public delete<T> (route: string, callback: CallBackType<T>) {
		this.request(route, Method.DELETE, callback);
	}

	public request<T> (route: string, method: Method, callback: CallBackType<T>) {
		this.getListener().on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
			if (req.url === route && req.method === method) {
				const response = callback(req, res);
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(response));
			}
		});
	}
}