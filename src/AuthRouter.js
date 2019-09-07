const express = require('express');
const passport = require('passport');
const isValidRedirectUrl = require('./isValidRedirectUrl');

class AuthRouter {
    constructor() {
        this.authRouter = express.Router();

        // Perform the login, after login Auth0 will redirect to callback
        this.authRouter.get('/login', passport.authenticate('auth0', {
            scope: 'openid email profile'
        }), function (req, res) {
            res.redirect('/');
        });

        // Perform the final stage of authentication and redirect to previously requested URL or '/user'
        this.authRouter.get('/callback', (req, res, next) => {
            passport.authenticate('auth0', (err, user, info) => {
                if (err) { return next(err); }
                if (!user) { return res.redirect('/login'); }
                req.logIn(user, (err) => {
                    if (err) { return next(err); }
                    let returnTo;
                    if (!!req.session) {
                        req.session.userAuthToken = info.accessToken;
                        returnTo = req.session.returnTo;
                        delete req.session.returnTo;
                    }
                    const redirectUrl = isValidRedirectUrl(returnTo) ? returnTo : '/home';
                    res.redirect(redirectUrl); // any callback request will be redirected to home for now
                });
            })(req, res, next);
        });

        // Perform session logout and redirect to homepage
        this.authRouter.get('/logout', (req, res) => {
            req.logout();
            if (req.session) {
                req.session.destroy(() => {});
            }
            delete req.session;
            res.redirect(`https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=http%3A%2F%2F${req.hostname}`);
        });
    }

    getRouter() {
        return this.authRouter;
    }
}

module.exports = AuthRouter;
