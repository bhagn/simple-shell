#!/usr/bin/env node
'use strict';
var meow = require('meow');
var shell = require('./');

var cli = meow({
  help: [
    'Usage',
    '  simple-shell'
  ].join('\n')
});

shell();
