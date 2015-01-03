#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> Helps create custom console based applications in Nodejs.


## Install

```sh
$ npm install --save jjcli
```


## Usage

```js
var cli = require('jjcli');

cli.initialize(options);

// Start the console and show prompt
cli.startConsole();
#>
```

###options
```
{
  name: 'Name of the console app',
  authorName: 'Owner of the console app',
  version: 'version of the console app',
  exitMessage: 'Message to be displayed when user quits the console app',
  prompt: 'Prompt to be displayed. Ex: `#>`'
}
```

All the options are optional and will be fetched from `package.json` if not provided.

## License

(MIT license)

Copyright (c) 2010 Bhagavan Nagaraju bhagavan@jigijigi.in

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[npm-url]: https://npmjs.org/package/jjcli
[npm-image]: https://badge.fury.io/js/jjcli.svg
[travis-url]: https://travis-ci.org/bhagn/jjcli
[travis-image]: https://travis-ci.org/bhagn/jjcli.svg?branch=master
[daviddm-url]: https://david-dm.org/bhagn/jjcli.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/bhagn/jjcli
