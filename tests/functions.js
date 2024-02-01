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

module.exports = {
	fetchData
};