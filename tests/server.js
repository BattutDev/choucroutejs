const { Server } = require('../lib/');

class App {
	static instance = null;

	server = null;

	constructor () {
		this.server = new Server();
	}

	static getInstance () {

		if (!App.instance) {
			App.instance = new App();
		}

		return App.instance;

	}

	getServer () {

		return this.server;

	}

	closeServer () {
		this.server.close();
		App.instance = null;
	}

}

module.exports = App;