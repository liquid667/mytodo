'use strict';

angular.module('mytodoApp')
        .controller('SearchCtrl', function($scope, $filter, es, localStorageService, usSpinnerService, timespan) {
            $scope.search = function() {
                usSpinnerService.spin('searchStatusSpinner');
                es.search({
                    'index': timespan.indices,
                    body: {
                        "query": {
                            "filtered": {
                                "query": {
                                    "bool": {
                                        "should": [
                                            {
                                                "query_string": {
                                                    "query": $scope.searchCriterias
                                                }
                                            }
                                        ]
                                    }
                                },
                                "filter": {
                                    "bool": {
                                        "must": [
                                            {
                                                "range": {
                                                    "@timestamp": {
                                                        "from": timespan.from,
                                                        "to": "now"
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "size": 50,
                        "sort": [
                            {
                                "@timestamp": {
                                    "order": "desc"
                                }
                            }
                        ]
                    }
                }).then(function(response) {
                    usSpinnerService.stop('searchStatusSpinner');
                    $scope.hits = response.hits.hits;
//                    getSearchResult(response);
                    $scope.hitCount = response.hits.total;
                }, function(error) {
                    if (error) {
                        usSpinnerService.stop('searchStatusSpinner');
                        console.log('Elasticsearch returned error: ' + error);
                    }
                });
            };
            
//            var getSearchResult = function(response){
//                for(var index in response.hits.hits){
//                    console.log('index: %s', index);
//                    for(var hit in response.hits.hits[index]){
//                        console.log('hit: %s', hit['_index']);
//                    }
//                }
//            };

            $scope.$watch('fields', function() {
                localStorageService.add('fields', $scope.fields.join('\n'));
            }, true);

            $scope.addField = function(index) {
                $scope.fields.push($scope.columns[index]);
                $scope.columns = $filter('filter')($scope.columns, '!' + $scope.columns[index]);
            };

            $scope.removeField = function(index) {
                $scope.columns.push($scope.fields[index]);
                $scope.fields.splice(index, 1);
            };

            var getMapping = function() {
                es.indices.getMapping({
                }).then(function(response) {
                    var myTypes = [];
                    var myColumns = [];
                    for (var index in response) {
                        if (isFieldStored(index, 'logstash')) {
                            for (var type in response[index].mappings) {
                                if (myTypes.indexOf(type) === -1 && type !== "_default_") {
                                    myTypes.push(type);
                                    var properties = response[index].mappings[type].properties;
                                    for (var field in properties) {
                                        if (!isFieldStored(fieldsInStore, field) && !isFieldStored(myColumns, field)) {
                                            myColumns.push(field);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    $scope.columns = myColumns;
                });
            };

            function isFieldStored(array, field) {
                if (array.indexOf(field) === -1) {
                    return false;
                }
                return true;
            }

            $scope.changeSorting = function(column) {
                console.log('Sort new column: %s', column);
                var sort = $scope.sort;
                console.log('Sort: [column: %s, descending: %s]', $scope.sort.column, $scope.sort.descending);

                if (sort.column === column) {
                    sort.descending = !sort.descending;
                } else {
                    sort.column = column;
                    sort.descending = false;
                }
                console.log('Sort: [column: %s, descending: %s]', $scope.sort.column, $scope.sort.descending);
            };

            $scope.sort = {
                column: 'timestamp',
                descending: true
            };
            
            $scope.timespan = timespan;

            var fieldsInStore = localStorageService.get('fields');
            $scope.fields = fieldsInStore && fieldsInStore.split('\n') || ['@timestamp', "message"];

            getMapping();
        });