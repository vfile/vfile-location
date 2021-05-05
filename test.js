import test from 'tape'
import {VFile} from 'vfile'
import {location} from './index.js'

test('location()', function (t) {
  var place = location('')

  t.equals(
    typeof place.toOffset,
    'function',
    'should expose `toOffset` for `doc`'
  )

  t.equals(
    typeof place.toOffset,
    'function',
    'should expose `toPoint` for `doc`'
  )

  place = location(new VFile())

  t.equals(
    typeof place.toOffset,
    'function',
    'should expose `toOffset` for `file`'
  )

  t.equals(
    typeof place.toOffset,
    'function',
    'should expose `toPoint` for `file`'
  )

  t.test('place.toOffset(point)', function (t) {
    var place = location('foo\nbar\nbaz')

    t.equals(place.toOffset({}), -1, 'should return `-1` for invalid input')

    t.equals(
      place.toOffset({line: 4, column: 2}),
      -1,
      'should return `-1` for out of bounds input'
    )

    t.equals(
      place.toOffset({line: 2, column: 2}),
      5,
      'should return an offset (#1)'
    )

    t.equals(
      place.toOffset({line: 1, column: 1}),
      0,
      'should return an offset (#2)'
    )

    t.equals(
      place.toOffset({line: 3, column: 4}),
      11,
      'should return an offset (#3)'
    )

    t.end()
  })

  t.test('place.toPoint(offset)', function (t) {
    var place = location('foo\nbar\nbaz')

    t.deepEquals(
      place.toPoint(-1),
      {},
      'should return an empty object for invalid input'
    )

    t.deepEquals(
      place.toPoint(12),
      {},
      'should return an empty object for out of bounds input'
    )

    t.deepEquals(
      place.toPoint(0),
      {line: 1, column: 1, offset: 0},
      'should return a point (#1)'
    )

    t.deepEquals(
      place.toPoint(11),
      {line: 3, column: 4, offset: 11},
      'should return a point (#2)'
    )

    t.end()
  })

  t.test('other tests', function (t) {
    var place = location('foo')

    t.deepEquals(
      [place.toPoint(3), place.toPoint(4), place.toPoint(5)],
      [{line: 1, column: 4, offset: 3}, {}, {}],
      'should return points for offsets around an EOF w/o EOLs'
    )

    t.deepEquals(
      [
        place.toOffset({line: 1, column: 4}),
        place.toOffset({line: 2, column: 1}),
        place.toOffset({line: 2, column: 2})
      ],
      [3, -1, -1],
      'should return offsets for points around an EOF w/o EOLs'
    )

    place = location('foo\n')

    t.deepEquals(
      [place.toPoint(3), place.toPoint(4), place.toPoint(5)],
      [{line: 1, column: 4, offset: 3}, {line: 2, column: 1, offset: 4}, {}],
      'should return points for offsets around an EOF EOL'
    )

    t.deepEquals(
      [
        place.toOffset({line: 1, column: 4}),
        place.toOffset({line: 2, column: 1}),
        place.toOffset({line: 2, column: 2})
      ],
      [3, 4, -1],
      'should return offsets for points around an EOF EOL'
    )

    place = location('foo\rbar')

    t.deepEquals(
      [place.toPoint(3), place.toPoint(4), place.toPoint(5)],
      [
        {line: 1, column: 4, offset: 3},
        {line: 2, column: 1, offset: 4},
        {line: 2, column: 2, offset: 5}
      ],
      'should return points for offsets around carriage returns'
    )

    t.deepEquals(
      [
        place.toOffset({line: 1, column: 4}),
        place.toOffset({line: 2, column: 1}),
        place.toOffset({line: 2, column: 2})
      ],
      [3, 4, 5],
      'should return offsets for points around carriage returns'
    )

    place = location('foo\r\nbar')

    t.deepEquals(
      [place.toPoint(3), place.toPoint(4), place.toPoint(5), place.toPoint(6)],
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
        place.toOffset({line: 1, column: 4}),
        place.toOffset({line: 2, column: 1}),
        place.toOffset({line: 2, column: 2})
      ],
      [3, 5, 6],
      'should return offsets for points around carriage returns + line feeds'
    )

    t.end()
  })

  t.end()
})
