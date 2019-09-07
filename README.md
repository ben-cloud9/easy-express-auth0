# easy-express-auth0

## Installation
```
npm install easy-express-auth0
```

## Required Environment Variables
```
AUTH0_CLIENT_ID=YOUR_CLIENT_ID
AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
AUTH0_CLIENT_SECRET=YOUR_CLIENT_SECRET
AUTH0_CALLBACK_URL=YOUR_CALLBACK_URL (your domain + /callback)

```
## Example Server
```
const express = require('express');
const session = require('express-session');
const authentication = require('easy-express-auth0');

const app = express();

// You will need some sort of session provider for this to work
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// call authentiction set up after session set up
const unsecuredRoutes = ['/api/ping', '/', '/manifest.json', '/denied', '/static/**', 'favicon.ico', '/img/**'];
authentication(app, unsecuredRoutes);

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.get('/home', (req, res) => {
    res.send(`home - ${req.user.username}`);
});

app.get('*', (req, res) => {
    res.send('any');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
```