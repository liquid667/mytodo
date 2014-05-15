'use strict';

angular.module('mytodoApp')
    .service('es', function (esFactory, configService) {
        var cs = configService;

        return esFactory({
            host: cs.hostname
        });
    });