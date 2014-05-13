'use strict';

angular.module('mytodoApp')
    .controller('QueryCtrl', function ($scope, $filter, es, localStorageService, usSpinnerService, timespan, selectedfields) {
        $scope.predicate = 'timestamp';
        $scope.reverse = 'true';
        $scope.timespan = timespan;
        $scope.columns = selectedfields.fields;
        
        $scope.search = function () {
            usSpinnerService.spin('searchStatusSpinner');
            es.search({
                'index': getAvailableIndices(timespan.indices),
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
                                                    "from": timespan.from.unix(),
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

        var fieldsInStore = localStorageService.get('fields');
        $scope.fields = fieldsInStore && fieldsInStore.split('\n') || ['@timestamp', "message"];

        $scope.$watch('fields', function () {
            localStorageService.add('fields', $scope.fields.join('\n'));
        }, true);

        $scope.addField = function () {
            $scope.fields.push($scope.field);
            $scope.columns = $filter('filter')($scope.columns, '!' + $scope.field);
            $scope.field = '';
        };

        $scope.removeField = function (index) {
            $scope.columns.push($scope.fields[index]);
            $scope.fields.splice(index, 1);
        };

            es.indices.getMapping({
                'index': timespan.indices
            }).then(function(response) {
                var myTypes = [];
                var myColumns = [];
                for (var index in response) {
                    for (var type in response[index].mappings) {
                        if (myTypes.indexOf(type) === -1 && type !== "_default_") {
                            myTypes.push(type);
                            var properties = response[index].mappings[type].properties;
                            for (var field in properties) {
                                if (!isFieldStored(fieldsInStore, field) && !isFieldStored(myColumns, field)) {
                                    myColumns.push(field);
                                    //handleSubfields(properties[field], field, myColumns, undefined);
                                }
                            }
                        }
                    }
                }
                $scope.columns = myColumns;
            });
        
            function getAvailableIndices(indices) {
                console.log('Incoming Indices: %s', indices.toString());
                es.indices.getAliases({
                    'index': indices,
                    'ignore_missing': true
                }).then(function(response) {
                    var myIndices = [];
                    for (var index in response) {
                        myIndices.push(index);
                    }
                    console.log('Indices: %s', formatIndices(myIndices));
                    return formatIndices(myIndices);
                });
            }

            function isFieldStored(array, field) {
                if (array.indexOf(field) === -1) {
                    return false;
                }
                return true;
            }

            function formatIndices(indices) {
                var len = indices.length;
                var indicesFormatted = '';
                for (var i=0;i<len;i++) {
                    if(i!==(len-1)){
                        indicesFormatted += indices[i] + ',';
                    } else {
                        indicesFormatted += indices[i];
                    }
                }
                return indicesFormatted;
            }

//            function handleSubfields(field, fieldName, myFields, nestedPath) {
//                if (field.hasOwnProperty("properties")) {
//                    var nested = (field.type === "nested" || field.type === "object");
//                    if (nested) {
//                        nestedPath = fieldName;
//                    }
//                    for (var subField in field.properties) {
//                        var newField = fieldName + "." + subField;
//                        handleSubfields(field.properties[subField], newField, myFields, nestedPath);
//                    }
//                } else {
//                    if (field.hasOwnProperty("fields")) {
//                        for (var multiField in field.fields) {
//                            var multiFieldName = fieldName + "." + multiField;
//                            // TODO jettro : fix the nested documents with multi_fields
//                            if (!myFields[multiFieldName] && fieldName !== multiField) {
//                                myFields[multiFieldName] = field.fields[multiField];
//                                myFields[multiFieldName].nestedPath = nestedPath;
//                                myFields[multiFieldName].forPrint = multiFieldName + " (" + field.type + ")";
//                            }
//                        }
//                    }
//                    if (!myFields[fieldName]) {
//                        myFields[fieldName] = field;
//                        myFields[fieldName].nestedPath = nestedPath;
//                        myFields[fieldName].forPrint = fieldName + " (" + field.type + ")";
//                    }
//                }
//            }

    });