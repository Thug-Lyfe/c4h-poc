/**
 * Created by marco on 03-05-2017.
 */
// script.js

    // create the module and name it scotchApp
angular.module('meanseed', ['ngRoute'])

// create the controller and inject Angular's $scope
    .config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl : 'pages/headers/home.html',
            controller  : 'AppCtrl'
        })

        // route for the about page
        .when('/about', {
            templateUrl : 'pages/headers/about.html',
            controller  : 'aboutController'
        })

        // route for profile page
        .when('/profile/:userName', {
            templateUrl : 'pages/headers/profile.html',
            controller  : 'profileController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl : 'pages/headers/contact.html',
            controller  : 'contactController'
        })

        //route for the login page
        .when('/login', {
            templateUrl : 'pages/login/loginView.html',
            controller  : 'loginViewController'
        })
        .when('/signup', {
            templateUrl : 'pages/login/registerView.html',
            controller  : 'registerViewController'
        });

    })
    .run(function ($rootScope, $location, AuthService, AUTH_EVENTS) {
    $rootScope.$on('$routeChangeStart', function (event,next, current) {
        if (!AuthService.isAuthenticated()) {
            if (next.isLogin) {
                $location.path('/login').search({msg: "Please login before viewing this page."});
            }
        }
    });
});