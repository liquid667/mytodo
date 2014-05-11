'use strict';

angular.module('mytodoApp')
    .factory('timespan', function () {
        var timespan = 'Timespan';
        var from;
        var to = 'now';

        return {
            timespan: timespan,
            from: from,
            to: to
        };
    });
