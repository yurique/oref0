import { Schema } from '@effect/schema'
import { Positive } from '@effect/schema/Schema'
import { identity, String } from 'effect'
import { PositiveInt } from './PositiveInt'

export const GlucoseType = Schema.Union(Schema.Literal('sgv', 'cal'), Schema.String)
export type GlucoseType = typeof GlucoseType.Type

const DateFromDisplayTime = Schema.String.pipe(
    Schema.transform(Schema.DateFromString, {
        strict: true,
        decode: String.replace('T', ''),
        encode: identity,
    })
)
const DateNumber = Schema.Number.pipe(Schema.filter(s => Schema.is(Schema.DateFromNumber)(s) || 'invalid Date number'))
const DisplayTime = Schema.String.pipe(Schema.filter(s => Schema.is(DateFromDisplayTime)(s) || 'invalid Display Time'))
const DateString = Schema.String.pipe(Schema.filter(s => Schema.is(Schema.DateFromString)(s) || 'invalid Date string'))

export const GlucoseEntry = Schema.Struct({
    date: Schema.optional(DateNumber),
    display_time: Schema.optional(DisplayTime),
    dateString: Schema.optional(DateString),
    sgv: Schema.optional(PositiveInt),
    glucose: Schema.optional(Positive),
    type: Schema.optional(GlucoseType),
    device: Schema.optional(Schema.String),
    noise: Schema.optional(Schema.Number),
    xDrip_started_at: Schema.optional(Schema.Unknown),
}).annotations({
    title: 'GlucoseEntry',
    description: 'Glucose Entry',
})

export type GlucoseEntry = typeof GlucoseEntry.Type

export const getDate = (entry: GlucoseEntry): Date | undefined => {
    if (entry.date) {
        return Schema.decodeSync(Schema.DateFromNumber)(entry.date)
    } else if (entry.dateString) {
        return Schema.decodeSync(Schema.DateFromString)(entry.dateString)
    } else if (entry.display_time) {
        return Schema.decodeSync(DateFromDisplayTime)(entry.display_time)
    }

    return undefined
}
