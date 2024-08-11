import { Schema } from '@effect/schema'
import * as O from 'effect/Order'
import { PositiveInt } from './PositiveInt'
import { ScheduleStart } from './ScheduleStart'

export const BasalSchedule = Schema.Struct({
    i: Schema.optionalWith(Schema.Int, { exact: true }),
    start: Schema.optional(ScheduleStart),
    minutes: PositiveInt,
    rate: Schema.Number.pipe(Schema.greaterThanOrEqualTo(0)),
})

export type BasalSchedule = typeof BasalSchedule.Type

export const Order: O.Order<BasalSchedule> = O.combineAll([
    O.make<BasalSchedule>((a, b) => O.number(Number(a.i), Number(b.i))),
    O.struct({
        //start: ScheduleStartOrder,
    }),
])
