/*global describe, it */
'use strict';
var assert = require('assert');
var SimpleShell = require('../');

describe('SimpleShell node module', function () {
  it('must have at least one test', function () {
    var shell = SimpleShell.initialize({});
    assert.notEqual(shell, undefined);
  });
});
