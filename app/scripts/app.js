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
            .when('/login', {
              templateUrl: 'views/login.html',
              controller: 'LoginCtrl'
            })
            .when('/modal', {
              templateUrl: 'views/modal.html',
              controller: 'ModalCtrl'
            })
            .when('/config', {
              templateUrl: 'views/config.html',
              controller: 'ConfigCtrl'
            })
            .when('/timepicker', {
              templateUrl: 'views/timepicker.html',
              controller: 'TimepickerCtrl'
            })
            .otherwise({
                redirectTo: '/search'
            });
    });
