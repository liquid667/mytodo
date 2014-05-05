'use strict';

angular.module('mytodoApp')
        // We define an Angular controller that returns query results,
        // Inputs: $scope and the 'es' service
        .controller('QueryController', function($scope, es, localStorageService) {
            $scope.predicate = 'timestamp';
            $scope.reverse = 'true';
            
            $scope.states = ['Alabama', 'Alaska'];
            
            var fieldsInStore = localStorageService.get('fields');
            $scope.fields = fieldsInStore && fieldsInStore.split('\n') || ['@timestamp', "msg1"];
            $scope.$watch('fields', function() {
                localStorageService.add('fields', $scope.fields.join('\n'));
            }, true);

            $scope.addField = function() {
                $scope.fields.push($scope.field);
                $scope.field = '';
            };

            $scope.removeField = function(index) {
                $scope.fields.splice(index, 1);
            };
            
            $scope.search = function() {
                es.search({
                    'index': 'logstash-2014.04.29',
//                    'size': 20,
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
//                        "size": 20,
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
//        $scope.changeSorting = function(column) {
//            var sort = $scope.sort;
//            
//            if (sort.column === column) {
//                sort.descending = !sort.descending;
//            } else {
//                sort.column = column;
//                sort.descending = false;
//            }
//        };
        })

        // We define an Angular controller that returns the server health
        // Inputs: $scope and the 'es' service
        .controller('ServerHealthController', function($scope, es) {
            es.cluster.health(function(err, resp) {
                if (err) {
                    $scope.data = err.message;
                } else {
                    $scope.data = resp;

                    if (resp.status === 'yellow') {
                        $scope.serverStatus = 'warning';
                    } else if (resp.status === 'red') {
                        $scope.serverStatus = 'danger';
                    } else if (resp.status === 'green') {
                        $scope.serverStatus = 'success';
                    }
                }
            });
        });