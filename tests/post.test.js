const { HelloMiddleware } = require('./middlewares');
const { fetchData } = require('./functions');
const App = require('./server');

const app = App.getInstance().getServer();

app.post('/', () => {
	return {
		message: 'ok'
	};
});
test('POST /',  async () => {
	const data = await fetchData('http://localhost:3000/', 'POST');
	expect(JSON.stringify(data)).toBe(JSON.stringify({message: 'ok'}));
});

app.post('/hello', (req) => {
	return {
		hello: req.hello
	};
}, [HelloMiddleware]);
test('POST /hello - Middleware',  async () => {
	const data = await fetchData('http://localhost:3000/hello', 'POST');
	expect(JSON.stringify(data)).toBe(JSON.stringify({hello: 'world'}));
});

afterAll(() => {
	return app.close();
});