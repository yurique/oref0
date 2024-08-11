import { Schema } from '@effect/schema'
import { PositiveNumber } from './PositiveNumber'

export const PositiveIntBrand = Symbol.for('PositiveInt')
export const PositiveInt = PositiveNumber.pipe(Schema.brand(PositiveIntBrand)).annotations({
    identifier: 'PositiveInt',
    title: 'PositiveInt',
})
export type PositiveInt = typeof PositiveInt.Type
