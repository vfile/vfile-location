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
  let cr = -1
  let lf = -1

  return {toOffset, toPoint}

  /**
   * Add the next line to `indices`.
   *
   * @returns {undefined}
   *   Nothing.
   */
  function grow() {
    const from = indices.at(-1) ?? 0

    if (cr < from) {
      cr = value.indexOf('\r', from)
      if (cr === -1) cr = Infinity
    }

    if (lf < from) {
      lf = value.indexOf('\n', from)
      if (lf === -1) lf = Infinity
    }

    const eol = cr + 1 === lf ? lf : Math.min(cr, lf)
    indices.push((eol === Infinity ? value.length : eol) + 1)
  }

  /**
   * Get the line/column based `Point` for `offset`.
   *
   * @type {Location['toPoint']}
   */
  function toPoint(offset) {
    if (typeof offset === 'number' && offset > -1 && offset <= value.length) {
      while ((indices.at(-1) ?? 0) <= offset) grow()

      // Binary search for the first line that ends after `offset`.
      let low = 0
      let high = indices.length - 1

      while (low < high) {
        const middle = Math.floor((low + high) / 2)

        if (indices[middle] > offset) {
          high = middle
        } else {
          low = middle + 1
        }
      }

      return {
        line: low + 1,
        column: offset - (low > 0 ? indices[low - 1] : 0) + 1,
        offset
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
      // Excludes `NaN` too.
      point.column > 0
    ) {
      while (
        indices.length < point.line &&
        (indices.at(-1) ?? 0) <= value.length
      ) {
        grow()
      }

      const offset =
        (point.line > 1 ? indices[point.line - 2] : 0) + point.column - 1
      // The given `column` could not exist on this line.
      if (offset < indices[point.line - 1]) return offset
    }
  }
}
