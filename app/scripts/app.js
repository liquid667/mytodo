'use strict';

angular.module('mytodoApp', [
            'ngCookies',
            'ngResource',
            'ngSanitize',
            'ngRoute',
            'ui.sortable',
            'LocalStorageModule',
            'elasticsearch'
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
            .when('/mappings', {
              templateUrl: 'views/mappings.html',
              controller: 'MappingsController'
            })
            .otherwise({
                redirectTo: '/search'
            });
    });
