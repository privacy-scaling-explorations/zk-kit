/**
 * Pads the array with a new value (multiple times, if needed) until the resulting
 * array reaches the given length.
 * @param array The array to pad.
 * @param length The length of the resulting array.
 * @param value The value to pad the array with.
 * @returns An array of the specified length with the new values at the end.
 */
// eslint-disable-next-line import/prefer-default-export
export function padArrayEnd(array: any[], length: number, value: any): any[] {
  return Array.from({ ...array, length }, (v) => v ?? value)
}
