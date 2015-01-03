'use strict';

var figlet = require('figlet');
var readline = require('readline');
var colors = require('colors');
var pkg = require('./package.json');
var S = require('string');

var jjcli = require('inquirer');
module.exports = jjcli;

var CLI = function(options) {
  var _options = options;
  var _this = this;

  function completer(line) {
    var completions = 'help quit'.split(' ');
    var hits = completions.filter(function(c) {
      return c.indexOf(line) === 0 ;
    });
    // show all completions if none found
    return [hits, line];
  }

  this.log = function() {
    console.log(Array.from(arguments).join(' '));
  };

  this.info = function() {
    console.info(Array.from(arguments).join(' ').blue);
  };

  this.warning = function() {
    console.warning(Array.from(arguments).join(' ').orange);
  };

  this.error = function() {
    console.error(Array.from(arguments).join(' ').red);
  };

  this.success = function() {
    console.log(Array.from(arguments).join(' ').green);
  };

  this.showHelp = function() {
    console.log(S('open').padRight(15).s, ':',
      'Open the application'.green);
    console.log(S('discover').padRight(15).s, ':',
      'Discover all the objects on the page'.green);
  };

  this.startConsole = function() {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
      completer: completer
    });

    rl.setPrompt(_options.prompt || '#> ');
    rl.prompt();

    rl.on('line', function(line) {
      switch(line.trim()) {
        case 'help':
          _this.showHelp();
          break;
        case 'quit':
          rl.close();
          break;
        case '':
          break;
        default:
          console.error('Unrecognized command: '.red, line);
      }
      rl.prompt();
    });

    rl.on('close', function() {
      console.log((_options.exitMessage || '\nGood bye!').green);
      process.exit();
    });
  };
};

jjcli.initialize = function (options) {

  var _options = options || {};

  var banner = figlet.textSync((_options.name || pkg.name).toUpperCase(), {
    font: 'Small',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  });

  var meta = ['Copyright(c) ',
    (new Date().getFullYear()), ', ',
    (_options.author || pkg.author.name),
    ' | Version: ',
    (_options.version || pkg.version), '\n'].join('');

  console.log(banner.red);
  console.log(meta.gray);

  var cli = new CLI(_options);
  for(var attr in cli) {
    if(cli.hasOwnProperty(attr)) {
      jjcli[attr] = cli[attr];
    }
  }
  return cli;
};
