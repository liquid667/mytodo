'use strict';

angular.module('mytodoApp')
    .controller('QueryCtrl', function ($scope, $filter, es, localStorageService, usSpinnerService, timespan) {
        $scope.predicate = 'timestamp';
        $scope.reverse = 'true';
        $scope.timespan = timespan;

        var fieldsInStore = localStorageService.get('fields');
        $scope.fields = fieldsInStore && fieldsInStore.split('\n') || ['@timestamp', "message"];

        getMapping();
        
        $scope.search = function () {
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
            }).then(function (response) {
                usSpinnerService.stop('searchStatusSpinner');
                $scope.hits = response.hits.hits;
                $scope.hitCount = response.hits.total;
            }, function (error) {
                if (error) {
                    usSpinnerService.stop('searchStatusSpinner');
                    console.log('Elasticsearch returned error: ' + error);
                }
            });
        };

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

            function getMapping() {
                es.indices.getMapping({
                }).then(function(response) {
                    var myTypes = [];
                    var myColumns = [];
                    for (var index in response) {
                        if(isFieldStored(index, 'logstash')){
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

            }

            function isFieldStored(array, field) {
                if (array.indexOf(field) === -1) {
                    return false;
                }
                return true;
            }
    });