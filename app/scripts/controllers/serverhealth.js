'use strict';

angular.module('mytodoApp')
    .controller('ServerHealthController', function($scope, es) {
        es.cluster.health(function(err, resp) {
            if (err) {
                $scope.data = err.message;
            } else {
                $scope.data = resp;

                if (resp.status === 'yellow') {
                    $scope.serverStatus = 'warning';
                } else if (resp.status === 'red') {
                    $scope.serverStatus = 'danger';
                } else if (resp.status === 'green') {
                    $scope.serverStatus = 'success';
                }
            }
        });
    });