'use strict';

(function(module) {
  var figlet = require('figlet'),
    readline = require('readline'),
    colors = require('colors'),
    SimpleShell = require('inquirer'),
    _ = require('lodash');

  var pkg = null;
  try {
    pkg = require.main.require('./package.json');
  } catch(e) {
    pkg = require('./package.json');
  }

  var commands = {},
    options = {},
    applicationContext = null,
    getCmd = /^[A-Z|a-z][A-Z|a-z|0-9|\s]*/,
    extractOptions = /(-{2}[a-zA-Z0-9\-]+\s*(([a-zA-Z0-9.\/\\?=\*&+_%$\[\]{}#!:@]|-{1}[a-zA-Z0-9.\/\\?=\*&+_%$\[\]{}#!:@])*\s*)*)/g;


  function log() {
    console.log(arguments);
  }

  function info() {
    console.info(colors.blue(_.toArray(arguments).join(' ')));
  }

  function warn() {
    console.warning(_.toArray(arguments).join(' ').orange);
  }

  function error() {
    console.error(_.toArray(arguments).join(' ').red);
  }

  function success() {
    console.log(_.toArray(arguments).join(' ').green);
  }

  function completer(line) {

    var cmd = line.trim().match(getCmd);
    cmd = (cmd ? cmd[0] : '').trim();

    var hits = [];

    _.forEach(commands, function(cmd, cmdName) {
      if (cmd.isAvailable(applicationContext) &&
        cmdName.indexOf(line.trim()) === 0) {
        hits.push(cmdName);
      }
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
      var lastOption = _.last(line.split(' ')).trim();
      var optionName = '';

      if (lastOption) {
        optionName = lastOption.split(/\s+/)[0].split('--')[1];
      }

      if (lastOption && !commands[cmd].options[optionName]) {
        _.forEach(commands[cmd].options, function(config, op) {
          var option = '--' + op;
          if (_.startsWith(option, lastOption)) {
            hits.push(option);
          }
        });
      } else {
        _.forEach(commands[cmd].options, function(config, op) {
          var option = '--' + op;

          if (line.indexOf(option) === -1) {
            hits.push(option + ' ');
          }
        });
      }
      ends = _.last(line.trim().split(' '));
    }

    return [hits, ends || line];
  }

  function printHelp(cmdName) {
    var cmd = commands[cmdName];
    console.log(cmd.name.green);
    console.log('  ', cmd.help.gray);
    for (var op in cmd.options) {
      //var required = cmd.options[op].required ? '[';
      console.log(_.padLeft(('\t--' + op).green, 10),
        ('[' + (cmd.options[op].required ? '*'.red: '?'.gray) + ']'),
        ':', cmd.options[op].help.gray);

      if(!_.isUndefined(cmd.options[op].defaultValue)) {
        console.log(_.padLeft('\t    Default value: ' + `${cmd.options[op].defaultValue}`.gray));
      }

      if (cmd.options[op].allowedValues && cmd.options[op].allowedValues.length > 0) {
        console.log(_.padLeft('\t    Allowed values: ' + cmd.options[op].allowedValues.join(', ').gray));
      }
    }
  }

  function helpHandler(line) {
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

  function getDefaultOptions(cmd) {
    var cmdOptions = {};

    if (_.isUndefined(commands[cmd])) {
      return cmdOptions;
    }

    _.forIn(commands[cmd].options, function(config, name) {
      if (!_.isUndefined(config.defaultValue)) {
        cmdOptions[name] = config.defaultValue;
      }
    });

    return cmdOptions;
  }

  /**
   * Start the console and display the prompt.
   */
  function startConsole() {
    var prompt = (options.prompt || options.name || pkg.name) + '> ';

    rl.setPrompt(prompt.yellow, prompt.length);
    rl.prompt();

    rl.on('line', function(line) {
      if (!line || !line.trim() || line && _.endsWith(line.trim(), '^C')) {
        rl.prompt();
        return;
      }

      var cmd = line.trim().match(getCmd)[0].trim();
      var askingHelp = _.endsWith(line.trim(), ' help') ||
        line.search(/(\s)*help$/) !== -1;

      if (askingHelp) {
        helpHandler(line.replace(/(\s)*help$/, ''));
        rl.prompt();
        return;
      }

      if (!commands[cmd] || !commands[cmd].isAvailable(applicationContext)) {
        console.error('Unrecognized command: '.red, line);
        rl.prompt();
        return;
      }

      var cmdOptions = getDefaultOptions(cmd);

      for (var i=0, len=commands[cmd]._required.length; i<len; i++) {
        var op = commands[cmd]._required[i];
        if (line.indexOf('--' + op) === -1) {
          console.error('Missing Option: '.red + '--' + op);
          rl.prompt();
          return;
        }
      }

      var missingOption = false;
      var notAllowed = false;
      _.forEach(line.match(extractOptions), function(option) {
        option = _.trim(option);
        var parts = option.split(/\s+/);
        var _opName = _.last(parts[0].split('--'));

        if (!_.isUndefined(commands[cmd].options[_opName])) {
          var _opValue = _.last(option.split(`${_opName} `)) || commands[cmd].options[_opName].defaultValue;

          if (commands[cmd].options[_opName].required && _.isUndefined(_opValue)) {
            missingOption = parts[0];
            return;
          }

          var allowed = commands[cmd].options[_opName].allowedValues || [];
          if (_opValue && !_.isEmpty(allowed) && allowed.indexOf(_opValue) === -1) {
            notAllowed = {
              name: _opName,
              values: allowed.join(', ')
            };
          }

          cmdOptions[_opName] = _opValue;
        }
      });

      if (missingOption) {
        console.error('Invalid value for Option: '.red + missingOption);
      } else if (notAllowed) {
        console.error('Invalid value for '.red + `--${notAllowed.name}`);
        console.log('Allowed values'.gray + ': ' + notAllowed.values);
      } else {
        var result = _.attempt(commands[cmd].handler, line, cmdOptions, applicationContext);

        if (!_.isError(result)) {
          applicationContext = commands[cmd].context || applicationContext;

          if (applicationContext) {
            var _prompt = (options.prompt || options.name || pkg.name) + '#' + applicationContext + '> ';
            rl.setPrompt(_prompt.yellow, _prompt.length);
          }
        } else {
          console.error(result.stack);
        }
      }

      rl.prompt();
    });

    rl.on('SIGINT', function() {
      // readline.cursorTo(process.stdout, 0);
      // readline.clearLine(process.stdout, 0);

      // // process.stdout.clearLine();
      rl.write('^C\n');

    });

    rl.on('close', function() {
      console.log((options.exitMessage || '\nGood bye!').green);
      process.exit();
    });

    process.on('uncaughtException', function(e) {
      console.log(e.stack.red);
      rl.prompt();
    });
  }

  /**
   * Registers a command with the shell.
   *
   * @param {Object} command               The command configuration.
   * @param {String} command.name          Name of the command.
   * @param {String} command.help          Help string for the command.
   * @param {String} command.context       Set the context to this string on
   *                                       successful execution of the command.
   * @param {Function} command.isAvailable Function that will be called to
   *                                       determine if the command is currently
   *                                       available for execution. This method
   *                                       will be passed the `context`.
   * @param {Object} command.options       options that the command can take.
   *                                       These options will be presented as
   *                                       `--optionName`
   *
   * @param {String}  command.options.optionName      Name of the option.
   * @param {String}  command.options.optionName.help Help string for option.
   * @param {Boolean} command.options.optionName.required
   * @param {String}  command.options.optionName.defaultValue Default value
   * @param {Array}   command.options.optionsName.allowedValues List of allowed
   *                                                            values for the
   *                                                            option.
   */
  function registerCommand(command) {
    /**
     * Command = {
     *   name: <command_string>,
     *   help: <help text for the command>,
     *   context: <indicate if successful execution should set project context>,
     *   isAvailable: <function that indicates if this command is currently available>,
     *   options: {
     *     optionName: {
     *       help: <help text for the option>,
     *       required: <indicates if this option is mandatory>,
     *       defaultValue: <default value to be used when user doesn't provide one>,
     *       allowedValues: <list of allowed values>
     *     }
     *   },
     *   handler: <function to be called when the command is run>
     * }
     */

    var funcName = 'Command Registrar';

    var _default = {
      help: '',
      context: false,
      isAvailable: _.negate(_.noop),
      options: {}
    };

    command = _.defaults(command, _default);

    command._required = [];
    _.forEach(command.options, function(op, name) {
      if (op.required) {
        command._required.push(name);
      }
    });

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

    commands[command.name] = command;
  }

  /**
   * Initialize the shell with app-specific options
   *
   * @param {Object} config         Application configuration options.
   * @param {String} config.name    Name of the application.
   * @param {String} config.author  Name of the author of the application.
   * @param {String} config.version Version of the application.
   */
  function initialize(config) {

    var options = config || {};

    var banner = figlet.textSync((options.name || pkg.name).toUpperCase(), {
      font: 'Small',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    });

    var meta = ['Copyright(c) ',
      (new Date().getFullYear()), ', ',
      (options.author || pkg.author.name),
      ' | Version: ',
      (options.version || pkg.version), '\n'].join('');

    console.log(banner.red);
    console.log(meta.gray);

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
  }

  SimpleShell.initialize = initialize;
  SimpleShell.registerCommand = registerCommand;
  SimpleShell.startConsole = startConsole;
  SimpleShell.log = log;
  SimpleShell.info = info;
  SimpleShell.warn = warn;
  SimpleShell.error = error;
  SimpleShell.success = success;

  module.exports = SimpleShell;

})(module);
