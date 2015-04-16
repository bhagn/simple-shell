'use strict';

(function(module) {
  var figlet = require('figlet');
  var readline = require('readline');
  var colors = require('colors');
  var _ = require('lodash');

  var pkg = null;
  try {
    pkg = require.main.require('./package.json');
  } catch(e) {
    pkg = require('./package.json');
  }


  var SimpleShell = require('inquirer');

  var commands = {};
  var options = {};
  var getCmd = /^[A-Z|a-z][A-Z|a-z|0-9|\s]*/;
  var getOptions = /\-\-[A-Z|a-z]+(\s[A-Z|a-z|0-9]+)?/g;


  function log() {
    console.log(arguments);
  }

  function info() {
    console.info(_.toArray(arguments).join(' ').blue);
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
    var completions = Object.keys(commands);
    var cmd = line.trim().match(getCmd);
    cmd = (cmd ? cmd[0] : '').trim();

    var hits = completions.filter(function(c) {
      return c.indexOf(line.trim()) === 0 ;
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
      ends = _.last(line.trim().split(' '));
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

  /**
   * Start the console and display the prompt.
   */
  function startConsole() {
    var prompt = (options.prompt || options.name || pkg.name) + '> ';

    rl.setPrompt(prompt.yellow, prompt.length);
    rl.prompt();

    rl.on('line', function(line) {
      if (!line.trim()) {
        rl.prompt();
        return;
      }

      var cmd = line.trim().match(getCmd)[0].trim();
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
      console.log((options.exitMessage || '\nGood bye!').green);
      process.exit();
    });
  }

  /**
   * Registers a command with the shell.
   *
   * @param {Object} command            The command configuration.
   * @param {String} command.name       Name of the command.
   * @param {String} command.help       Help string for the command.
   * @param {String} command.setContext Set the context to this string on
   *                                    successful execution of the command.
   * @param {Object} command.options    options that the command can take. These
   *                                    options will be presented as --optionName
   *
   * @param {String}  command.options.optionName   Name of the option.
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
     *   setContext: <indicate if successful execution should set project context>,
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

