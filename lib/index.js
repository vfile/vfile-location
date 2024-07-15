/**
 * @import {VFile, Value} from 'vfile'
 * @import {Location} from 'vfile-location'
 */

/**
 * Create an index of the given document to translate between line/column and
 * offset based positional info.
 *
 * Also implemented in Rust in [`wooorm/markdown-rs`][markdown-rs].
 *
 * [markdown-rs]: https://github.com/wooorm/markdown-rs/blob/main/src/util/location.rs
 *
 * @param {VFile | Value} file
 *   File to index.
 * @returns {Location}
 *   Accessors for index.
 */
export function location(file) {
  const value = String(file)
  /**
   * List, where each index is a line number (0-based), and each value is the
   * byte index *after* where the line ends.
   *
   * @type {Array<number>}
   */
  const indices = []
  let lastIndex = next(value, 0)

  while (lastIndex !== -1) {
    indices.push(lastIndex + 1)
    lastIndex = next(value, lastIndex + 1)
  }

  indices.push(value.length + 1)

  return {toOffset, toPoint}

  /** @type {Location['toPoint']} */
  function toPoint(offset) {
    let index = -1

    if (typeof offset === 'number' && offset > -1 && offset <= value.length) {
      while (++index < indices.length) {
        if (indices[index] > offset) {
          return {
            line: index + 1,
            column: offset - (index > 0 ? indices[index - 1] : 0) + 1,
            offset
          }
        }
      }
    }
  }

  /** @type {Location['toOffset']} */
  function toOffset(point) {
    const line = point ? point.line : undefined
    const column = point ? point.column : undefined

    if (
      typeof line === 'number' &&
      typeof column === 'number' &&
      !Number.isNaN(line) &&
      !Number.isNaN(column) &&
      line - 1 in indices
    ) {
      const offset = (indices[line - 2] || 0) + column - 1 || 0

      if (offset > -1 && offset < indices[indices.length - 1]) {
        return offset
      }
    }
  }
}

/**
 * @param {string} value
 * @param {number} from
 */
function next(value, from) {
  const cr = value.indexOf('\r', from)
  const lf = value.indexOf('\n', from)
  if (cr === -1 || cr + 1 === lf) return lf
  if (lf === -1) return cr
  return cr < lf ? cr : lf
}
