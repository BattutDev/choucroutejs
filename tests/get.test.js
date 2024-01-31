const {Server } = require('../lib/');
const {BaseMiddleware} = require('../lib');

const app = new Server();

app.connect(3000);

app.get('/', () => {
	return {
		message: 'ok'
	};
});

class HelloMiddleware extends BaseMiddleware {
	static run (req) {
		req.hello = 'world';
	}
}

app.get('/hello', (req) => {
	return {
		hello: req.hello
	};
}, [HelloMiddleware]);

test('GET /',  async () => {
	const data = await fetchData('http://localhost:3000/');
	expect(JSON.stringify(data)).toBe(JSON.stringify({message: 'ok'}));
});

test('GET /hello - Middleware',  async () => {
	const data = await fetchData('http://localhost:3000/hello');
	expect(JSON.stringify(data)).toBe(JSON.stringify({hello: 'world'}));
});

afterAll(() => {
	return app.close();
});

function fetchData (url, method = 'GET', body = null) {
	return new Promise((resolve, reject) => {
		fetch(url, {
			method,
			body: body ? JSON.stringify(body) : null,
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => {
			res.json().then((json) => {
				resolve(json);
			});
		}).catch((err) => {
			reject(err);

		});
	});
}




