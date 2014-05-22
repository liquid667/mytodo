'use strict';

angular.module('mytodoApp', [
            'ngCookies',
            'ngResource',
            'ngSanitize',
            'ngRoute',
            'ui.sortable',
            'LocalStorageModule',
            'elasticsearch',
            'mgcrea.ngStrap',
            'ngAnimate',
            'angularSpinner',
            'angular-momentjs',
            'dangle'
        ])
    .config(['localStorageServiceProvider', function(localStorageServiceProvider) {
            localStorageServiceProvider.setPrefix('logsearch');
        }])
    .config(function($routeProvider) {
        $routeProvider
            .when('/todo', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/search', {
                templateUrl: 'views/search.html',
                controller: 'SearchCtrl'
            })
            .when('/config', {
              templateUrl: 'views/config.html',
              controller: 'ConfigCtrl'
            })
            .otherwise({
                redirectTo: '/search'
            });
    });
