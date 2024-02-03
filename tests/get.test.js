const {expect, test, beforeAll, afterAll, describe} = require('@jest/globals');
const { HelloMiddleware } = require('./middlewares');
const { fetchData } = require('./functions');
const App = require('./server');

describe('GET', () => {

	beforeAll(() => {
		App.getInstance().getServer();
		return App.getInstance().getServer().connect(3000);
	});

	afterAll(() => {
		return App.getInstance().closeServer();
	});

	const app = App.getInstance().getServer();

	app.get('/', () => {
		return {
			message: 'ok'
		};
	});
	test('GET /',  async () => {
		const data = await fetchData('http://localhost:3000/');
		return expect(JSON.stringify(data)).toBe(JSON.stringify({message: 'ok'}));
	});

	app.get('/hello', (req) => {
		return {
			hello: req.hello
		};
	}, [HelloMiddleware]);
	test('GET /hello - Middleware',  async () => {
		const data = await fetchData('http://localhost:3000/hello');
		return expect(JSON.stringify(data)).toBe(JSON.stringify({hello: 'world'}));
	});

	app.get('/list', (req) => {
		return {
			page: req.queryParams.get('page'),
		};
	});
	test('GET /list - Basic query param',  async () => {
		const data = await fetchData('http://localhost:3000/list?page=1');
		return expect(JSON.stringify(data)).toBe(JSON.stringify({page: '1'}));
	});
});
