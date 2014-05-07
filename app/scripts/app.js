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
            'ngAnimate'
        ])
    .config(['localStorageServiceProvider', function(localStorageServiceProvider) {
            localStorageServiceProvider.setPrefix('ls');
        }])
    .config(function($routeProvider) {
        $routeProvider
            .when('/todo', {
                templateUrl: 'views/main.html',
                controller: 'MainController'
            })
            .when('/search', {
                templateUrl: 'views/search.html',
                controller: 'QueryController'
            })
            .when('/login', {
              templateUrl: 'views/login.html',
              controller: 'LoginController'
            })
            .when('/mapping', {
              templateUrl: 'views/mappings.html',
              controller: 'MappingsController'
            })
            .when('/modal', {
              templateUrl: 'views/modal.html',
              controller: 'MappingsController'
            })
            .when('/config', {
              templateUrl: 'views/config.html',
              controller: 'ConfigControl'
            })
            .otherwise({
                redirectTo: '/search'
            });
    });
