/**
 * Created by David on 04 May 2017.
 */
angular.module('meanseed')
    .controller('AppCtrl', function($scope, AuthService) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
        $scope.currentUser = null;
        $scope.isAuthorized = false;

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };

        $scope.logout = function () {
            AuthService.logout();
            $scope.setCurrentUser(null);
        }
    })

    .controller('aboutController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    })

    .controller('contactController', function($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
    })

    .controller('loginViewController', function($scope, AuthService, $location) {
        $scope.user = {
            userName: '',
            password: ''
        };

        $scope.login = function() {
            AuthService.login($scope.user).then(function(user) {
                $location.path('/about');
                $scope.setCurrentUser(user);
                $scope.isAuthorized = AuthService.isAuthorized;
                console.log("login success");
            }, function(errMsg) {
                console.log("Error in login controller");
            });
        };
    })

    .controller('registerViewController', function($scope, AuthService, $location) {
        $scope.user = {
            userName: '',
            password: ''
        };

        $scope.signup = function(user) {
            AuthService.register(user).then(function(msg) {
                $location.path('/login');
                console.log("signup success");
            }, function(errMsg) {
                console.log("Error in signup controller");
            });
        };
    });