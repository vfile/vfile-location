import {expectDeprecated, expectError, expectType} from 'tsd'
import {Point} from 'unist'
import vfileLocation = require('vfile-location')
import * as vfile from 'vfile'

expectError(vfileLocation())

vfileLocation(vfile('example'))
vfileLocation('example')

const location = vfileLocation('example')

expectType<number>(location.toOffset({line: 1, column: 1}))

expectError(location.toOffset(12))

expectError(location.toOffset({line: 1, column: 1, offset: 1}))

expectType<Required<Point>>(location.toPoint(1))

expectError(location.toPoint({line: 1, column: 1}))

expectDeprecated(location.toPosition)
