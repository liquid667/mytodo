'use strict';

angular.module('mytodoApp')
        .controller('ServerHealthCtrl', function($scope, es) {
            es.clusterHealth(function(resp) {
                if (resp.status === 'yellow') {
                    $scope.serverStatus = 'warning';
                } else if (resp.status === 'red') {
                    $scope.serverStatus = 'danger';
                } else if (resp.status === 'green') {
                    $scope.serverStatus = 'success';
                }
            });
        });