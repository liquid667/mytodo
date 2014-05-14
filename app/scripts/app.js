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
            'angular-momentjs'
        ])
    .config(['localStorageServiceProvider', function(localStorageServiceProvider) {
            localStorageServiceProvider.setPrefix('ls');
        }])
    .config(function($routeProvider) {
        $routeProvider
            .when('/todo', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/search', {
                templateUrl: 'views/search.html',
                controller: 'QueryCtrl'
            })
            .when('/config', {
              templateUrl: 'views/config.html',
              controller: 'ConfigCtrl'
            })
            .otherwise({
                redirectTo: '/search'
            });
    });
