import http from 'http';

export enum Method {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	PATCH = 'PATCH'
}

export type CallBackType<T> = (req: http.IncomingMessage, res: http.ServerResponse) => T;