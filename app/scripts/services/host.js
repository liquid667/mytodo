'use strict';

angular.module('mytodoApp')
        .factory('host', function() {
            var host;//localStorageService.get('hostname') || 'localhost:9200';

            return {
                host: host
            };
        });
