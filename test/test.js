/*global describe, it */
'use strict';
var assert = require('assert');
var SimpleShell = require('../');

describe('SimpleShell node module', function () {
  it('should have all the methods!', function () {
    SimpleShell.initialize({});
    assert.notEqual(SimpleShell, undefined);
    assert.notEqual(SimpleShell.initialize, undefined);
    assert.notEqual(SimpleShell.startConsole, undefined);
    assert.notEqual(SimpleShell.registerCommand, undefined);
    assert.notEqual(SimpleShell.log, undefined);
    assert.notEqual(SimpleShell.info, undefined);
    assert.notEqual(SimpleShell.warn, undefined);
    assert.notEqual(SimpleShell.error, undefined);
    assert.notEqual(SimpleShell.success, undefined);
  });
});
