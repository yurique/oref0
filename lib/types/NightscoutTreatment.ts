import { Schema } from '@effect/schema'
import * as O from 'effect/Order'
import { EventType } from './EventType'
import { PumpHistoryEvent } from './PumpHistoryEvent'

export const NightscoutTreatment = Schema.Struct({
    eventType: EventType,
    created_at: Schema.String,
    id: Schema.optionalWith(Schema.String, { nullable: true }),
    duration: Schema.optionalWith(Schema.Number, { nullable: true }),
    rawDuration: Schema.optionalWith(PumpHistoryEvent, { nullable: true }),
    rawRate: Schema.optionalWith(PumpHistoryEvent, { nullable: true }),
    absolute: Schema.optionalWith(Schema.Number, { nullable: true }),
    rate: Schema.optionalWith(Schema.Number, { nullable: true }),
    enteredBy: Schema.optionalWith(Schema.String, { nullable: true }),
    bolus: Schema.optionalWith(PumpHistoryEvent, { nullable: true }),
    insulin: Schema.optionalWith(Schema.Number, { nullable: true }),
    notes: Schema.optionalWith(Schema.String, { nullable: true }),
    carbs: Schema.optionalWith(Schema.Number, { nullable: true }),
    fat: Schema.optionalWith(Schema.Number, { nullable: true }),
    protein: Schema.optionalWith(Schema.Number, { nullable: true }),
    foodType: Schema.optionalWith(Schema.String, { nullable: true }),
    targetTop: Schema.optionalWith(Schema.Number, { nullable: true }),
    targetBottom: Schema.optionalWith(Schema.Number, { nullable: true }),
    glucoseType: Schema.optionalWith(Schema.String, { nullable: true }),
    glucose: Schema.optionalWith(Schema.Number, { nullable: true }),
    units: Schema.optionalWith(Schema.String, { nullable: true }),
    fpuID: Schema.optionalWith(Schema.String, { nullable: true }),
    amount: Schema.optionalWith(Schema.Number, { nullable: true }),
}).annotations({
    identifier: 'NightscoutTreatment',
    title: 'Nightscout Treatment',
})

export type NightscoutTreatment = typeof NightscoutTreatment.Type

export const Order: O.Order<NightscoutTreatment> = O.mapInput(O.Date, a => new Date(a.created_at))
