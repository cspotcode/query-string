# query-string [![Build Status](https://travis-ci.org/cspotcode/query-string.svg?branch=master)](https://travis-ci.org/cspotcode/query-string)

> Parse and stringify URL [query strings](http://en.wikipedia.org/wiki/Query_string)

This is a fork of the original ([sindresorhus/query-string](https://github.com/sindresorhus/query-string)) that's
compatible with IE8.  Also, it uses a few jQuery methods in place of an ES5 polyfill, so you'll need jQuery. `stringify`
defers to `jQuery.param` so the behavior is slightly different.

---

## Install

```
$ npm install --save @cspotcode/query-string
```


## Usage

```js
const queryString = require('query-string');

console.log(location.search);
//=> '?foo=bar'

const parsed = queryString.parse(location.search);
console.log(parsed);
//=> {foo: 'bar'}

console.log(location.hash);
//=> '#token=bada55cafe'

const parsedHash = queryString.parse(location.hash);
console.log(parsedHash);
//=> {token: 'bada55cafe'}

parsed.foo = 'unicorn';
parsed.ilike = 'pizza';

location.search = queryString.stringify(parsed);

console.log(location.search);
//=> '?foo=unicorn&ilike=pizza'
```


## API

### .parse(*string*)

Parse a query string into an object. Leading `?` or `#` are ignored, so you can pass `location.search` or `location.hash` directly.

### .stringify(*object*)

Stringify an object into a query string, sorting the keys.

### .extract(*string*)

Extract a query string from a URL that can be passed into `.parse()`.


## Nesting

This module intentionally doesn't support nesting as it's not spec'd and varies between implementations, which causes a lot of [edge cases](https://github.com/visionmedia/node-querystring/issues).

You're much better off just converting the object to a JSON string:

```js
queryString.stringify({
	foo: 'bar',
	nested: JSON.stringify({
		unicorn: 'cake'
	})
});
//=> 'foo=bar&nested=%7B%22unicorn%22%3A%22cake%22%7D'
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com) and [Andrew Bradley](http://www.cspotcode.com)
