import * as t from 'io-ts'

/**
 * Insulin curve.
 *
 * - `ultra-rapid`: Fiasp
 * - `rapid-acting`: Humalog
 * - `bilinear`: old curve
 */
export type InsulineCurve = 'bilinear' | 'rapid-acting' | 'ultra-rapid'
export const InsulineCurve: t.Type<InsulineCurve> = t.keyof(
    {
        bilinear: null,
        'rapid-acting': null,
        'ultra-rapid': null,
    },
    'InsulineCurve'
)
