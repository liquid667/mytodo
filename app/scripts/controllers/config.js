'use strict';

angular.module('mytodoApp')
        .controller('ConfigControl', function($scope, localStorageService) {
            $scope.hostname = '';
    
            $scope.saveConfig = function() {
                localStorageService.set('hostname', $scope.hostname);
            };

        });
