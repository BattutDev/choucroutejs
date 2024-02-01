const {BaseMiddleware} = require('../lib');

class HelloMiddleware extends BaseMiddleware {
	static run (req) {
		req.hello = 'world';
	}
}

module.exports = {HelloMiddleware};
