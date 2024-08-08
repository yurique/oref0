import * as t from 'io-ts'

export const NightscoutEventType = t.keyof({
    'Temp Basal': null,
    'Carb Correction': null,
    'Temporary Target': null,
    'Insulin Change': null,
    'Site Change': null,
    'Pump Battery Change': null,
    Announcement: null,
    'Sensor Start': null,
    'BG Check': null,
    Exercise: null,
    'Bolus Wizard': null,
})

export const EventType = t.union([
    NightscoutEventType,
    t.keyof({
        Bolus: null,
        SMB: null,
        'External Insulin': null,
        'Meal Bolus': null,
        'Correction Bolus': null,
        'Snack Bolus': null,
        BolusWizard: null,
        TempBasal: null,
        TempBasalDuration: null,
        PumpSuspend: null,
        PumpResume: null,
        PumpAlarm: null,
        PumpBattery: null,
        Rewind: null,
        Prime: null,
        JournalEntryMealMarker: null,
        SuspendBasal: null,
    }),
    t.string,
])

export type EventType = t.TypeOf<typeof EventType>

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
