# choucroutejs
Framework javascript pour créer un web service

## Utilisation

```js
const {Server} = require('choucroutejs');

const server = new Server(3000, 'localhost');

server.get('/', (req, res) => {
    return {message: 'Hello world'};
});

```

### Middlewares

```js
class Middleware extends BaseMiddleware {
    static run (req, res) {
        // Votre code
    }
}

server.get('/', (req, res) => {
	return {message: 'Hello world'};
}, [Middleware]);
```


