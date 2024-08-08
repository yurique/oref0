import * as t from 'io-ts'
import { EventType, PumpHistoryEvent } from './PumpHistoryEvent'

export interface NightscoutTreatment {
    eventType: EventType
    created_at: string
    id?: string
    duration?: number
    rawDuration?: PumpHistoryEvent
    rawRate?: PumpHistoryEvent
    absolute?: number
    rate?: number
    enteredBy?: string
    bolus?: PumpHistoryEvent
    insulin?: number | null
    notes?: string
    carbs?: number | null
    fat?: number
    protein?: number
    foodType?: string
    targetTop?: number
    targetBottom?: number
    glucoseType?: string
    glucose?: number
    units?: string
    fpuID?: string
    // Loop Temp Basal: Loop reports the amount of insulin actually delivered while the temp basal was running
    amount?: number
}

export const NightscoutTreatment: t.Type<NightscoutTreatment> = t.intersection(
    [
        t.type({
            eventType: EventType,
            created_at: t.string,
        }),
        t.partial({
            id: t.string,
            duration: t.number,
            rawDuration: PumpHistoryEvent,
            rawRate: PumpHistoryEvent,
            absolute: t.number,
            rate: t.number,
            enteredBy: t.string,
            bolus: PumpHistoryEvent,
            insulin: t.union([t.number, t.null]),
            notes: t.string,
            carbs: t.union([t.number, t.null]),
            fat: t.number,
            protein: t.number,
            foodType: t.string,
            targetTop: t.number,
            targetBottom: t.number,
            glucoseType: t.union([t.literal('Finger'), t.string]),
            glucose: t.number,
            units: t.string,
            fpuID: t.string,
            // Loop Temp Basal: Loop reports the amount of insulin actually delivered while the temp basal was running
            amount: t.number,
        }),
    ],
    'NightscoutTreatment'
)
