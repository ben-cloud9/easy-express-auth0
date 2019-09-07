const passportSetUp = require('./passportSetUp');
const middleware = require('./middleware');
const AuthRouter = require('./AuthRouter');

module.exports = (app, additionalUnsecuredRoutes) => {
    const defaultUnsecuredRoutes = ['/login', '/logout', '/callback', '/access-denied']
    passportSetUp(app);
    app.use((_req, res, next) => {
        res.locals.unsecuredRoutes = [...additionalUnsecuredRoutes, ...defaultUnsecuredRoutes];
        next();
    });
    const authRouter = new AuthRouter();
    app.use('/', authRouter.getRouter());
    app.use(middleware);
};
