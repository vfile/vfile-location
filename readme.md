# unist-range [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Convert between positions (line and column-based) and offsets
(range-based) locations in [unist][].

## Installation

[npm][npm-install]:

```bash
npm install unist-range
```

**unist-range** is also available as an AMD, CommonJS, and globals
module, [uncompressed and compressed][releases].

## Usage

Dependencies:

```javascript
var range = require('unist-range');
var ranges = range('foo\nbar\nbaz');
```

Using the methods:

```javascript
var offset = ranges.toOffset({
    'line': 3,
    'column': 3
});
var position = ranges.toPosition(offset);
```

Yields:

```txt
-1
```

```json
{}
```

## API

### `range = rangeFactory(doc)`

Partially apply the returned functions with `doc` or `file`.

**Signatures**:

*   `range = rangeFactory(file)`;
*   `range = rangeFactory(doc)`.

**Parameters**:

*   `file` ([`VFile`][vfile]);
*   `doc` (`string`).

**Returns**: `Object`:

*   `toOffset` ([`Function`][to-offset]);
*   `toPosition` ([`Function`][to-position]).

### `range.toOffset(position)`

Get the `offset` for a line and column-based `position` in the
bound file.

**Parameters**:

*   `position` ([`Position`][position]).

**Returns**: `number`. `-1` when given invalid or out of bounds input.

### `range.toPosition(offset)`

Get the line and column-based `position` for `offset` in the bound
file.

**Parameters**:

*   `offset` (`number`).

**Returns**: [`Position`][position]. An empty object when given
invalid or out of bounds input.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/unist-range.svg

[travis]: https://travis-ci.org/wooorm/unist-range

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/unist-range.svg

[codecov]: https://codecov.io/github/wooorm/unist-range

[npm-install]: https://docs.npmjs.com/cli/install

[releases]: https://github.com/wooorm/unist-range/releases

[license]: LICENSE

[author]: http://wooorm.com

[unist]: https://github.com/wooorm/unist

[position]: https://github.com/wooorm/unist#position

[vfile]: https://github.com/wooorm/vfile

[to-offset]: #rangetooffsetposition

[to-position]: #rangetopositionoffset
