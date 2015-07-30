var app = angular.module('appRoutes', [])
    app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
 // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'homeController'
        })

        .when('/tacto', {
            templateUrl: 'views/tacto.html',
            controller: 'tactoController'
        })
        .when('/create', {
            templateUrl: 'views/create.html',
            controller: 'createController'
        })
        .when('/color-effect', {
            templateUrl: 'views/color-effect.html',
            controller: 'colorEffect'
        })
        .when('/crop', {
            templateUrl: 'views/cropper.html',
            controller: 'cropCtrl'
        })
}]);