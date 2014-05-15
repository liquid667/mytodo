'use strict';

angular.module('mytodoApp')
  .controller('ConfigCtrl', function ($scope, localStorageService) {
    $scope.saveConfig = function () {
      localStorageService.set('hostname', $scope.hostname);
    };

    // Load the configration
    var hostnameInStore = localStorageService.get('hostname');
    $scope.hostname = hostnameInStore || 'localhost:9200';
  });
