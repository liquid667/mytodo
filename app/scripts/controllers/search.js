'use strict';

angular.module('mytodoApp')
        .controller('SearchCtrl', function($scope, $filter, es, localStorageService, usSpinnerService, timespan) {

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

            $scope.changeSorting = function(column) {
                var sort = $scope.sort;
                if (sort.column === column) {
                    sort.descending = !sort.descending;
                } else {
                    sort.column = column;
                    sort.descending = false;
                }
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

            es.getMapping(fieldsInStore, function (response) {
                $scope.columns = response;
            });
            
            $scope.search = function() {
                usSpinnerService.spin('searchStatusSpinner');
                es.search(timespan.indices, $scope.searchCriterias, timespan.from, ($scope.sort.descending ? 'desc' : 'asc'), function(response){
                   usSpinnerService.stop('searchStatusSpinner');
                   $scope.hits = response.hits.hits;
                   $scope.hitCount = response.hits.total;
                });
            };
        });