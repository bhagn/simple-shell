'use strict';

var figlet = require('figlet');
var readline = require('readline');
var colors = require('colors');
var pkg = require.main.require('./package.json');
var S = require('string');
var _ = require('lodash');

var jjcli = require('inquirer');

var commands = {};

function completer(line) {
  var completions = Object.keys(commands);
  var hits = completions.filter(function(c) {
    return c.indexOf(line) === 0 ;
  });

  return [hits, line];
}

function showHelp() {
  var cmds = Object.keys(commands).sort();

  for(var i=0, len=cmds.length; i<len; i++) {
    console.log(cmds[i].green, ':',
      commands[cmds[i]].help);
  }
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  completer: completer
});

var CLI = function(options) {
  var _options = options;
  var _this = this;

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

  this.startConsole = function() {

    var prompt = (_options.prompt || _options.name || pkg.name) + '> ';

    rl.setPrompt(prompt.yellow, prompt.length);
    rl.prompt();

    rl.on('line', function(line) {
      var cmd = line.trim();

      if(!commands[cmd]) {
        console.error('Unrecognized command: '.red, line);
      } else {
        commands[cmd].handler();
      }

      rl.prompt();
    });

    rl.on('close', function() {
      console.log((_options.exitMessage || '\nGood bye!').green);
      process.exit();
    });
  };
};

jjcli.registerCommand = function(command) {
  /**
   * Command = {
   *   name: <command_string>,
   *   help: <help text for the command>,
   *   setContext: <indicate if successful execution should set project context>,
   *   isAvailable: <function that indicates if this command is currently available>,
   *   options: {
   *     optionName: {
   *       help: <help text for the option>,
   *       mandatory: <indicates if this options is mandatory>
   *     }
   *   },
   *   handler: <function to be called when the command is run>
   * }
   */

  var funcName = 'Command Registrar';

  var defaults = _.merge({
    help: '',
    setContext: false,
    isAvailable: _.noop,
    options: {}
  }, command);

  if(!command.hasOwnProperty('name')) {
    console.error(funcName.yellow,
      'Failed to register command: Invalid Name'.red);
    return;
  }

  if(!command.hasOwnProperty('handler') || _.isUndefined(command.handler)) {
    console.error(funcName.yellow,
      'Failed to register command: Invalid Handler'.red);
    return;
  }

  commands[defaults.name] = defaults;
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

  jjcli.registerCommand({
    name: 'help',
    help: 'Show this help menu',
    handler: showHelp
  });

  jjcli.registerCommand({
    name: 'exit',
    help: 'Exit the console',
    handler: function() {
      rl.close();
    }
  });

  return cli;
};

module.exports = jjcli;
