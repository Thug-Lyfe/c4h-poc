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
        $http.get('/api/search').then(function(res){
            $scope.list = res.data;

            $scope.resetSearch = function () {
                $scope.filterstuff = {};
            }
        });

    })

    .controller('profileController', function($scope, AuthService, $routeParams, $http, $location) {
        $scope.own = false;
        $scope.title = $routeParams.displayName + "'s Profile Page";
        $scope.editProfile = function () {
            //window.location = "#/profile/"+ $scope.currentUser.displayName + "/edit";
            $location.path("/profile/"+ $scope.currentUser.displayName + "/edit");
        };
        if($scope.currentUser != null && $scope.currentUser.displayName == $routeParams.displayName){
            $scope.own = true;

            $scope.message = 'Look! This is your profile!';
        }

        $http.get('/api/profile/'+ $routeParams.displayName).then(function(res){
            $scope.profile = res.data[0];
        });

    })

    .controller('profileEditController', function($scope, AuthService, $location, $routeParams, $http, fileUpload) {
        /*$scope.uploadProfilePic = function(){
            var file = $scope.myFileProfile;

            console.log('file is ' );
            console.dir(file);

            var uploadUrl = "/user/upload/profilepic";
            fileUpload.uploadFileToUrl(file, uploadUrl);
        };
        $scope.uploadCoverPic = function(){
            var file = $scope.myFile;

            console.log('file is ' );
            console.dir(file);

            var uploadUrl = "/user/upload/coverpic";
            fileUpload.uploadFileToUrl(file, uploadUrl);
        };*/
        $http.get('/api/profile/'+$routeParams.displayName).then(function(res){
            $scope.edittedUser = res.data[0];

            $scope.availableFag = {}
            $scope.availableFag.chosenFag = [];
            $scope.availableFag.temp = [
                {name:'mathematics', level:''},
                {name:'danish', level:''},
                {name:'physics',level:''},
                {name:'chemistry',level:''},
                {name:'english',level:''},
                {name:'history',level:''},
                {name:'geography',level:''},
                {name:'religion',level:''},
                {name:'social science',level:''},
                {name:'biology',level:''},
                {name:'music',level:''},
                {name:'statistics',level:''}];
            $scope.edittedUser.fag.forEach(function(fag){
                $scope.availableFag.chosenFag.push({name:fag.name,level:fag.level});
                for (var x = 0; x< $scope.availableFag.temp.length;x++){
                    if(fag.name == $scope.availableFag.temp[x].name){
                        $scope.availableFag.temp[x].level = fag.level;
                    }
                }
            })

            $scope.editProfile = function(){

                $scope.edittedUser.fag = $scope.availableFag.chosenFag;
                $http.put('/user/editprofile', $scope.edittedUser).then(function(res) {

                    if (res.data.success) {
                        var file = $scope.myFileProfile;
                        if(file != null){
                            console.log('file is ' );
                            console.dir(file);
                            var uploadUrl = "/user/upload/profilepic";
                            fileUpload.uploadFileToUrl(file, uploadUrl);
                        }
                        file = $scope.myFile;
                        if(file != null){
                            console.log('file is ' );
                            console.dir(file);
                            uploadUrl = "/user/upload/coverpic";
                            fileUpload.uploadFileToUrl(file, uploadUrl);
                        }

                        console.log(res.data.msg);
                        $location.path('/profile/'+$scope.currentUser.displayName);
                    } else {
                        console.log(res.data.msg);
                    }
                }, function (err) {
                    console.log(err.data.msg);
                });
            }

        });



        $scope.availableGrade = ['4th','5th','6th','7th','8th','9th','10th','11th','12th','13th',];





    })

    .controller('contactController', function($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
    })

    .controller('loginViewController', function($scope, AuthService, $location, AUTH_EVENTS) {
        var urlParams = $location.search();
        $scope.alertText = urlParams.msg;
        $scope.user = {
            email: '',
            password: ''
        };

        $scope.login = function() {
            AuthService.login($scope.user).then(function(user) {
                $location.path('/profile/'+user.displayName);
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
            email: '',
            password: '',
            displayName: ''
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