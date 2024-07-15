import type {Point as UnistPoint} from 'unist'

export {location} from './lib/index.js'

/**
 * Accessors for index.
 */
export interface Location {
  /**
   * Get the `offset` from a line/column based `Point` in the bound indices.
   */
  toOffset(point?: PointLike | null | undefined): number | undefined
  /**
   * Get the line/column based `Point` for `offset` in the bound indices.
   *
   * Returns `undefined` when given out of bounds input.
   *
   * Also implemented in Rust in [`wooorm/markdown-rs`][markdown-rs].
   *
   * [markdown-rs]: https://github.com/wooorm/markdown-rs/blob/main/src/util/location.rs
   */
  toPoint(offset?: number | null | undefined): UnistPoint | undefined
}

/**
 * Point from `unist`, allowed as input.
 */
interface PointLike {
  /**
   * Column.
   */
  column?: number | null | undefined
  /**
   * Line.
   */
  line?: number | null | undefined
  /**
   * Offset.
   */
  offset?: number | null | undefined
}
