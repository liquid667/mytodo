'use strict';

angular.module('mytodoApp')
        .controller('MappingsController', function($scope, es) {
            $scope.getMapping = function() {
                es.indices.getMapping({
                    "index": "logstash-2014.04.29"
                }).then(function(response) {
                    $scope.mappings = response;
                });
            };
        });
