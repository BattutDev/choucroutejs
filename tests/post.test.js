const {Server , BaseMiddleware} = require('../lib/');

const app = new Server();

app.connect(3000);

app.post('/', () => {
	return {
		message: 'ok'
	};
});

class HelloMiddleware extends BaseMiddleware {
	static run (req) {
		req.hello = 'world';
	}
}

app.post('/hello', (req) => {
	return {
		hello: req.hello
	};
}, [HelloMiddleware]);

test('POST /',  async () => {
	const data = await fetchData('http://localhost:3000/', 'POST');
	expect(JSON.stringify(data)).toBe(JSON.stringify({message: 'ok'}));
});

test('POST /hello - Middleware',  async () => {
	const data = await fetchData('http://localhost:3000/hello', 'POST');
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




