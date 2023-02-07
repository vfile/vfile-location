/**
 * @typedef {import('vfile').VFile} VFile
 *
 * @typedef Point
 * @property {number | undefined} line
 * @property {number | undefined} column
 * @property {number | undefined} [offset]
 */

/**
 * Get transform functions for the given `document`.
 *
 * @param {string|Uint8Array|VFile} file
 */
export function location(file) {
  const value = String(file)
  /** @type {Array<number>} */
  const indices = []
  const search = /\r?\n|\r/g

  while (search.test(value)) {
    indices.push(search.lastIndex)
  }

  indices.push(value.length + 1)

  return {toPoint, toOffset}

  /**
   * Get the line and column-based `point` for `offset` in the bound indices.
   * Returns a point with `undefined` values when given invalid or out of bounds
   * input.
   *
   * @param {number} offset
   * @returns {Point}
   */
  function toPoint(offset) {
    let index = -1

    if (offset > -1 && offset < indices[indices.length - 1]) {
      while (++index < indices.length) {
        if (indices[index] > offset) {
          return {
            line: index + 1,
            column: offset - (indices[index - 1] || 0) + 1,
            offset
          }
        }
      }
    }

    return {line: undefined, column: undefined, offset: undefined}
  }

  /**
   * Get the `offset` for a line and column-based `point` in the bound indices.
   * Returns `-1` when given invalid or out of bounds input.
   *
   * @param {Point} point
   * @returns {number}
   */
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

    return -1
  }
}
