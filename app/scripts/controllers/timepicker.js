'use strict';

angular.module('mytodoApp').controller('TimepickerCtrl', function($scope) {
    var selectedTimespan = '';
    $scope.timespan = selectedTimespan || 'Timespan';
    $scope.times = ['5m', '1h', '6h', '24h', '2d', '1w', '2w', '1m'];
    
    $scope.setSelectedValue = function(time) {
        console.log('setSelectedValue('+time+')');
      selectedTimespan = time;
    };
});
