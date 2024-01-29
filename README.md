# choucroutejs
Framework javascript pour créer un web service

## Utilisation

```js
const {Server} = require('choucroutejs');

const server = new Server(3000, 'localhost');

server.get('/', (req, res) => {
    return {message: 'Hello world'};
});
