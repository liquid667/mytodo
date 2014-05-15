'use strict';

angular.module('mytodoApp')
  .controller('ModalCtrl', function ($scope, $filter, es, localStorageService, timespan, selectedfields) {
    $scope.$watch('fields', function () {
      localStorageService.add('fields', $scope.fields.join('\n'));
    }, true);

    $scope.addField = function (index) {
      $scope.fields.push($scope.columns[index]);
      $scope.columns = $filter('filter')($scope.columns, '!' + $scope.columns[index]);

      selectedfields.fields = $scope.fields;
    };

    $scope.removeField = function (index) {
      $scope.columns.push($scope.fields[index]);
      $scope.fields.splice(index, 1);

      selectedfields.fields = $scope.fields;
    };

    var getMapping = function () {
      es.indices.getMapping({
        "index": "logstash-2014.04.29"
      }).then(function (response) {
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

    var fieldsInStore = localStorageService.get('fields');
    $scope.fields = fieldsInStore && fieldsInStore.split('\n') || ['@timestamp', "message"];
    selectedfields.fields = $scope.fields;

    getMapping();
  });