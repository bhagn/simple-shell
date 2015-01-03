#!/usr/bin/env node
'use strict';
var meow = require('meow');
var autobot = require('./');

var cli = meow({
  help: [
    'Usage',
    '  autobot'
  ].join('\n')
});

autobot(cli.input[0]);
