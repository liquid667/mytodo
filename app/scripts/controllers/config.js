'use strict';

angular.module('mytodoApp')
        .controller('ConfigCtrl', function($scope, localStorageService, host) {
            var hostnameInStore = localStorageService.get('hostname');
            $scope.hostname = hostnameInStore || 'localhost:9200';
    
            $scope.saveConfig = function() {
                localStorageService.set('hostname', $scope.hostname);
                host.host = $scope.hostname;
                
                test2.someValue = $scope.hostname;
                
                console.log(test2.someValue);
                
                console.log('host: %s', host.host);
            };
        });
