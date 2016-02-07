// Dependencies:
var vfile = require('vfile');
var vfileLocation = require('./index.js');
var location = vfileLocation(vfile('foo\nbar\nbaz'));

// Using the methods:
var offset = location.toOffset({
    'line': 3,
    'column': 3
});
var position = location.toPosition(offset);

// Yields:
console.log('txt', String(offset));
console.log('json', JSON.stringify(position, 0, 2));
