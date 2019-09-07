const isValidRedirectUrl = require('./isValidRedirectUrl');

it('should return false if url contains /api/', () => {
    const url = '/api/route';
    const res = isValidRedirectUrl(url);
    expect(res).toBe(false);
});

it('should return false if url contains .', () => {
    const url = '/favicon.ico';
    const res = isValidRedirectUrl(url);
    expect(res).toBe(false);
});

it('should return false if url is falsy', () => {
    const url = '';
    const res = isValidRedirectUrl(url);
    expect(res).toBe(false);
});

it('should return true for other urls', () => {
    const url = '/home';
    const res = isValidRedirectUrl(url);
    expect(res).toBe(true);
});