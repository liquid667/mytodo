'use strict';

angular.module('mytodoApp')
        .controller('ConfigCtrl', function($scope, localStorageService, configService) {
            $scope.saveConfig = function() {
                localStorageService.set('hostname', $scope.hostname);
                cs.hostname = $scope.hostname;
                
                console.log('saveConfig: hostname: %s', cs.hostname);
            };
            
            // Load the configration
            var cs = configService;
            var hostnameInStore = localStorageService.get('hostname');
            $scope.hostname = hostnameInStore || 'localhost:9200';
        });
