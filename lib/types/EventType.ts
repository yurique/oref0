import * as t from 'io-ts'

export type NightscoutEventType =
    | 'Temp Basal'
    | 'Carb Correction'
    | 'Temporary Target'
    | 'Insulin Change'
    | 'Site Change'
    | 'Pump Battery Change'
    | 'Announcement'
    | 'Sensor Start'
    | 'BG Check'
    | 'Exercise'
    | 'Bolus Wizard'

export type EventType =
    | NightscoutEventType
    | 'Bolus'
    | 'SMB'
    | 'External Insulin'
    | 'Meal Bolus'
    | 'Correction Bolus'
    | 'Snack Bolus'
    | 'BolusWizard'
    | 'TempBasal'
    | 'TempBasalDuration'
    | 'PumpSuspend'
    | 'PumpResume'
    | 'PumpAlarm'
    | 'PumpBattery'
    | 'Rewind'
    | 'Prime'
    | 'JournalEntryMealMarker'
    | 'SuspendBasal'
    | string

export const NightscoutEventType: t.Type<NightscoutEventType> = t.keyof({
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

export const EventType: t.Type<EventType> = t.union([
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
