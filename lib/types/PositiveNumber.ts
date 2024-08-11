import { Schema } from '@effect/schema'

export const PositiveNumberBrand = Symbol.for('PositiveNumber')
export const PositiveNumber = Schema.Number.pipe(Schema.greaterThanOrEqualTo(0))
    .pipe(Schema.brand(PositiveNumberBrand))
    .annotations({
        identifier: 'PositiveInt',
        title: 'PositiveInt',
    })
export type PositiveNumber = typeof PositiveNumber.Type
