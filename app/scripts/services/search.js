'use strict';

// We define an EsConnector module that depends on the elasticsearch module.     
var EsConnector = angular.module('mytodoApp', ['elasticsearch']);

// Create the es service from the esFactory
EsConnector.service('es', function(esFactory) {
    return esFactory({
        host: 'localhost:9200'
    });
});

// We define an Angular controller that returns the server health
// Inputs: $scope and the 'es' service
EsConnector.controller('ServerHealthController', function($scope, es) {

    es.cluster.health(function(err, resp) {
        if (err) {
            $scope.data = err.message;
        } else {
            $scope.data = resp;
        }
    });
});

// We define an Angular controller that returns query results,
// Inputs: $scope and the 'es' service

EsConnector.controller('QueryController', function($scope, es) {

// search for documents
    es.search({
        index: 'test_index',
        size: 50,
        body: {
            'query':
                    {
                        'match': {
                            title: 'Product1'
                        }
                    }
        }

    }).then(function(response) {
        $scope.hits = response.hits.hits;
    });

});

