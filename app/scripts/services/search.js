'use strict';

angular.module('mytodoApp')
  .service('es', function (esFactory, localStorageService) {
    var hostname = localStorageService.get('hostname') || 'localhost:9200';

    return esFactory({
      host: hostname
    });
  });