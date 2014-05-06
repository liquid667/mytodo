'use strict';

angular.module('mytodoApp')
        .controller('ModalController', function($scope, $filter, es, localStorageService) {
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

//            $scope.getColumns = function() {
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
                                //handleSubfields(properties[field], field, myColumns, undefined);
                            }
                        }
                    }
                }
                $scope.columns = myColumns;
            });
//            };

            function isFieldStored(array, field) {
                if (array.indexOf(field) === -1) {
                    return false;
                }
                return true;
            }
        });