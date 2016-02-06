// Dependencies:
var range = require('./index.js');
var ranges = range('foo\nbar\nbaz');

// Using the methods:
var offset = ranges.toOffset({
    'line': 3,
    'column': 3
});
var position = ranges.toPosition(offset);

// Yields:
console.log('txt', String(offset));
console.log('json', JSON.stringify(position, 0, 2));
