'use strict';

describe('Service: host', function () {

  // load the service's module
  beforeEach(module('mytodoApp'));

  // instantiate service
  var host;
  beforeEach(inject(function (_host_) {
    host = _host_;
  }));

  it('should do something', function () {
    expect(!!host).toBe(true);
  });

});
