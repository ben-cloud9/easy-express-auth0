const isValidRedirectUrl = (returnTo) => {
    if (!returnTo) {
        return false;
    }
    
    if (returnTo.includes('/api/')) {
        return false;
    }

    if (returnTo.includes('.')) {
        return false;
    }

    return true;
}

module.exports = isValidRedirectUrl;
