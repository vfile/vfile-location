import assert from 'node:assert/strict'
import test from 'node:test'
import {location} from 'vfile-location'

test('location', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('vfile-location')).sort(), [
      'location'
    ])
  })

  await t.test('should expose `toOffset`', async function () {
    assert.equal(typeof location('').toOffset, 'function')
  })

  await t.test('should expose `toPoint` for `doc`', async function () {
    assert.equal(typeof location('').toOffset, 'function')
  })
})

test('toOffset(point)', async function (t) {
  const place = location('foo\nbar\nbaz')

  await t.test('should return `undefined` for no input', async function () {
    assert.equal(place.toOffset(), undefined)
  })

  await t.test(
    'should return `undefined` for invalid input (`undefined`)',
    async function () {
      assert.equal(
        place.toOffset({line: undefined, column: undefined}),
        undefined
      )
    }
  )

  await t.test(
    'should return `undefined` for invalid input (`null`)',
    async function () {
      assert.equal(place.toOffset({line: null, column: null}), undefined)
    }
  )

  await t.test('should return an offset (#1)', async function () {
    assert.equal(place.toOffset({line: 1, column: 1}), 0)
  })

  await t.test('should return an offset (#2)', async function () {
    assert.equal(place.toOffset({line: 2, column: 2}), 5)
  })

  await t.test('should return an offset (#3)', async function () {
    assert.equal(place.toOffset({line: 2, column: 4}), 7)
  })

  await t.test('should return an offset (#3)', async function () {
    assert.equal(place.toOffset({line: 3, column: 4}), 11)
  })

  await t.test(
    'should return `undefined` for out of bounds input (#1)',
    async function () {
      assert.equal(place.toOffset({line: 3, column: 5}), undefined)
    }
  )

  await t.test(
    'should return `undefined` for out of bounds input (#2)',
    async function () {
      assert.equal(place.toOffset({line: 4, column: 1}), undefined)
    }
  )

  await t.test('should support `0` for an empty document', async function () {
    assert.equal(location('').toOffset({line: 1, column: 1}), 0)
  })
})

test('toPoint(offset)', async function (t) {
  const place = location('foo\nbar\nbaz')

  await t.test('should return nothing for invalid input', async function () {
    assert.deepEqual(place.toPoint(-1), undefined)
  })

  await t.test('should return a point (#1)', async function () {
    assert.deepEqual(place.toPoint(0), {line: 1, column: 1, offset: 0})
  })

  await t.test('should return a point (#2)', async function () {
    assert.deepEqual(place.toPoint(11), {line: 3, column: 4, offset: 11})
  })

  await t.test(
    'should return `undefined` for out of bounds input',
    async function () {
      assert.deepEqual(place.toPoint(12), undefined)
    }
  )

  await t.test('should support `0` for an empty document', async function () {
    assert.deepEqual(location('').toPoint(0), {line: 1, column: 1, offset: 0})
  })
})

test('info surrounding EOF w/o EOL', async function (t) {
  const place = location('foo')

  await t.test('should return points', async function () {
    assert.deepEqual(
      [place.toPoint(3), place.toPoint(4), place.toPoint(5)],
      [{line: 1, column: 4, offset: 3}, undefined, undefined]
    )
  })

  await t.test('should return offsets', async function () {
    assert.deepEqual(
      [
        place.toOffset({line: 1, column: 4}),
        place.toOffset({line: 2, column: 1}),
        place.toOffset({line: 2, column: 2})
      ],
      [3, undefined, undefined]
    )
  })
})

test('info surrounding EOF w/ EOL', async function (t) {
  const place = location('foo\n')

  await t.test('should return points', async function () {
    assert.deepEqual(
      [place.toPoint(3), place.toPoint(4), place.toPoint(5)],
      [
        {line: 1, column: 4, offset: 3},
        {line: 2, column: 1, offset: 4},
        undefined
      ]
    )
  })

  await t.test('should return offsets', async function () {
    assert.deepEqual(
      [
        place.toOffset({line: 1, column: 4}),
        place.toOffset({line: 2, column: 1}),
        place.toOffset({line: 2, column: 2})
      ],
      [3, 4, undefined]
    )
  })
})

test('carriage returns', async function (t) {
  const place = location('foo\rbar')

  await t.test('should return points', async function () {
    assert.deepEqual(
      [place.toPoint(3), place.toPoint(4), place.toPoint(5)],
      [
        {line: 1, column: 4, offset: 3},
        {line: 2, column: 1, offset: 4},
        {line: 2, column: 2, offset: 5}
      ]
    )
  })

  await t.test('should return offsets', async function () {
    assert.deepEqual(
      [
        place.toOffset({line: 1, column: 4}),
        place.toOffset({line: 2, column: 1}),
        place.toOffset({line: 2, column: 2})
      ],
      [3, 4, 5]
    )
  })
})

test('carriage return + line feeds', async function (t) {
  const place = location('foo\r\nbar')

  await t.test('should return points', async function () {
    assert.deepEqual(
      [place.toPoint(3), place.toPoint(4), place.toPoint(5), place.toPoint(6)],
      [
        {line: 1, column: 4, offset: 3},
        {line: 1, column: 5, offset: 4},
        {line: 2, column: 1, offset: 5},
        {line: 2, column: 2, offset: 6}
      ]
    )
  })

  await t.test('should return offsets', async function () {
    assert.deepEqual(
      [
        place.toOffset({line: 1, column: 4}),
        place.toOffset({line: 2, column: 1}),
        place.toOffset({line: 2, column: 2})
      ],
      [3, 5, 6]
    )
  })
})

test('mixed carriage returns, carriage return + line feeds, and line feeds', async function (t) {
  await t.test('should return points', async function () {
    // Note: the lone cr and lf are swapped here compared to the other one.
    const place = location('foo\rbar\r\nbaz\nqux')

    assert.deepEqual(
      [
        place.toPoint(3), // `o`
        place.toPoint(4), // `\r`
        place.toPoint(5), // `b`
        // …
        place.toPoint(7), // `r`
        place.toPoint(8), // `\r`
        place.toPoint(9), // `\n`
        // …
        place.toPoint(12), // `z`
        place.toPoint(13) // `\n`
      ],
      [
        {line: 1, column: 4, offset: 3},
        {line: 2, column: 1, offset: 4},
        {line: 2, column: 2, offset: 5},
        {line: 2, column: 4, offset: 7},
        {line: 2, column: 5, offset: 8},
        {line: 3, column: 1, offset: 9},
        {line: 3, column: 4, offset: 12},
        {line: 4, column: 1, offset: 13}
      ]
    )
  })

  await t.test('should return offsets', async function () {
    // Note: the lone cr and lf are swapped here compared to the other one.
    const place = location('foo\nbar\r\nbaz\rqux')

    assert.deepEqual(
      [
        place.toOffset({line: 1, column: 4}), // `o`
        place.toOffset({line: 2, column: 1}), // `\n`
        place.toOffset({line: 2, column: 2}), // `b`
        // …
        place.toOffset({line: 2, column: 4}), // `r`
        place.toOffset({line: 2, column: 5}), // `\r`
        place.toOffset({line: 3, column: 1}), // `\n`
        // …
        place.toOffset({line: 3, column: 4}), // `z`
        place.toOffset({line: 4, column: 1}) // `\r`
      ],
      [3, 4, 5, 7, 8, 9, 12, 13]
    )
  })
})
