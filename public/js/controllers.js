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

    .controller('searchController', function($scope, $http) {
        $scope.message = 'Look! I am an search page.';
        $http.get('/api/search/profession').then(function(res){
            $scope.list = res.data;
        });

    })

    .controller('profileController', function($scope, AuthService, $routeParams) {
        $scope.own = false;
        $scope.title = $routeParams.userName + "'s Profile Page";
        if($scope.currentUser != null && $scope.currentUser.userName == $routeParams.userName){
            $scope.own = true;
            $scope.message = 'Look! This is your profile!';
        }

    })

    .controller('contactController', function($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
    })

    .controller('loginViewController', function($scope, AuthService, $location, AUTH_EVENTS) {
        var urlParams = $location.search();
        $scope.alertText = urlParams.msg;
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

                $scope.dangerText = errMsg
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