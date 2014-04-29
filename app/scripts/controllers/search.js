'use strict';

angular.module('mytodoApp')
    // We define an Angular controller that returns query results,
    // Inputs: $scope and the 'es' service
    .controller('QueryController', function($scope, es) {
        $scope.search = function() {
            // search for documents
            es.search({
                index: 'logstash-2014.04.29',
                size: 50,
                body: {
                    "query": {
                        "query_string": {
                            "query": $scope.searchCriterias,
                            "fields": [
                                "msg1"
                            ]
                        }
                    }
                }
            }).then(function(response) {
                $scope.hits = response.hits.hits;
            });
        };
    })

    // We define an Angular controller that returns the server health
    // Inputs: $scope and the 'es' service
    .controller('ServerHealthController', function($scope, es) {
        es.cluster.health(function(err, resp) {
            if (err) {
                $scope.data = err.message;
            } else {
                $scope.data = resp;
            }
        });
    });