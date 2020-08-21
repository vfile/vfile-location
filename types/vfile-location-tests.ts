import vfileLocation = require('vfile-location')
import * as vfile from 'vfile'

// $ExpectError
vfileLocation()

vfileLocation(vfile('example'))
vfileLocation('example')

const location = vfileLocation('example')

location.toOffset({line: 1, column: 1})
// $ExpectError
location.toOffset(12)
// $ExpectError
location.toOffset({line: 1, column: 1, offset: 1})

location.toPoint(1)
// $ExpectError
location.toPoint({line: 1, column: 1})
