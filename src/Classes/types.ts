import {Request, Response} from './';

export enum Method {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	PATCH = 'PATCH'
}

export type MethodStringType = Method.GET
	| Method.POST
	| Method.PUT
	| Method.DELETE
	| Method.PATCH;

export type CallBackType<T> = (req: Request, res: Response) => T;

export type DefaultBodyType = NonNullable<unknown>;