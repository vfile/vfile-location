/**
 * @import {Point as UnistPoint} from 'unist'
 * @import {VFile, Value} from 'vfile'
 * @import {Location} from 'vfile-location'
 */

const search = /\r?\n|\r/g

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

  search.lastIndex = 0

  while (search.test(value)) {
    indices.push(search.lastIndex)
  }

  indices.push(value.length + 1)

  return {toOffset, toPoint}

  /** @type {Location['toPoint']} */
  function toPoint(offset) {
    let index = -1

    if (
      typeof offset === 'number' &&
      offset > -1 &&
      offset < indices[indices.length - 1]
    ) {
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
    const line = point && point.line
    const column = point && point.column

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
