import { Schema } from '@effect/schema'
import * as O from 'effect/Order'
import { EventType } from './EventType'

export const TempType = Schema.Literal('absolute', 'percent')

export type TempType = typeof TempType.Type

export const PumpHistoryEvent = Schema.Struct({
    _type: EventType,
    timestamp: Schema.String,
    id: Schema.optional(Schema.String),
    amount: Schema.optional(Schema.Number),
    duration: Schema.optional(Schema.Number),
    'duration (min)': Schema.optional(Schema.Number),
    rate: Schema.optional(Schema.Number),
    temp: Schema.optional(TempType),
    carb_input: Schema.optional(Schema.Number),
    note: Schema.optional(Schema.String),
    isSMB: Schema.optional(Schema.Boolean),
    isExternal: Schema.optional(Schema.Boolean),
})

export type PumpHistoryEvent = typeof PumpHistoryEvent.Type

export const Order: O.Order<PumpHistoryEvent> = O.mapInput(O.Date, a => new Date(a.timestamp))
