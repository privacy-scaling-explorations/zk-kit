/* istanbul ignore file */

import { buildBn128 as _buildBn128 } from "ffjavascript"

/**
 * Builds and returns a BN 128 curve. If the curve has been cached,
 * it returns the cached curve.
 * @returns BN 128 ffjavascript curve.
 */
export default async function buildBn128(): Promise<any> {
    // @ts-ignore
    return globalThis.curve_bn128 ?? (await _buildBn128())
}
