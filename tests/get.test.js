const { HelloMiddleware } = require('./middlewares');
const { fetchData } = require('./functions');
const App = require('./server');

const app = App.getInstance().getServer();

app.get('/', () => {
	return {
		message: 'ok'
	};
});
test('GET /',  async () => {
	const data = await fetchData('http://localhost:3000/');
	expect(JSON.stringify(data)).toBe(JSON.stringify({message: 'ok'}));
});

app.get('/hello', (req) => {
	return {
		hello: req.hello
	};
}, [HelloMiddleware]);
test('GET /hello - Middleware',  async () => {
	const data = await fetchData('http://localhost:3000/hello');
	expect(JSON.stringify(data)).toBe(JSON.stringify({hello: 'world'}));
});

app.get('/list', (req) => {
	return {
		page: req.queryParams.get('page'),
	};
});
test('GET /list - Basic query param',  async () => {
	const data = await fetchData('http://localhost:3000/list?page=1');
	expect(JSON.stringify(data)).toBe(JSON.stringify({page: '1'}));
});