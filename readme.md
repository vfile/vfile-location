# vfile-location

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[vfile][] utility to convert between positional (line and column-based) and
offsets (range-based) locations.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`place = location(doc)`](#place--locationdoc)
    *   [`place.toOffset(point)`](#placetooffsetpoint)
    *   [`place.toPoint(offset)`](#placetopointoffset)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This is a tiny but useful package to convert between arbitrary places in a
file.

## When should I use this?

This utility is useful when ASTs nodes don’t cut it.
For example, when you are making a lint rule that looks for dangerous
characters in a file, which you accomplish by searching the raw file value,
and still want to report it to users.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, 16.0+, or 18.0+), install with [npm][]:

```sh
npm install vfile-location
```

In Deno with [`esm.sh`][esmsh]:

```js
import {location} from 'https://esm.sh/vfile-location@4'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {location} from 'https://esm.sh/vfile-location@4?bundle'
</script>
```

## Use

```js
import {VFile} from 'vfile'
import {location} from 'vfile-location'

const place = location(new VFile('foo\nbar\nbaz'))

const offset = place.toOffset({line: 3, column: 3}) // => 10
place.toPoint(offset) // => {line: 3, column: 3, offset: 10}
```

## API

This package exports the identifier `location`.
There is no default export.

### `place = location(doc)`

Index `doc` (`string` or [`VFile`][vfile]) and get functions for it.
Returns an object with [`toOffset`][to-offset] and [`toPoint`][to-point].

### `place.toOffset(point)`

Get the `offset` (`number`) for a line and column-based [`Point`][point] in the
bound file.
Returns `-1` when given invalid or out of bounds input.

### `place.toPoint(offset)`

Get the line and column-based [`Point`][point] for `offset` in the bound file.

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, 16.0+, and 18.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Contribute

See [`contributing.md`][contributing] in [`vfile/.github`][health] for ways to
get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/vfile/vfile-location/workflows/main/badge.svg

[build]: https://github.com/vfile/vfile-location/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/vfile/vfile-location.svg

[coverage]: https://codecov.io/github/vfile/vfile-location

[downloads-badge]: https://img.shields.io/npm/dm/vfile-location.svg

[downloads]: https://www.npmjs.com/package/vfile-location

[size-badge]: https://img.shields.io/bundlephobia/minzip/vfile-location.svg

[size]: https://bundlephobia.com/result?p=vfile-location

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/vfile/vfile/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[contributing]: https://github.com/vfile/.github/blob/main/contributing.md

[support]: https://github.com/vfile/.github/blob/main/support.md

[health]: https://github.com/vfile/.github

[coc]: https://github.com/vfile/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[vfile]: https://github.com/vfile/vfile

[to-offset]: #placetooffsetpoint

[to-point]: #placetopointoffset

[point]: https://github.com/syntax-tree/unist#point
