/*global describe, it */
'use strict';
var assert = require('assert');
var autobot = require('../');

describe('autobot node module', function () {
  it('must have at least one test', function () {
    autobot();
    assert(false, 'I was too lazy to write any tests. Shame on me.');
  });
});
