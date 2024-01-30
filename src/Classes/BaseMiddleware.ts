import {ServerResponse} from 'node:http';
import {Request} from './';

export default abstract class BaseMiddleware {
	abstract run(req: Request, res: ServerResponse): void;
}