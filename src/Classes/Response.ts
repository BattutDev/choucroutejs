import { OutgoingHttpHeaders, ServerResponse } from 'node:http';
export default class Response {

	private readonly rawResponse: ServerResponse;

	constructor (res: ServerResponse) {
		this.rawResponse = res;
	}

	public send<Body> (body: Body, statusCode: number, headers: OutgoingHttpHeaders) {
		this.rawResponse.writeHead(statusCode, headers);
		this.rawResponse.write(JSON.stringify(body));
		return this.rawResponse.end();
	}

	public setHeader (key: string, value: string) {
		this.rawResponse.setHeader(key, value);
	}
}