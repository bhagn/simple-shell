#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> Helps create custom console based applications in Nodejs.


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
  name: 'Name of the console app',
  authorName: 'Owner of the console app',
  version: 'version of the console app',
  exitMessage: 'Message to be displayed when user quits the console app',
  prompt: 'Prompt to be displayed. Ex: `#>`. Default: `pkg.name>`'
}
```

All the options are optional and will be fetched from `package.json` if not provided.

### `cmdOptions`
```
{
  name: 'Name of the command',
  help: 'Help text for the command',
  options: {
    optionName: {
      help: <help text for the option>,
      required: <indicates if this options is mandatory>
    }
  },
  handler: <Function to be called when the command is run>
}
```
The handler function will be passed the `command` the user entered along with
an Object representing the options provided by the user. If an option doesn't
have a user defined value, it'll be set to a `Boolean` indicating the presence
of the option.

#### Example:
#> create project --name example --enable

This command will call the handler for `create project` command by passing in
the whole command and the following options:
```
{
  name: 'example',
  enable: true
}
```

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
