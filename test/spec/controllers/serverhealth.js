'use strict';

describe('Controller: ServerhealthCtrl', function () {

  // load the controller's module
  beforeEach(module('mytodoApp'));

  var ServerhealthCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ServerhealthCtrl = $controller('ServerhealthCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
