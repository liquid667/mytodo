'use strict';

angular.module('mytodoApp')
        .controller('MappingsController', function($scope, es) {
            $scope.getMapping = function() {
                es.indices.getMapping({
                    "index": "logstash-2014.04.29"
                }).then(function(response) {
                    var myTypes = [];
                    var fields = {};
                    for (var index in response) {
//                        if (indexIsNotIgnored(index)) {
                        for (var type in response[index].mappings) {
                            if (myTypes.indexOf(type) === -1 && type !== "_default_") {
                                myTypes.push(type);
                                var properties = response[index].mappings[type].properties;
                                for (var field in properties) {
                                    fields[field] = field;
//                                    handleSubfields(properties[field], field, fields, undefined);
                                }
                            }
                        }
//                        }
                    }
                    $scope.fields = fields;
                });
            };

            function handleSubfields(field, fieldName, myFields, nestedPath) {
                if (field.hasOwnProperty("properties")) {
                    var nested = (field.type === "nested" || field.type === "object");
                    if (nested) {
                        nestedPath = fieldName;
                    }
                    for (var subField in field.properties) {
                        var newField = fieldName + "." + subField;
                        handleSubfields(field.properties[subField], newField, myFields, nestedPath);
                    }
                } else {
                    if (field.hasOwnProperty("fields")) {
                        for (var multiField in field.fields) {
                            var multiFieldName = fieldName + "." + multiField;
                            // TODO jettro : fix the nested documents with multi_fields
                            if (!myFields[multiFieldName] && fieldName !== multiField) {
                                myFields[multiFieldName] = field.fields[multiField];
                                myFields[multiFieldName].nestedPath = nestedPath;
                                myFields[multiFieldName].forPrint = multiFieldName + " (" + field.type + ")";
                            }
                        }
                    }
                    if (!myFields[fieldName]) {
                        myFields[fieldName] = field;
                        myFields[fieldName].nestedPath = nestedPath;
                        myFields[fieldName].forPrint = fieldName + " (" + field.type + ")";
                    }
                }
            }
        });