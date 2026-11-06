/**
 * @import {VFile, Value} from 'vfile'
 * @import {Location} from 'vfile-location'
 */

/**
 * Create an index of the given document to translate between line/column and
 * offset based positional info.
 *
 * Also implemented in Rust in [`wooorm/markdown-rs`][github-markdown-rs].
 *
 * [github-markdown-rs]: https://github.com/wooorm/markdown-rs/blob/main/src/util/location.rs
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

  /**
   * Get the line/column based `Point` for `offset`.
   *
   * @type {Location['toPoint']}
   */
  function toPoint(offset) {
    if (typeof offset === 'number' && offset > -1 && offset <= value.length) {
      let index = 0

      while (true) {
        let end = indices[index]

        if (end === undefined) {
          const eol = next(value, indices[index - 1])
          end = (eol === -1 ? value.length : eol) + 1
          indices[index] = end
        }

        if (end > offset) {
          return {
            line: index + 1,
            column: offset - (index > 0 ? indices[index - 1] : 0) + 1,
            offset
          }
        }

        index++
      }
    }
  }

  /**
   * Get the `offset` from a line/column based `Point`.
   *
   * @type {Location['toOffset']}
   */
  function toOffset(point) {
    if (
      point &&
      typeof point.line === 'number' &&
      typeof point.column === 'number' &&
      !Number.isNaN(point.line) &&
      !Number.isNaN(point.column)
    ) {
      while (indices.length < point.line) {
        const from = indices[indices.length - 1]
        const eol = next(value, from)
        const end = (eol === -1 ? value.length : eol) + 1
        if (from === end) break
        indices.push(end)
      }

      const offset =
        (point.line > 1 ? indices[point.line - 2] : 0) + point.column - 1
      // The given `column` could not exist on this line.
      if (offset < indices[point.line - 1]) return offset
    }
  }
}

/**
 * Find the next line ending.
 *
 * @param {string} value
 *   Value.
 * @param {number} from
 *   Index to search from.
 * @returns {number}
 *   Index of the next line ending, or `-1`.
 */
function next(value, from) {
  const cr = value.indexOf('\r', from)
  const lf = value.indexOf('\n', from)
  if (lf === -1) return cr
  if (cr === -1 || cr + 1 === lf) return lf
  return Math.min(cr, lf)
}
