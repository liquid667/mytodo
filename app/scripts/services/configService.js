'use strict';

angular.module('mytodoApp')
        .factory('configService', function($rootScope, localStorageService) {
            
            function LocalConfigService(localStorageService) {
                var LOCAL_STORAGE_ID='es-config';
                var config;
                var hostname = localStorageService.get('hostname') || 'localhost:9200';
                
                config = {
                    host: hostname
                };
                
                $rootScope.$watch(function(){
                    return config;
                }, function(){
                    localStorageService[LOCAL_STORAGE_ID] = JSON.stringify(config);
                }, true);
                
                return config;
            }
            
            return new LocalConfigService(localStorageService);
        });
