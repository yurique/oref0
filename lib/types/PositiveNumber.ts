import * as t from 'io-ts'

export interface PositiveNumberBrand {
    readonly PositiveNumber: unique symbol
}

export type PositiveNumber = t.Branded<number, PositiveNumberBrand>
export const PositiveNumber = t.brand(t.number, (n): n is PositiveNumber => n >= 0, 'PositiveNumber')
