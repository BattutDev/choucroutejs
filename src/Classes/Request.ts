import { IncomingHttpHeaders, IncomingMessage } from 'node:http';
import { DefaultBodyType, Method } from './';

export default class Request {

	public body: DefaultBodyType | null = null;

	public headers: IncomingHttpHeaders | null = null;

	public method: Method | null = null;

	public queryParams: Map<string, string | string[] | Record<string, string>> = new Map();

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

	setQueryParams (params: string): Request {
		const splittedParams = params.split('&').map(x => decodeURIComponent(x));

		splittedParams.forEach((param) => {

			// Query params normaux : ?param1=value1&param2=value2
			// ^[^\[\]]*$ => param1 param2
			if (/^[^\[\]]*$/.test(param)) {
				const splittedParam = param.split('=');
				this.queryParams.set(splittedParam[0], splittedParam[1]);
			}

			// Query params avec un tableau : ?param1[]=value1&param1[]=value2
			// \[[0-9]?+\] => ar_dates[0] ar_dates[]
			else if (/\[[0-9]*\]/.test(param)) {
				const splittedParam = param.split('=');
				const key = splittedParam[0].split('[')[0];
				const value = splittedParam[1];

				let array: string[] = [];
				if (this.queryParams.has(key) && Array.isArray(this.queryParams.get(key)) ) {
					array = <string[]>(this.queryParams.get(key));
				}
				array.push(value);

				this.queryParams.set(key, array);
			}

			//Query params avec un objet : ?param1[key1]=value1&param1[key2]=value2
			// \[[a-zA-Z0-9]+\] => ar_dates[key1] ar_dates[key2]
			else if (/\[[a-zA-Z0-9]+\]/.test(param)) {
				const splittedParam = param.split('=');
				const key = splittedParam[0].split('[')[0];
				const value = splittedParam[1];

				const str = splittedParam[0].match(/\[([^\]]*)\]/g)?.map(match => match.slice(1, match.length - 1));

				if (str && str.length) {
					const k = str[0];

					let object: Record<string, string> = {};
					if (this.queryParams.has(key) && typeof this.queryParams.get(key) === 'object') {
						object = <Record<string, string>>(this.queryParams.get(key));
					}

					object[k] = value;

					this.queryParams.set(key, object);
				}
			}

		});
		return this;

	}

}