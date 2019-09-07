module.exports = async (req, res, next) => {
    if (!res.locals || !res.locals.unsecuredRoutes) {
        throw new Error('Please add an unsecureRoutes property to res.locals');
    }

    try {
        if (!isRouteMatch(res.locals.unsecuredRoutes, req.path)) {
            if (req.user) {
                req.user.username = req.user.emails[0].value || req.user.displayName;
                return next();
            }

            if (!!req.session) {
                req.session.returnTo = req.originalUrl;
            }

            return res.redirect('/login');
        }
        next();
    } catch (err) {
        console.log('authentication middleware error!');
        console.log(err.message);
        res.redirect('/access-denied');
    }
}

const isRouteMatch = (unsecuredRoutes, currentRoute) => {
    if (unsecuredRoutes.includes(currentRoute)) {
        return true;
    }

    let isMatch = false;
    unsecuredRoutes.forEach((unsecureRoute) => {
        if (unsecureRoute.includes('/**')) {
            const routePartToMatch = unsecureRoute.replace('/**', '');
            if (currentRoute.includes(routePartToMatch)) {
                isMatch = true;
            }
        }
    })

    return isMatch;
}
