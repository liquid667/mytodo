'use strict';

angular.module('mytodoApp').controller('TimepickerCtrl', function($scope, $moment, timespan) {

    var selectedTimespan = '';
    $scope.timespan = timespan.timespan;
    $scope.times = ['5m','15m','1h','6h','12h','24h','2d','7d','14d','30d'];
    
//    $scope.patterns = {
//      date: /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/,
//      hour: /^([01]?[0-9]|2[0-3])$/,
//      minute: /^[0-5][0-9]$/,
//      second: /^[0-5][0-9]$/,
//      millisecond: /^[0-9]*$/
//    };


    $scope.setSelectedValue = function(time) {
        $scope.timespan = 'Last ' + time;

        timespan.timespan = $scope.timespan;

        $scope.time = time.substring(0, (time.length-1));
        $scope.unit = time.substring((time.length-1), time.length);
//        console.debug('Time: %s, Unit: %s', $scope.time, $scope.unit);
        
        var to = $moment();
        var from = $moment().subtract($scope.unit, $scope.time);

        timespan.from = from;
        timespan.to = to;

//        console.log('from: %s, to: %s, diff: %s', from.unix(), to.unix(), (to-from));
    };
});
