/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module unist:range
 * @fileoverview Test suite for `unist-range`.
 */

'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var test = require('tape');
var vfile = require('vfile');
var range = require('./index.js');

/*
 * Tests.
 */

test('range()', function (t) {
    var ranges = range('');

    t.equals(
        typeof ranges.toOffset,
        'function',
        'should expose `toOffset` for `doc`'
    );

    t.equals(
        typeof ranges.toOffset,
        'function',
        'should expose `toPosition` for `doc`'
    );

    ranges = range(vfile());

    t.equals(
        typeof ranges.toOffset,
        'function',
        'should expose `toOffset` for `file`'
    );

    t.equals(
        typeof ranges.toOffset,
        'function',
        'should expose `toPosition` for `file`'
    );

    t.test('range.toOffset(position)', function (st) {
        var ranges = range('foo\nbar\nbaz');

        st.equals(
            ranges.toOffset({}),
            -1,
            'should return `-1` for invalid input'
        );

        st.equals(
            ranges.toOffset({
                'line': 4,
                'column': 2
            }),
            -1,
            'should return `-1` for out of bounds input'
        );

        st.equals(
            ranges.toOffset({
                'line': 2,
                'column': 2
            }),
            5,
            'should return an offset (#1)'
        );

        st.equals(
            ranges.toOffset({
                'line': 1,
                'column': 1
            }),
            0,
            'should return an offset (#2)'
        );

        st.end();
    });

    t.test('range.toPosition(offset)', function (st) {
        var ranges = range('foo\nbar\nbaz');

        st.deepEquals(
            ranges.toPosition(-1),
            {},
            'should return an empty object for invalid input'
        );

        st.deepEquals(
            ranges.toPosition(12),
            {},
            'should return an empty object for out of bounds input'
        );

        st.deepEquals(
            ranges.toPosition(0),
            {
                'line': 1,
                'column': 1,
                'offset': 0
            },
            'should return a position (#1)'
        );

        st.deepEquals(
            ranges.toPosition(11),
            {
                'line': 3,
                'column': 4,
                'offset': 11
            },
            'should return a position (#2)'
        );

        st.end();
    });

    t.end();
});
