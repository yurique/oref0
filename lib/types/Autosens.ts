import { Schema } from '@effect/schema'
import * as O from 'effect/Order'

export const Autosens = Schema.Struct({
    timestamp: Schema.String,
    ratio: Schema.Number.pipe(Schema.greaterThanOrEqualTo(0)),
    newisf: Schema.optional(Schema.Number),
})

export type Autosens = typeof Autosens.Type

export const Order: O.Order<Autosens> = O.struct({
    timestamp: (a, b) => O.Date(new Date(a.timestamp), new Date(b.timestamp)),
})
