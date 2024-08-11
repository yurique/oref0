import { Schema } from '@effect/schema'
import { EventType } from './EventType'
import { PumpHistoryEvent } from './PumpHistoryEvent'

export const NightscoutTreatment = Schema.Struct({
    eventType: EventType,
    created_at: Schema.String,
    id: Schema.optional(Schema.String),
    duration: Schema.optional(Schema.Number),
    rawDuration: Schema.optional(PumpHistoryEvent),
    rawRate: Schema.optional(PumpHistoryEvent),
    absolute: Schema.optional(Schema.Number),
    rate: Schema.optional(Schema.Number),
    enteredBy: Schema.optional(Schema.String),
    bolus: Schema.optional(PumpHistoryEvent),
    insulin: Schema.optionalWith(Schema.Number, { nullable: true }),
    notes: Schema.optional(Schema.String),
    carbs: Schema.optionalWith(Schema.Number, { nullable: true }),
    fat: Schema.optional(Schema.Number),
    protein: Schema.optional(Schema.Number),
    foodType: Schema.optional(Schema.String),
    targetTop: Schema.optional(Schema.Number),
    targetBottom: Schema.optional(Schema.Number),
    glucoseType: Schema.optional(Schema.String),
    glucose: Schema.optional(Schema.Number),
    units: Schema.optional(Schema.String),
    fpuID: Schema.optional(Schema.String),
    amount: Schema.optional(Schema.Number),
}).annotations({
    identifier: 'NightscoutTreatment',
    title: 'Nightscout Treatment',
})

export type NightscoutTreatment = typeof NightscoutTreatment.Type
