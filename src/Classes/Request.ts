import {IncomingHttpHeaders, IncomingMessage} from 'node:http';
import {DefaultBodyType, Method} from './';

export default class Request {

	public body: DefaultBodyType | null = null;

	public headers: IncomingHttpHeaders | null = null;

	public method: Method | null = null;

	constructor () {}

	setBody (r: IncomingMessage): Promise<Request> {
		return new Promise((resolve) => {
			let body = '';
			r.on('data', (chunk) => {
				body += chunk;
			});
			r.on('end', () => {
				if (body.length) {
					this.body = JSON.parse(body);
				}
				resolve(this);
			});
		});

	}

	setHeaders (headers: IncomingHttpHeaders): Request {
		this.headers = JSON.parse(JSON.stringify(headers));
		return this;
	}

	setMethod (method: Method): Request {
		this.method = method;
		return this;
	}

}