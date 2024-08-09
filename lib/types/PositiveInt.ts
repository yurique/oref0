import * as t from 'io-ts'
import type { PositiveNumberBrand } from './PositiveNumber'

export interface PositiveIntBrand extends PositiveNumberBrand {
    readonly PositiveInt: unique symbol
}

export type PositiveInt = t.Branded<t.Int, PositiveIntBrand>
export const PositiveInt = t.brand(t.Int, (n): n is PositiveInt => n >= 0, 'PositiveInt')
