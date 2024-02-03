const {expect, test, beforeAll, afterAll, describe} = require('@jest/globals');
const { HelloMiddleware } = require('./middlewares');
const { fetchData } = require('./functions');
const App = require('./server');

describe('POST', () => {

	beforeAll(() => {
		App.getInstance().getServer();
		return App.getInstance().getServer().connect(3000);
	});

	afterAll(() => {
		return App.getInstance().closeServer();
	});

	const app = App.getInstance().getServer();

	app.post('/', () => {
		return {
			message: 'ok'
		};
	});
	test('POST /', async () => {
		const data = await fetchData('http://localhost:3000/', 'POST');
		return expect(JSON.stringify(data)).toBe(JSON.stringify({message: 'ok'}));
	});

	app.post('/hello', (req) => {
		return {
			hello: req.hello
		};
	}, [HelloMiddleware]);
	test('POST /hello - Middleware', async () => {
		const data = await fetchData('http://localhost:3000/hello', 'POST');
		return expect(JSON.stringify(data)).toBe(JSON.stringify({hello: 'world'}));
	});


});