'use strict';

var test = require('tape');
var vfile = require('vfile');
var vfileLocation = require('./');

test('location()', function (t) {
  var location = vfileLocation('');

  t.equals(
    typeof location.toOffset,
    'function',
    'should expose `toOffset` for `doc`'
  );

  t.equals(
    typeof location.toOffset,
    'function',
    'should expose `toPosition` for `doc`'
  );

  location = vfileLocation(vfile());

  t.equals(
    typeof location.toOffset,
    'function',
    'should expose `toOffset` for `file`'
  );

  t.equals(
    typeof location.toOffset,
    'function',
    'should expose `toPosition` for `file`'
  );

  t.test('location.toOffset(position)', function (st) {
    var location = vfileLocation('foo\nbar\nbaz');

    st.equals(
      location.toOffset({}),
      -1,
      'should return `-1` for invalid input'
    );

    st.equals(
      location.toOffset({line: 4, column: 2}),
      -1,
      'should return `-1` for out of bounds input'
    );

    st.equals(
      location.toOffset({line: 2, column: 2}),
      5,
      'should return an offset (#1)'
    );

    st.equals(
      location.toOffset({line: 1, column: 1}),
      0,
      'should return an offset (#2)'
    );

    st.equals(
      location.toOffset({line: 3, column: 4}),
      11,
      'should return an offset (#3)'
    );

    st.end();
  });

  t.test('location.toPosition(offset)', function (st) {
    var location = vfileLocation('foo\nbar\nbaz');

    st.deepEquals(
      location.toPosition(-1),
      {},
      'should return an empty object for invalid input'
    );

    st.deepEquals(
      location.toPosition(12),
      {},
      'should return an empty object for out of bounds input'
    );

    st.deepEquals(
      location.toPosition(0),
      {line: 1, column: 1, offset: 0},
      'should return a position (#1)'
    );

    st.deepEquals(
      location.toPosition(11),
      {line: 3, column: 4, offset: 11},
      'should return a position (#2)'
    );

    st.end();
  });

  t.end();
});
