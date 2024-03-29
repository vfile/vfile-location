import assert from 'node:assert/strict'
import test from 'node:test'
import {VFile} from 'vfile'
import {location} from 'vfile-location'

test('location', async function () {
  assert.deepEqual(
    Object.keys(await import('vfile-location')).sort(),
    ['location'],
    'should expose the public api'
  )

  let place = location('')

  assert.equal(
    typeof place.toOffset,
    'function',
    'should expose `toOffset` for `doc`'
  )

  assert.equal(
    typeof place.toOffset,
    'function',
    'should expose `toPoint` for `doc`'
  )

  place = location(new VFile())

  assert.equal(
    typeof place.toOffset,
    'function',
    'should expose `toOffset` for `file`'
  )

  assert.equal(
    typeof place.toOffset,
    'function',
    'should expose `toPoint` for `file`'
  )
})

test('toOffset(point)', function () {
  const place = location('foo\nbar\nbaz')

  assert.equal(
    place.toOffset({line: undefined, column: undefined}),
    undefined,
    'should return `undefined` for invalid input'
  )

  assert.equal(
    place.toOffset({line: 4, column: 2}),
    undefined,
    'should return `undefined` for out of bounds input'
  )

  assert.equal(
    place.toOffset({line: 2, column: 2}),
    5,
    'should return an offset (#1)'
  )

  assert.equal(
    place.toOffset({line: 1, column: 1}),
    0,
    'should return an offset (#2)'
  )

  assert.equal(
    place.toOffset({line: 3, column: 4}),
    11,
    'should return an offset (#3)'
  )

  assert.equal(
    location('').toOffset({line: 1, column: 1}),
    0,
    'should support empty document'
  )
})

test('toPoint(offset)', function () {
  const place = location('foo\nbar\nbaz')

  assert.deepEqual(
    place.toPoint(-1),
    undefined,
    'should return nothing for invalid input'
  )

  assert.deepEqual(
    place.toPoint(12),
    undefined,
    'should return nothing for out of bounds input'
  )

  assert.deepEqual(
    place.toPoint(0),
    {line: 1, column: 1, offset: 0},
    'should return a point (#1)'
  )

  assert.deepEqual(
    place.toPoint(11),
    {line: 3, column: 4, offset: 11},
    'should return a point (#2)'
  )

  assert.deepEqual(
    location('').toPoint(0),
    {line: 1, column: 1, offset: 0},
    'should support empty document'
  )
})

test('other tests', function () {
  let place = location('foo')

  assert.deepEqual(
    [place.toPoint(3), place.toPoint(4), place.toPoint(5)],
    [{line: 1, column: 4, offset: 3}, undefined, undefined],
    'should return points for offsets around an EOF w/o EOLs'
  )

  assert.deepEqual(
    [
      place.toOffset({line: 1, column: 4}),
      place.toOffset({line: 2, column: 1}),
      place.toOffset({line: 2, column: 2})
    ],
    [3, undefined, undefined],
    'should return offsets for points around an EOF w/o EOLs'
  )

  place = location('foo\n')

  assert.deepEqual(
    [place.toPoint(3), place.toPoint(4), place.toPoint(5)],
    [
      {line: 1, column: 4, offset: 3},
      {line: 2, column: 1, offset: 4},
      undefined
    ],
    'should return points for offsets around an EOF EOL'
  )

  assert.deepEqual(
    [
      place.toOffset({line: 1, column: 4}),
      place.toOffset({line: 2, column: 1}),
      place.toOffset({line: 2, column: 2})
    ],
    [3, 4, undefined],
    'should return offsets for points around an EOF EOL'
  )

  place = location('foo\rbar')

  assert.deepEqual(
    [place.toPoint(3), place.toPoint(4), place.toPoint(5)],
    [
      {line: 1, column: 4, offset: 3},
      {line: 2, column: 1, offset: 4},
      {line: 2, column: 2, offset: 5}
    ],
    'should return points for offsets around carriage returns'
  )

  assert.deepEqual(
    [
      place.toOffset({line: 1, column: 4}),
      place.toOffset({line: 2, column: 1}),
      place.toOffset({line: 2, column: 2})
    ],
    [3, 4, 5],
    'should return offsets for points around carriage returns'
  )

  place = location('foo\r\nbar')

  assert.deepEqual(
    [place.toPoint(3), place.toPoint(4), place.toPoint(5), place.toPoint(6)],
    [
      {line: 1, column: 4, offset: 3},
      {line: 1, column: 5, offset: 4},
      {line: 2, column: 1, offset: 5},
      {line: 2, column: 2, offset: 6}
    ],
    'should return points for offsets around carriage returns + line feeds'
  )

  assert.deepEqual(
    [
      place.toOffset({line: 1, column: 4}),
      place.toOffset({line: 2, column: 1}),
      place.toOffset({line: 2, column: 2})
    ],
    [3, 5, 6],
    'should return offsets for points around carriage returns + line feeds'
  )
})
