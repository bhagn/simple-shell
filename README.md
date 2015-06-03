#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

Inspired by the Spring Roo project, this library provides a simple way to write custom application specific shells with the following features:
* Auto-complete commands
* Command options
* Sub commands
* Extends from [`inquirer`](https://www.npmjs.com/package/inquirer) module - thus making all the features of `inquirer` available to the shell instance for taking user input.
* Default `help` command which automatically prints help for all commands. Any command suffixed with help will display the help for that command.

## Install

```sh
$ npm install --save simple-shell
```


## Usage

```js
var shell = require('simple-shell');
shell.initialize(shellOptions);

// Register commands with the custom shell
shell.registerCommand(cmdOptions);

// Start the console and show prompt
shell.startConsole();

#>
```

### `shellOptions`
```
{
  name: <String>,
  authorName: <String>,
  version: <String>,
  exitMessage: <String>,
  prompt: <String>
}
```

* `name`: Name of the console application. default: `package.json:name`.
* `authorName`: Name of the author/Owner of the application. default: `package.json:author.name`.
* `version`: Versionof the application. default: `package.json:version`.
* `exitMessage`: Message to be displayed when user quits the console app. default: `Good Bye!`.
* `prompt`: Prompt to be displayed. Ex: `#>`. default: `package.json:name`.

All the options are optional and will be fetched from `package.json` if not provided.

### `cmdOptions`
```
{
  name: <String>,
  help: <String>,
  context: <String>,
  isAvailable: <Function>,
  options: {
    optionName: {
      help: <String>,
      required: <Boolean>,
      defaultValue: <String|Number|Boolean>,
      allowedValues: <Array>
    }
  },
  handler: <Function to be called when the command is run>
}
```

* `name`: Name of the command.
* `help`: Help string for the command that will be displayed when the user runs `help`.
* `context`: A string representing a context under which the command is running. If set, the application's context will be set to this string on successful execution of the command.
* `isAvailable(context)`: The function that will be called to determine if a command is available for execution. default: always returns `true`.
* `handler(cmd, options, context)`: The handler function that will be called to execute a command. If the command is not successful, it is expected to throw an `Error`. On successful execution of the command, the context will be set to `command.context`.
* `optionName`: Name of the option. This will be presented as `--optionName` to the user.
* `optionName.help`: Help string for the option.
* `optionName.required`: Indicates if the option is a mandatory option or not. default: `false`.
* `optionName.defaultValue`: The default value for an option if user doesn't provide one.
* `optionName.allowerValues`: A list of valid values for the option.

#### Pending documentation..

## License

(MIT license)

Copyright (c) 2010 Bhagavan Nagaraju bhagavan@jigijigi.in

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[npm-url]: https://npmjs.org/package/simple-shell
[npm-image]: https://badge.fury.io/js/simple-shell.svg
[travis-url]: https://travis-ci.org/bhagn/simple-shell
[travis-image]: https://travis-ci.org/bhagn/simple-shell.svg?branch=master
[daviddm-url]: https://david-dm.org/bhagn/simple-shell.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/bhagn/simple-shell
