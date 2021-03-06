const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

module.exports = (app) => {
    var strategy = new Auth0Strategy(
        {
            domain: process.env.AUTH0_DOMAIN,
            clientID: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
        },
        (accessToken, _refreshToken, _extraParams, profile, done) => {
            // accessToken is the token to call Auth0 API (not needed in the most cases)
            // extraParams.id_token has the JSON Web Token
            // profile has all the information from the user
            return done(null, profile, { accessToken });
        }
    );

    passport.use(strategy);

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    app.use(passport.initialize());
    app.use(passport.session());
};
