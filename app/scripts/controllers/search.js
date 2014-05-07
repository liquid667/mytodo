'use strict';

angular.module('mytodoApp')
        // We define an Angular controller that returns query results,
        // Inputs: $scope and the 'es' service
        .controller('QueryController', function($scope, $filter, es, localStorageService) {
            $scope.predicate = 'timestamp';
            $scope.reverse = 'true';

            $scope.search = function() {
                es.search({
                    'index': 'logstash-2014.04.29',
//                    'size': 50,
                    body: {
                        "query": {
                            "filtered": {
                                "query": {
                                    "bool": {
                                        "should": [{
                                                "query_string": {
                                                    "query": $scope.searchCriterias
                                                }
                                            }]
                                    }
                                },
                                "filter": {
                                    "bool": {
                                        "must": [{
                                                "range": {
                                                    "@timestamp": {
                                                        "from": 1398338797454,
                                                        "to": "now"
                                                    }
                                                }
                                            }]
                                    }
                                }
                            }
                        },
                        "size": 50,
                        "sort": [{
                                "@timestamp": {
                                    "order": "desc"
                                }
                            }]
                    }
                }).then(function(response) {
                    $scope.hits = response.hits.hits;
                    $scope.hitCount = response.hits.total;
                });
            };

            var fieldsInStore = localStorageService.get('fields');
            $scope.fields = fieldsInStore && fieldsInStore.split('\n') || ['@timestamp', "message"];

            $scope.$watch('fields', function() {
                localStorageService.add('fields', $scope.fields.join('\n'));
            }, true);

            $scope.addField = function() {
                $scope.fields.push($scope.field);
                $scope.columns = $filter('filter')($scope.columns, '!' + $scope.field);
                $scope.field = '';
            };

            $scope.removeField = function(index) {
                $scope.columns.push($scope.fields[index]);
                $scope.fields.splice(index, 1);
            };

            es.indices.getMapping({
                "index": "logstash-2014.04.29"
            }).then(function(response) {
                var myTypes = [];
                var myColumns = [];
                for (var index in response) {
                    for (var type in response[index].mappings) {
                        if (myTypes.indexOf(type) === -1 && type !== "_default_") {
                            myTypes.push(type);
                            var properties = response[index].mappings[type].properties;
                            for (var field in properties) {
                                if (!isFieldStored(fieldsInStore, field)) {
                                    myColumns.push(field);
                                }
                            }
                        }
                    }
                }
                $scope.columns = myColumns;
            });

            function isFieldStored(array, field) {
                if (array.indexOf(field) === -1) {
                    return false;
                }
                return true;
            }

        });