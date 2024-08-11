import { Schema } from '@effect/schema'

export const TempTarget = Schema.Struct({
    created_at: Schema.Union(Schema.DateFromSelf, Schema.String.pipe(Schema.nonEmptyString())),
    duration: Schema.Number.pipe(Schema.greaterThanOrEqualTo(0)),
    targetTop: Schema.Int,
    targetBottom: Schema.Int,
}).annotations({
    title: 'TempTarget',
    description: 'Temp Target',
})

export type TempTarget = typeof TempTarget.Type

export const decode = Schema.decodeUnknownSync(TempTarget)
