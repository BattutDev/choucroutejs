import http from 'http';
import {Request} from './';

export default abstract class BaseMiddleware {
	abstract run(req: Request, res: http.ServerResponse, next: () => void): void;
}