/**
 * Created by David on 04 May 2017.
 */
angular.module('meanseed')

    .service('AuthService', function($q, $http, API_ENDPOINT) {
        var LOCAL_TOKEN_KEY = 'yourTokenKey';
        var isAuthenticated = false;
        var authToken;
        var userName;

        function loadUserCredentials() {
            var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
            if (token) {
                useCredentials(token);
            }
        }

        function storeUserCredentials(token) {
            window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
            useCredentials(token);
        }

        function useCredentials(token) {
            isAuthenticated = true;
            authToken = token;
            var encodedProfile = authToken.split('.')[1];
            console.log(":::" + encodedProfile);
            var profile = JSON.parse(url_base64_decode(encodedProfile));
            console.log(profile);
            userName = profile.sub;
            console.log(userName);
            // Set the token as header for your requests!
            $http.defaults.headers.common.Authorization = authToken;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            isAuthenticated = false;
            userName = undefined;
            $http.defaults.headers.common.Authorization = undefined;
            window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        }

        function url_base64_decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
        }

        var register = function(user) {
            return $q(function(resolve, reject) {
                $http.post(API_ENDPOINT.url + '/user/signup', user).then(function(result) {
                    if (result.data.success) {
                        resolve(result.data.msg);
                    } else {
                        reject(result.data.msg);
                    }
                }, function (err) {
                    reject(err.data.msg);
                });
            });
        };

        var login = function(user) {
            return $q(function(resolve, reject) {
                $http.post(API_ENDPOINT.url + '/user/authenticate', user).then(function(result) {
                    if (result.data.token) {
                        storeUserCredentials(result.data.token);
                        resolve(result.data.user);
                    } else {
                        reject(result.data.msg);
                    }
                }, function (err) {
                    reject(err.data.msg);
                });
            });
        };

        var logout = function() {
            destroyUserCredentials();
        };

        loadUserCredentials();

        return {
            login: login,
            register: register,
            logout: logout,
            isAuthenticated: function() {return isAuthenticated;},
            userName: function () {return userName;}
        };
    })

    .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                }[response.status], response);
                return $q.reject(response);
            }
        };
    })

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });