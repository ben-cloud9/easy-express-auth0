const MockExpressRequest = require('mock-express-request');
const MockExpressResponse = require('mock-express-response');
const middleware = require('./middleware');

const baseMockRequest = new MockExpressRequest();
const baseMockResponse = new MockExpressResponse();

it('should throw error if res.locals.unsecuredRoutes not found', async () => {
    const mockNextFunction = jest.fn();
    expect.assertions(1);
    try {
        await middleware(baseMockRequest, baseMockResponse, mockNextFunction);
    } catch (err) {
        expect(err.message).toBe('Please add an unsecureRoutes property to res.locals');
    }
});

it('should call next function if no user in session and request route is in unsecuredRoutes', async () => {
    const unsecuredRoutes = ['/test'];
    const mockResponse = {
        ...baseMockResponse,
        locals: {
            unsecuredRoutes
        },
        redirect: jest.fn()
    }

    const mockRequest = {
        ...baseMockRequest,
        path: '/test'
    }

    const mockNextFunction = jest.fn();
    await middleware(mockRequest, mockResponse, mockNextFunction);
    expect(mockNextFunction).toHaveBeenCalled();
});

it('should call next function if no user in session and request route matches part of unsecuredRoutes', async () => {
    const unsecuredRoutes = ['/static/**'];
    const mockResponse = {
        ...baseMockResponse,
        locals: {
            unsecuredRoutes
        },
        redirect: jest.fn()
    }

    const mockRequest = {
        ...baseMockRequest,
        path: '/static/main.js'
    }

    const mockNextFunction = jest.fn();
    await middleware(mockRequest, mockResponse, mockNextFunction);
    expect(mockNextFunction).toHaveBeenCalled();
});

it('should redirect to /login if no user and request route is not an unsecure route', async () => {
    const unsecuredRoutes = [];
    const mockRedirectFunction = jest.fn();
    const mockResponse = {
        ...baseMockResponse,
        locals: {
            unsecuredRoutes
        },
        redirect: mockRedirectFunction
    }

    const mockRequest = {
        ...baseMockRequest,
        path: '/home'
    }

    const mockNextFunction = jest.fn();
    
    await middleware(mockRequest, mockResponse, mockNextFunction);
    expect(mockRedirectFunction).toHaveBeenCalledWith('/login');
});

it('should call next function if user is in session and route is not an unsecure route', async () => {
    const unsecuredRoutes = [];
    const mockResponse = {
        ...baseMockResponse,
        locals: {
            unsecuredRoutes
        },
        redirect: jest.fn()
    }

    const mockRequest = {
        ...baseMockRequest,
        path: '/home',
        user: {
            emails: ['bob@test.com'],
            displayName: 'bob@test.com'
        }
    }

    const mockNextFunction = jest.fn();
    await middleware(mockRequest, mockResponse, mockNextFunction);
    expect(mockRequest.user.username).toBe('bob@test.com');
    expect(mockNextFunction).toHaveBeenCalled();
});
