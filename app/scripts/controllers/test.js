'use strict';

angular.module('mytodoApp')
  .controller('TestCtrl', function ($scope, test2) {
      console.log(test2.someMethod());
      console.log(test2.someOtherMethod(['My Input1', 'My input2']));
      console.log($scope.someValue = test2.someValue);
  });
