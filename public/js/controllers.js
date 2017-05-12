/**
 * Created by David on 04 May 2017.
 */
angular.module('meanseed')
    .controller('AppCtrl', function($scope, AuthService) {
        // create a message to display in our view

        $scope.currentUser = null;
        $scope.isAuthorized = false;

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };

        $scope.logout = function () {
            AuthService.logout();
            $scope.setCurrentUser(null);
        }

        $scope.teasers = [
            {
            "logo": "fa-calculator",
            "titel": "Math",
            "link": "search/something?math"
        },{
            "logo": "fa-balance-scale",
            "titel": "Physics",
            "link": "search/something?physics"
        },{
            "logo": "fa-book",
            "titel": "History",
            "link": "search/something?history"
        },{
            "logo": "fa-flask",
            "titel": "Chemistry",
            "link": "search/something?chemistry"
        },{
            "logo": "fa-language",
            "titel": "English",
            "link": "search/something?language"
        },{
            "logo": "fa-leanpub",
            "titel": "Danish",
            "link": "search/something?danish"
        },{
            "logo": "fa-sort-alpha-asc",
            "titel": "Other Languages",
            "link": "search/something?otherlanguages"
        },{
            "logo": "fa-globe",
            "titel": "Geography",
            "link": "search/something?geography"
        },{
            "logo": "fa-low-vision",
            "titel": "Religion",
            "link": "search/something?religion"
        },{
            "logo": "fa-handshake-o",
            "titel": "Social Science",
            "link": "search/something?socialscience"
        },{
            "logo": "fa-bug",
            "titel": "Biology",
            "link": "search/something?biology"
        },{
            "logo": "fa-music",
            "titel": "Music",
            "link": "search/something?music"
        },{
            "logo": "fa-bar-chart",
            "titel": "Statistics",
            "link": "search/something?statistics"
        },
        ];
    })

    .controller('aboutController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    })

    .controller('searchController', function($scope, $http) {
        $scope.message = 'Motherfucking search page.';
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

    .controller('profileEditController', function($scope, AuthService, $routeParams, $http, fileUpload) {
        $scope.uploadFile = function(){
            var file = $scope.myFile;

            console.log('file is ' );
            console.dir(file);

            var uploadUrl = "/user/upload/profilepic";
            fileUpload.uploadFileToUrl(file, uploadUrl);
        };

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