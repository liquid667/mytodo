'use strict';

angular.module('mytodoApp')
  .controller('SearchCtrl', function ($scope) {
      $scope.search = function() {
        $scope.searchResults = [
            'Result1',
            'Result2',
            'Result3'
        ];
      };
  });