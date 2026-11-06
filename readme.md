# vfile-location

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]

[vfile][github-vfile] utility to convert between positional
(line and column-based) and offsets (range-based) locations.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`Location`](#location)
  * [`location(file)`](#locationfile)
* [Types](#types)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This is a tiny but useful package to convert between arbitrary places in a
file.

## When should I use this?

This utility is useful when AST nodes don’t cut it.
For example, when you are making a lint rule that looks for dangerous
characters in a file, which you accomplish by searching the raw file value,
and still want to report it to users.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+), install with [npm][npmjs-install]:

```sh
npm install vfile-location
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {location} from 'https://esm.sh/vfile-location@5?bundle'
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

### `Location`

Accessors for index.

###### Fields

* `toOffset` (`(point?: PointLike | null | undefined) => number | undefined`)
  — get the `offset` from a line/column based `Point` in the bound indices;
  returns `undefined` when given out of bounds input
* `toPoint` (`(offset?: number | null | undefined) => UnistPoint | undefined`)
  — get the line/column based `Point` for `offset` in the bound indices;
  returns `undefined` when given out of bounds input

### `location(file)`

Create an index of the given document to translate between line/column and
offset based positional info.

Also implemented in Rust in [`wooorm/markdown-rs`][github-markdown-rs].

[github-markdown-rs]: https://github.com/wooorm/markdown-rs/blob/main/src/util/location.rs

###### Parameters

* `file` (`VFile | Value`)
  — file to index

###### Returns

Accessors for index (`Location`).

## Types

This package is fully typed with [TypeScript][].
It exports the additional type [`Location`][api-location].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `vfile-location@^5`,
compatible with Node.js 16.

## Contribute

See
[`contributing.md`][health-contributing]
in
[`vfile/.github`][health]
for ways to get started.
See [`support.md`][health-support] for ways to get help.

This project has a [code of conduct][health-coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][file-license] © [Titus Wormer][wooorm]

<!-- Definitions -->

[api-location]: #location

[badge-build-image]: https://github.com/vfile/vfile-location/workflows/main/badge.svg

[badge-build-url]: https://github.com/vfile/vfile-location/actions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/vfile/vfile-location.svg

[badge-coverage-url]: https://codecov.io/github/vfile/vfile-location

[badge-downloads-image]: https://img.shields.io/npm/dm/vfile-location.svg

[badge-downloads-url]: https://www.npmjs.com/package/vfile-location

[badge-size-image]: https://img.shields.io/bundlejs/size/vfile-location

[badge-size-url]: https://bundlejs.com/?q=vfile-location

[esmsh]: https://esm.sh

[file-license]: license

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-vfile]: https://github.com/vfile/vfile

[health]: https://github.com/vfile/.github

[health-coc]: https://github.com/vfile/.github/blob/main/code-of-conduct.md

[health-contributing]: https://github.com/vfile/.github/blob/main/contributing.md

[health-support]: https://github.com/vfile/.github/blob/main/support.md

[npmjs-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

[wooorm]: https://wooorm.com
