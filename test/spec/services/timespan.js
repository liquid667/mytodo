'use strict';

describe('Service: timespan', function () {

  // load the service's module
  beforeEach(module('mytodoApp'));

  // instantiate service
  var timespan;
  beforeEach(inject(function (_timespan_) {
    timespan = _timespan_;
  }));

  it('should do something', function () {
    expect(!!timespan).toBe(true);
  });

});
