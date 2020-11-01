'use strict'

var test = require('tape')
var vfile = require('vfile')
var vfileLocation = require('.')

test('location()', function (t) {
  var location = vfileLocation('')

  t.equals(
    typeof location.toOffset,
    'function',
    'should expose `toOffset` for `doc`'
  )

  t.equals(
    typeof location.toOffset,
    'function',
    'should expose `toPoint` for `doc`'
  )

  location = vfileLocation(vfile())

  t.equals(
    typeof location.toOffset,
    'function',
    'should expose `toOffset` for `file`'
  )

  t.equals(
    typeof location.toOffset,
    'function',
    'should expose `toPoint` for `file`'
  )

  t.test('location.toOffset(point)', function (t) {
    var location = vfileLocation('foo\nbar\nbaz')

    t.equals(location.toOffset({}), -1, 'should return `-1` for invalid input')

    t.equals(
      location.toOffset({line: 4, column: 2}),
      -1,
      'should return `-1` for out of bounds input'
    )

    t.equals(
      location.toOffset({line: 2, column: 2}),
      5,
      'should return an offset (#1)'
    )

    t.equals(
      location.toOffset({line: 1, column: 1}),
      0,
      'should return an offset (#2)'
    )

    t.equals(
      location.toOffset({line: 3, column: 4}),
      11,
      'should return an offset (#3)'
    )

    t.end()
  })

  t.test('location.toPoint(offset)', function (t) {
    var location = vfileLocation('foo\nbar\nbaz')

    t.deepEquals(
      location.toPoint(-1),
      {},
      'should return an empty object for invalid input'
    )

    t.deepEquals(
      location.toPoint(12),
      {},
      'should return an empty object for out of bounds input'
    )

    t.deepEquals(
      location.toPoint(0),
      {line: 1, column: 1, offset: 0},
      'should return a point (#1)'
    )

    t.deepEquals(
      location.toPoint(11),
      {line: 3, column: 4, offset: 11},
      'should return a point (#2)'
    )

    t.end()
  })

  t.test('other tests', function (t) {
    var location = vfileLocation('foo')

    t.deepEquals(
      [location.toPoint(3), location.toPoint(4), location.toPoint(5)],
      [{line: 1, column: 4, offset: 3}, {}, {}],
      'should return points for offsets around an EOF w/o EOLs'
    )

    t.deepEquals(
      [
        location.toOffset({line: 1, column: 4}),
        location.toOffset({line: 2, column: 1}),
        location.toOffset({line: 2, column: 2})
      ],
      [3, -1, -1],
      'should return offsets for points around an EOF w/o EOLs'
    )

    location = vfileLocation('foo\n')

    t.deepEquals(
      [location.toPoint(3), location.toPoint(4), location.toPoint(5)],
      [{line: 1, column: 4, offset: 3}, {line: 2, column: 1, offset: 4}, {}],
      'should return points for offsets around an EOF EOL'
    )

    t.deepEquals(
      [
        location.toOffset({line: 1, column: 4}),
        location.toOffset({line: 2, column: 1}),
        location.toOffset({line: 2, column: 2})
      ],
      [3, 4, -1],
      'should return offsets for points around an EOF EOL'
    )

    location = vfileLocation('foo\rbar')

    t.deepEquals(
      [location.toPoint(3), location.toPoint(4), location.toPoint(5)],
      [
        {line: 1, column: 4, offset: 3},
        {line: 2, column: 1, offset: 4},
        {line: 2, column: 2, offset: 5}
      ],
      'should return points for offsets around carriage returns'
    )

    t.deepEquals(
      [
        location.toOffset({line: 1, column: 4}),
        location.toOffset({line: 2, column: 1}),
        location.toOffset({line: 2, column: 2})
      ],
      [3, 4, 5],
      'should return offsets for points around carriage returns'
    )

    location = vfileLocation('foo\r\nbar')

    t.deepEquals(
      [
        location.toPoint(3),
        location.toPoint(4),
        location.toPoint(5),
        location.toPoint(6)
      ],
      [
        {line: 1, column: 4, offset: 3},
        {line: 1, column: 5, offset: 4},
        {line: 2, column: 1, offset: 5},
        {line: 2, column: 2, offset: 6}
      ],
      'should return points for offsets around carriage returns + line feeds'
    )

    t.deepEquals(
      [
        location.toOffset({line: 1, column: 4}),
        location.toOffset({line: 2, column: 1}),
        location.toOffset({line: 2, column: 2})
      ],
      [3, 5, 6],
      'should return offsets for points around carriage returns + line feeds'
    )

    t.end()
  })

  t.end()
})
