import http from 'http';
import {Request} from './';

export enum Method {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	PATCH = 'PATCH'
}

export type CallBackType<T> = (req: Request, res: http.ServerResponse) => T;

export type DefaultBodyType = NonNullable<unknown>;