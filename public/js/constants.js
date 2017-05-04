/**
 * Created by David on 04 May 2017.
 */
angular.module('meanseed')

    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

    .constant('API_ENDPOINT', {
        url: ''
        //  For a simulator use: url: 'http://127.0.0.1:8080/api'
    });