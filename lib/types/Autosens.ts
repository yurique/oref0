import { Schema } from '@effect/schema'

export const Autosens = Schema.Struct({
    timestamp: Schema.String,
    ratio: Schema.Number.pipe(Schema.greaterThanOrEqualTo(0)),
    newisf: Schema.optional(Schema.Number),
})

export type Autosens = typeof Autosens.Type
