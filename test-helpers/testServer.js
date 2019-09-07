require('dotenv').config();
const express = require('express');
const session = require('express-session');
const authentication = require('../src/index');

const app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use((req, res, next) => {
    next();
});

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
