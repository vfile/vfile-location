/**
 * @import {VFile, Value} from 'vfile'
 * @import {Location} from 'vfile-location'
 */

const eol = /\r\n?|\n/g

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

  return {toOffset, toPoint}

  /** @type {Location['toPoint']} */
  function toPoint(offset) {
    if (typeof offset === 'number' && offset > -1 && offset <= value.length) {
      while (indices.length === 0 || indices[indices.length - 1] <= offset) {
        add()
      }

      // Find the first line that ends after `offset`.
      let index = 0
      let high = indices.length - 1

      while (index < high) {
        const middle = Math.floor((index + high) / 2)

        if (indices[middle] > offset) {
          high = middle
        } else {
          index = middle + 1
        }
      }

      return {
        line: index + 1,
        column: offset - (index > 0 ? indices[index - 1] : 0) + 1,
        offset
      }
    }
  }

  /** @type {Location['toOffset']} */
  function toOffset(point) {
    if (
      point &&
      typeof point.line === 'number' &&
      typeof point.column === 'number' &&
      !Number.isNaN(point.line) &&
      !Number.isNaN(point.column)
    ) {
      while (indices.length < point.line) {
        if (!add()) break
      }

      const offset =
        (point.line > 1 ? indices[point.line - 2] : 0) + point.column - 1
      // The given `column` could not exist on this line.
      if (offset < indices[point.line - 1]) return offset
    }
  }

  /**
   * Add the end of the next line to `indices`.
   *
   * @returns {boolean}
   *   Whether a line was added (`false` once the whole value is indexed).
   */
  function add() {
    const from = indices.length > 0 ? indices[indices.length - 1] : 0
    if (from > value.length) return false
    eol.lastIndex = from
    const match = eol.exec(value)
    indices.push(match ? match.index + match[0].length : value.length + 1)
    return true
  }
}
