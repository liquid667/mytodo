'use strict';

// We define an EsConnector module that depends on the elasticsearch module.     
angular.module('mytodoApp')
    // Create the es service from the esFactory
    .service('es', function (esFactory, localStorageService) {
        var host = localStorageService.get('hostname') || 'localhost:9200';

        return esFactory({
            host: host
        });
    });