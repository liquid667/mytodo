'use strict';

angular.module('mytodoApp')
        .controller('ModalDemoCtrl', function($scope, $modal, $log) {

            $scope.aside = {
                "title": "Title",
                "content": "Hello Aside<br />This is a multiline message!"
            };

            $scope.items = ['item1', 'item2', 'item3'];

            $scope.open = function(size) {

                var modalInstance = $modal.open({
                    controller: 'ModalInstanceCtrl',
                    templateUrl: 'views/modal.tpl.html',
                    size: size,
                    resolve: {
                        items: function() {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        })
        .controller('ModalInstanceCtrl', function($scope, $modalInstance, items, es, localStorageService) {
            $scope.items = items;
            $scope.selected = {
                item: $scope.items[0]
            };

            $scope.ok = function() {
                $modalInstance.close($scope.selected.item);
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
            
            var fieldsInStore = localStorageService.get('fields');
            $scope.fields = fieldsInStore && fieldsInStore.split('\n') || ['@timestamp', "message"];

            es.indices.getMapping({
                    "index": "logstash-2014.04.29"
                }).then(function(response) {
                    var myTypes = [];
                    var myColumns = [];
                    for (var index in response) {
                        for (var type in response[index].mappings) {
                            if (myTypes.indexOf(type) === -1 && type !== "_default_") {
                                myTypes.push(type);
                                var properties = response[index].mappings[type].properties;
                                for (var field in properties) {
                                    if(!isFieldStored(fieldsInStore, field)){
                                        myColumns.push(field);
                                    }
                                }
                            }
                        }
                    }
                    $scope.columns = myColumns;
                });

            function isFieldStored(array, field) {
                if(array.indexOf(field) === -1){
                    return false;
                }
                return true;
            }
        });
