'use strict';

describe('Service: selectedfields', function () {

  // load the service's module
  beforeEach(module('mytodoApp'));

  // instantiate service
  var selectedfields;
  beforeEach(inject(function (_selectedfields_) {
    selectedfields = _selectedfields_;
  }));

  it('should do something', function () {
    expect(!!selectedfields).toBe(true);
  });

});
