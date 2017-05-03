/**
 * Created by marco on 03-05-2017.
 */
// script.js

    // create the module and name it scotchApp
var scotchApp = angular.module('meanseed', ['ngRoute']);

// create the controller and inject Angular's $scope
scotchApp.config(function($routeProvider, $locationProvider, $httpProvider) {
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

});
scotchApp.run(function ($rootScope, $location, AuthService, AUTH_EVENTS) {
    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
        if (!AuthService.isAuthenticated()) {
            console.log(next.name);
            if (next.name !== 'outside.login' && next.name !== 'outside.register') {
                event.preventDefault();
                $location.path('/login');
            }
        }
    });
});

scotchApp.controller('AppCtrl', function($scope) {

    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
});
scotchApp.controller('aboutController', function($scope) {
    $scope.message = 'Look! I am an about page.';
});

scotchApp.controller('contactController', function($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});
scotchApp.controller('loginViewController', function($scope) {


});
scotchApp.controller('registerViewController', function($scope) {

});