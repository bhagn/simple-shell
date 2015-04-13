'use strict';

var figlet = require('figlet');
var readline = require('readline');
var colors = require('colors');
var safeColors = require('colors/safe');
var pkg = require.main.require('./package.json');
var S = require('string');
var _ = require('lodash');

var SimpleShell = require('inquirer');

var commands = {};
var getCmd = /^[A-Z|a-z][A-Z|a-z|0-9|\s]*/;
var getOptions = /\-\-[A-Z|a-z]+(\s[A-Z|a-z|0-9]+)?/g;

function completer(line) {
  var completions = Object.keys(commands);
  var cmd = line.trim().match(getCmd);
  cmd = (cmd ? cmd[0] : '').trim();

  var hits = completions.filter(function(c) {
    return c.indexOf(line) === 0 ;
  });

  var parts = cmd.split(' ');
  var ends = _.last(parts);
  if (parts.length > 1 && !commands[cmd]) {
    ends = _.last(parts);
    hits = _.map(hits, function(c) {
      return _.last(c.split(' '));
    });
  }


  if (commands[cmd]) {
    _.forEach(commands[cmd].options, function(config, op) {
      hits.push('--' + op);
    });
    ends = _.last(line.split(' '));
  }

  return [hits, ends || line];
}

function printHelp(cmdName) {
  var cmd = commands[cmdName];
  console.log(cmd.name.green);
  console.log('  ', cmd.help);
  for (var op in cmd.options) {
    console.log(_.padLeft(('\t--' + op).green, 10), ':', cmd.options[op].help);
  }
}

function helpHandler(line, options) {
  var cmd = line.trim() ? line.match(getCmd)[0].trim() : '';

  if (commands[cmd]) {
    printHelp(cmd);
    return;
  }

  var completions = completer(line);

  for (var i=0, len=completions[0].length; i < len; i++) {
    if (completions[0][i].indexOf('--') !== -1) {
      console.log('continue');
      continue;
    }

    var cmdName = line.replace(completions[1], completions[0][i]).trim();
    printHelp(cmdName);
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
    console.log(arguments);
  };

  this.info = function() {
    console.info(safeColors.blue(_.toArray(arguments).join(' ')));
  };

  this.warning = function() {
    console.warning(_.toArray(arguments).join(' ').orange);
  };

  this.error = function() {
    console.error(_.toArray(arguments).join(' ').red);
  };

  this.success = function() {
    console.log(_.toArray(arguments).join(' ').green);
  };

  this.startConsole = function() {

    var prompt = (_options.prompt || _options.name || pkg.name) + '> ';

    rl.setPrompt(prompt.yellow, prompt.length);
    rl.prompt();

    rl.on('line', function(line) {
      if (!line.trim()) {
        return;
      }

      var cmd = line.trim().match(getCmd)[0];
      var options = {};
      var askingHelp = _.endsWith(line.trim(), ' help') ||
        line.search(/(\s)*help$/) !== -1;

      if (askingHelp) {
        helpHandler(line.replace(/(\s)*help$/, ''));
        rl.prompt();
        return;
      }

      _.forEach(line.match(getOptions), function(option) {
        var parts = option.split(/\s+/);
        var _opName = parts[0].split('--')[1];
        var _opValue = parts[1] || true;

        options[_opName] = _opValue;
      });

      if(!commands[cmd]) {
        console.error('Unrecognized command: '.red, line);
      } else {
        commands[cmd].handler(colors.strip(line), options);
      }

      rl.prompt();
    });

    rl.on('close', function() {
      console.log((_options.exitMessage || '\nGood bye!').green);
      process.exit();
    });
  };
};

SimpleShell.registerCommand = function(command) {
  /**
   * Command = {
   *   name: <command_string>,
   *   help: <help text for the command>,
   *   setContext: <indicate if successful execution should set project context>,
   *   isAvailable: <function that indicates if this command is currently available>,
   *   options: {
   *     optionName: {
   *       help: <help text for the option>,
   *       required: <indicates if this options is mandatory>
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

  if(!command.hasOwnProperty('handler') || !_.isFunction(command.handler)) {
    console.error(funcName.yellow,
      'Failed to register command: Invalid Handler'.red);
    return;
  }

  commands[defaults.name] = defaults;
};

SimpleShell.initialize = function (options) {

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
      SimpleShell[attr] = cli[attr];
    }
  }

  SimpleShell.registerCommand({
    name: 'help',
    help: 'Show this help menu',
    handler: helpHandler
  });

  SimpleShell.registerCommand({
    name: 'exit',
    help: 'Exit the console',
    handler: function() {
      rl.close();
    }
  });

  return cli;
};

module.exports = SimpleShell;
