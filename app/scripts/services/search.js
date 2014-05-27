'use strict';

angular.module('mytodoApp')
    .factory('es', function(esFactory, configService){
        function ElasticService(esFactory, configService){
            
            this.changeServerAddress = function (serverAddress) {
                hostname = serverAddress;
                es = createEsFactory();
            };
            
            this.clusterHealth = function (callback) {
                es.cluster.health().then(function(data) {
                    callback(data);
                });
            };
            
            this.getMapping = function(fieldsInStore, callback) {
                es.indices.getMapping({
                }).then(function(response) {
                    var myTypes = [];
                    var myColumns = [];
                    for (var index in response) {
                        // Check if it is a string containing logstash
                        if (isFieldStored(index, 'logstash')) {
                            // extract all mappings from index, can be more than one
                            for (var type in response[index].mappings) {
                                // if mapping isnt already stored in types arrray or _default_ then add to types array
                                if (myTypes.indexOf(type) === -1 && type !== "_default_") {
                                    myTypes.push(type);
                                    // fetch all properties from mappings[type].properties
                                    var properties = response[index].mappings[type].properties;
                                    // loop through array of properties
                                    for (var field in properties) {
                                        // if not field is stored then store it in columns array
                                        if (!isFieldStored(fieldsInStore, field) && !isFieldStored(myColumns, field)) {
                                            myColumns.push(field);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return callback(myColumns);
                });
            };
            
            this.getAvailableIndices = function (indices, callback) {
              es.indices.getAliases({
                'index': indices,
                'ignore_missing': true
              }).then(function (response) {
                var myIndices = [];
                for (var index in response) {
                  myIndices.push(index);
                }
                return callback(formatIndices(myIndices));
              });
            };

            function formatIndices(indices) {
              var len = indices.length;
              var indicesFormatted = '';
              for (var i = 0; i < len; i++) {
                if (i !== (len - 1)) {
                  indicesFormatted += indices[i] + ',';
                } else {
                  indicesFormatted += indices[i];
                }
              }
              return indicesFormatted;
            }
            
            function isFieldStored(array, field) {
                if (array.indexOf(field) === -1) {
                    return false;
                }
                return true;
            }
            
            function createEsFactory() {
                return esFactory({"host": hostname});
            }

            var hostname = configService.host;//localStorageService.get('hostname') || 'localhost:9200';
            var es = createEsFactory();
       }
        
    return new ElasticService(esFactory, configService);
   });
//  .service('es1', function (esFactory, localStorageService) {
//    var hostname = localStorageService.get('hostname') || 'localhost:9200';
//
//    return esFactory({
//      host: hostname
//    });
//  })
//});