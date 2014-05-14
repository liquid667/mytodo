'use strict';

angular.module('mytodoApp')
    .service('es', function (esFactory, host) {
        var myHost = host;

        return esFactory({
            host: myHost.hostname
        });
    });