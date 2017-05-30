'use strict';

(function(module) {
  var shell = require('simple-shell');
  var commands = require('./lib/commands');

  module.exports = function() {
    shell.initialize();
    commands.forEach(function(cmd) {
      shell.registerCommand(cmd);
    });
    console.log('Type ' + 'help'.green + ' to get started. To get help for any command just suffix the comand with ' + 'help'.green);
    shell.startConsole();
  };

})(module);
