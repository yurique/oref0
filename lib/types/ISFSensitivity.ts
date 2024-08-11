import { Schema } from '@effect/schema'
import * as O from 'effect/Order'
import { ScheduleStart } from './ScheduleStart'

export const ISFSensitivity = Schema.Struct({
    offset: Schema.Number,
    endOffset: Schema.optional(Schema.Number),
    sensitivity: Schema.Number,
    i: Schema.optional(Schema.Number),
    start: Schema.optional(ScheduleStart),
    x: Schema.optional(Schema.Number),
})

export type ISFSensitivity = typeof ISFSensitivity.Type

export const Order: O.Order<ISFSensitivity> = O.combineAll([
    O.make<ISFSensitivity>((a, b) => O.number(Number(a), Number(b))),
    O.struct({
        //start: ScheduleStartOrder,
    }),
])
