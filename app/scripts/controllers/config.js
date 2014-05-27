'use strict';

angular.module('mytodoApp')
  .controller('ConfigCtrl', function ($scope, es, localStorageService) {
    $scope.saveConfig = function () {
      localStorageService.set('hostname', $scope.hostname);
      es.changeServerAddress($scope.hostname);
    };

    // Load the configration
    var hostnameInStore = localStorageService.get('hostname');
    $scope.hostname = hostnameInStore || 'localhost:9200';
  });
