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

# Start the console and show prompt
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

MIT © [Bhagavan Nagaraju]()


[npm-url]: https://npmjs.org/package/jjcli
[npm-image]: https://badge.fury.io/js/jjcli.svg
[travis-url]: https://travis-ci.org/bhagn/jjcli
[travis-image]: https://travis-ci.org/bhagn/jjcli.svg?branch=master
[daviddm-url]: https://david-dm.org/bhagn/jjcli.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/bhagn/jjcli
