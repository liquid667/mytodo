'use strict';

// We define an EsConnector module that depends on the elasticsearch module.     
angular.module('mytodoApp')
    // Create the es service from the esFactory
    .service('es', function(esFactory) {
        return esFactory({
            host: 'localhost:9200'
            //host: '160.50.140.49:9092'
        });
    });