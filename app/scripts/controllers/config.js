'use strict';

angular.module('mytodoApp')
        .controller('ConfigCtrl', function($scope, localStorageService) {
            var hostnameInStore = localStorageService.get('hostname');
            $scope.hostname = hostnameInStore || 'localhost:9200';
    
            $scope.saveConfig = function() {
                localStorageService.set('hostname', $scope.hostname);
            };
        });
