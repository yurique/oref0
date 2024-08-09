import * as t from 'io-ts'
import { EventType } from './EventType'

export const TempType = t.keyof({
    absolute: null,
    percent: null,
})

export type TempType = t.TypeOf<typeof TempType>

const PumpEventBase = t.type({
    _type: EventType,
    timestamp: t.string,
})

export const PumpHistoryEvent = t.intersection([
    PumpEventBase,
    t.partial({
        id: t.string,
        amount: t.number,
        duration: t.number,
        'duration (min)': t.number,
        rate: t.number,
        temp: TempType,
        carb_input: t.number,
        note: t.string,
        isSMB: t.boolean,
        isExternal: t.boolean,
        // @todo: check: used in iob/history
        //date: t.number,
    }),
])

export interface PumpHistoryEvent {
    _type: EventType
    timestamp: string
    id?: string
    amount?: number
    duration?: number
    'duration (min)'?: number
    rate?: number
    temp?: TempType
    carb_input?: number
    note?: string
    isSMB?: boolean
    isExternal?: boolean
    // @todo: check: used in iob/history
    //date?: number,
}

export type PumpHistoryEvent2 = t.TypeOf<typeof PumpHistoryEvent>
