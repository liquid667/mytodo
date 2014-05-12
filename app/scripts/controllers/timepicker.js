'use strict';

angular.module('mytodoApp').controller('TimepickerCtrl', function($scope, $moment, timespan) {

    $scope.timespan = timespan.timespan;
    $scope.times = ['5m', '15m', '1h', '6h', '12h', '24h', '2d', '7d', '14d', '30d'];

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

        $scope.time = time.substring(0, (time.length - 1));
        $scope.unit = time.substring((time.length - 1), time.length);

        var to = $moment();
        var from = $moment().subtract($scope.unit, $scope.time);

        var itr = $moment.twix(from, to).iterate("days");
        var indices = [];
        while (itr.hasNext()) {
            indices.push('logstash-' + itr.next().format('YYYY.MM.DD'));
        }

        timespan.indices = formatIndices(indices);
        timespan.from = from;
        timespan.to = to;
    };
    
    function formatIndices(indices) {
        var len = indices.length;
        var indicesFormatted = '';
        for (var i=0;i<len;i++) {
            if(i!==(len-1)){
                indicesFormatted += indices[i] + ',';
            } else {
                indicesFormatted += indices[i];
            }
        }
        return indicesFormatted;
    }
});
