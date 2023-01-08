/**
 * Source definitely exists,
 * so it's merged with the possible slot
 *
 * @param {import("vue").Slot | undefined} slot
 * @param {any[]} source
 */
export function hMergeSlot(slot = undefined, source = []) {
  return slot !== undefined ? [...source, slot()] : source
}

/**
 * @param {import("vue").Slot | undefined} slot
 * @param {any} [otherwise]
 */
export function hSlot(slot = undefined, otherwise = undefined) {
  return slot !== undefined ? slot() || otherwise : otherwise
}

/**
 * @param {import("vue").Slot | undefined} slot
 * @param {Object} [scope]
 * @param {any} [otherwise]
 */
export function hScopedSlot(slot = undefined, scope = undefined, otherwise = undefined) {
  return slot !== undefined ? slot(scope) || otherwise : otherwise
}
