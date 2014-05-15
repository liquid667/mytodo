'use strict';

describe('Controller: TimepickerCtrl', function () {

  // load the controller's module
  beforeEach(module('mytodoApp'));

  var TimepickerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TimepickerCtrl = $controller('TimepickerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
