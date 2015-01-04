#!/usr/bin/env node
'use strict';
var meow = require('meow');
var jjcli = require('./');

var cli = meow({
  help: [
    'Usage',
    '  autobot'
  ].join('\n')
});

jjcli();
