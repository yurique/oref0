import { Schema } from '@effect/schema'
import * as O from 'effect/Order'
import { ScheduleStart } from './ScheduleStart'

export const CarbRatioSchedule = Schema.Struct({
    i: Schema.optionalWith(Schema.Int, { exact: true }),
    start: Schema.optional(ScheduleStart),
    offset: Schema.Number,
    ratio: Schema.Number,
})

export type CarbRatioSchedule = typeof CarbRatioSchedule.Type

export const Order: O.Order<CarbRatioSchedule> = O.make<CarbRatioSchedule>((a, b) => O.number(Number(a.i), Number(b.i)))
