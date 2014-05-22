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
                        "size": $scope.responseSize,
                        "sort": [
                            {
                                "@timestamp": {
                                    "order": $scope.sort.descending ? 'desc' : 'asc'
                                }
                            }
                        ]
                    }
                }).then(function(response) {
                    usSpinnerService.stop('searchStatusSpinner');
                    $scope.hits = response.hits.hits;
                    $scope.hitCount = response.hits.total;
                }, function(error) {
                    if (error) {
                        usSpinnerService.stop('searchStatusSpinner');
                        console.log('Elasticsearch returned error: ' + error);
                    }
                });
            };
            
//            var getSearchResult = function(response){
//                var hits = response.hits.hits;
//                
//                for(var index in hits){
//                    for(var hit in hits[index]){
//                        if(hit === '_source'){
//                            var fields = hits[index]._source;
//                            console.log('fields: %o', fields);
////                            for(var field in hits[index]._source){
////                                console.log('field: %s, value: %s', field, fields[field].toString());
////                            }
//                        }
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
                        // Check if it is a string containing logstash
                        if (isFieldStored(index, 'logstash')) {
                            // extract all mappings from index, can be more than one
                            for (var type in response[index].mappings) {
                                // if mapping isnt already stored in types arrray or _default_ then add to types array
                                if (myTypes.indexOf(type) === -1 && type !== "_default_") {
                                    myTypes.push(type);
                                    // fetch all properties from mappings[type].properties
                                    var properties = response[index].mappings[type].properties;
                                    // loop through array of properties
                                    for (var field in properties) {
                                        // if not field is stored then store it in columns array
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
                
                $scope.search();
            };

            $scope.sort = {
                column: '@timestamp',
                descending: true
            };
            $scope.responseSize = 500;
            
            $scope.timespan = timespan;

            var fieldsInStore = localStorageService.get('fields');
            $scope.fields = fieldsInStore && fieldsInStore.split('\n') || ['@timestamp', "message"];

            getMapping();
        });