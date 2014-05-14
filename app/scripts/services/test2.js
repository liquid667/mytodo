'use strict';

angular.module('mytodoApp')
  .factory('test2', function () {
    var meaningOfLife = 42;
    var value = 'Some value!';

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      },
      someOtherMethod: function(input) {
          return input+', and that was your input!';
      },
      someValue: value
    };
  });
