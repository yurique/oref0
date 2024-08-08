import * as t from 'io-ts'

export interface BasalSchedule {
    i?: number
    start: string,
    minutes: number,
    rate: number
}

export const BasalSchedule: t.Type<BasalSchedule> = t.intersection([
    t.type({
        start: t.string,
        minutes: t.number,
        rate: t.number
    }),
    t.partial({
        i: t.number
    })
], 'BasalSchedule')


/**
 * {
    "max_iob": 14,
    "max_daily_safety_multiplier": 3,
    "current_basal_safety_multiplier": 4,
    "autosens_max": 1.3,
    "autosens_min": 0.7,
    "rewind_resets_autosens": true,
    "high_temptarget_raises_sensitivity": true,
    "low_temptarget_lowers_sensitivity": true,
    "sensitivity_raises_target": true,
    "resistance_lowers_target": false,
    "exercise_mode": false,
    "half_basal_exercise_target": 160,
    "maxCOB": 120,
    "skip_neutral_temps": false,
    "unsuspend_if_no_temp": false,
    "min_5m_carbimpact": 8,
    "autotune_isf_adjustmentFraction": 1,
    "remainingCarbsFraction": 1,
    "remainingCarbsCap": 90,
    "enableUAM": true,
    "A52_risk_enable": false,
    "enableSMB_with_COB": true,
    "enableSMB_with_temptarget": true,
    "enableSMB_always": false,
    "enableSMB_after_carbs": true,
    "allowSMB_with_high_temptarget": false,
    "maxSMBBasalMinutes": 90,
    "maxUAMSMBBasalMinutes": 120,
    "SMBInterval": 3,
    "bolus_increment": 0.05,
    "maxDelta_bg_threshold": 0.2,
    "curve": "ultra-rapid",
    "useCustomPeakTime": false,
    "insulinPeakTime": 55,
    "carbsReqThreshold": 1,
    "offline_hotspot": false,
    "noisyCGMTargetMultiplier": 1.3,
    "suspend_zeros_iob": false,
    "enableEnliteBgproxy": false,
    "calc_glucose_noise": false,
    "target_bg": false,
    "smb_delivery_ratio": 0.7,
    "adjustmentFactor": 0.7,
    "useNewFormula": true,
    "enableDynamicCR": true,
    "sigmoid": true,
    "weightPercentage": 0.65,
    "tddAdjBasal": true,
    "enableSMB_high_bg": true,
    "enableSMB_high_bg_target": 110,
    "threshold_setting": 65,
    "dia": 9,
    "model": "722",
    "current_basal": 0.7,
    "basalprofile": [
        {
            "rate": 0.7,
            "start": "00:00:00",
            "minutes": 0
        },
        {
            "rate": 0.7,
            "minutes": 180,
            "start": "03:00:00"
        },
        {
            "start": "09:00:00",
            "minutes": 540,
            "rate": 0.7
        }
    ],
    "max_daily_basal": 0.7,
    "max_basal": 3,
    "out_units": "mg/dL",
    "min_bg": 98,
    "max_bg": 98,
    "bg_targets": {
        "units": "mg/dL",
        "user_preferred_units": "mg/dL",
        "targets": [
            {
                "start": "00:00:00",
                "high": 98,
                "offset": 0,
                "low": 98,
                "max_bg": 98,
                "min_bg": 98
            }
        ]
    },
    "sens": 65,
    "isfProfile": {
        "user_preferred_units": "mg/dL",
        "units": "mg/dL",
        "sensitivities": [
            {
                "start": "00:00:00",
                "sensitivity": 65,
                "offset": 0,
                "endOffset": 1440
            }
        ]
    },
    "carb_ratio": 6.5,
    "carb_ratios": {
        "units": "grams",
        "schedule": [
            {
                "start": "00:00:00",
                "offset": 0,
                "ratio": 6
            },
            {
                "ratio": 5,
                "start": "08:30:00",
                "offset": 510
            },
            {
                "start": "11:30:00",
                "ratio": 6,
                "offset": 690
            },
            {
                "offset": 960,
                "ratio": 6.5,
                "start": "16:00:00"
            }
        ]
    }
}
 */

export interface CarbRatioSchedule {
    start: string
    offsset: number
    ratio: number
}

export const CarbRatioSchedule: t.Type<CarbRatioSchedule> = t.type({
    start: t.string,
    offsset: t.number,
    ratio: t.number,
}, 'CarbRatioSchedule')

export interface CarbRatios {
    units: string
    schedule: Array<CarbRatioSchedule>,
}

export const CarbRatios: t.Type<CarbRatios> = t.type({
    units: t.string,
    schedule: t.array(CarbRatioSchedule),
}, 'CarbRatios')

export type InsulineCurve = 'bilinear' | 'rapid-acting' | 'ultra-rapid'
export const InsulineCurve: t.Type<InsulineCurve> = t.keyof({
    'bilinear': null,
    'rapid-acting': null,
    'ultra-rapid': null,
}, 'InsulineCurve')


export interface ISFSensitivity {
    i?: number
    offset: number
    endOffset: number
    sensitivity: number
    start?: string
    x?: number
}

export const ISFSensitivity: t.Type<ISFSensitivity> = t.intersection([
    t.type({
        offset: t.number,
        endOffset: t.number,
        sensitivity: t.number,
    }),
    t.partial({
        i: t.number,
        start: t.string,
        x: t.number
    })
], 'ISFSensitivity')

export interface ISFProfile {
    sensitivities: Array<ISFSensitivity>
    units?: string
    user_preferred_units?: string
}

export const ISFProfile: t.Type<ISFProfile> = t.intersection([
    t.type({
        sensitivities: t.array(ISFSensitivity),
    }),
    t.partial({
        units: t.string,
        user_preferred_units: t.string
    })
], 'ISFProfile')

export type GlucoseUnits = 'mg/dL' | 'mmol/L'
export const GlucoseUnits = t.keyof({
    'mg/dL': null,
    'mmol/L': null,
}, 'GlucoseUnits')

export interface Profile {
    basalprofile: Array<BasalSchedule>
    sens: number
    carb_ratio: number
    min_5m_carbimpact: number
    out_units?: GlucoseUnits
    max_daily_safety_multiplier?: number
    current_basal_safety_multiplier?: number
    model?: string
    curve?: InsulineCurve
    dia?: number
    useCustomPeakTime?: boolean
    insulinPeakTime?: number
    remainingCarbsCap?: number
    remainingCarbsFraction?: number
    maxCOB?: number
    max_iob?: number
    min_bg?: number
    max_bg?: number
    A52_risk_enable?: boolean
    noisyCGMTargetMultiplier?: number
    maxRaw?: number
    low_temptarget_lowers_sensitivity?: boolean
    high_temptarget_raises_sensitivity?: boolean
    sensitivity_raises_target?: boolean
    resistance_lowers_target?: boolean
    autosens_max?: number
    allowSMB_with_high_temptarget?: boolean
    enableSMB_high_bg_target?: number
    enableSMB_with_temptarget?: boolean
    enableSMB_after_carbs?: boolean
    enableSMB_with_COB?: boolean
    enableSMB_high_bg?: boolean
    enableSMB_always?: boolean
    enableUAM?: boolean
    suspend_zeros_iob?: boolean
    current_basal?: number
    half_basal_exercise_target?: number
    exercise_mode?: boolean
    temptargetSet?: unknown
    max_daily_basal?: number
    max_basal?: number
    maxDelta_bg_threshold?: number
    bg_targets?: unknown
    isfProfile?: ISFProfile
    carb_ratios?: CarbRatios
    carbsReqThreshold?: number
    skip_neutral_temps?: boolean
    maxSMBBasalMinutes?: number
    maxUAMSMBBasalMinutes?: number
    bolus_increment?: number
    SMBInterval?: number
}

export const Profile: t.Type<Profile> = t.intersection([
    t.type({
        basalprofile: t.array(BasalSchedule),
        sens: t.number,
        carb_ratio: t.number,
        min_5m_carbimpact: t.number,
    }),
    t.partial({
        out_units: t.keyof({
            'mg/dL': null,
            'mmol/L': null,
        }),
        max_daily_safety_multiplier: t.number,
        current_basal_safety_multiplier: t.number,
        model: t.string,
        curve: InsulineCurve,
        dia: t.number,
        useCustomPeakTime: t.boolean,
        insulinPeakTime: t.number,
        remainingCarbsCap: t.number,
        remainingCarbsFraction: t.number,
        maxCOB: t.number,
        max_iob: t.number,
        min_bg: t.number,
        max_bg: t.number,
        A52_risk_enable: t.boolean,
        noisyCGMTargetMultiplier: t.number,
        maxRaw: t.number,
        low_temptarget_lowers_sensitivity: t.boolean,
        high_temptarget_raises_sensitivity: t.boolean,
        sensitivity_raises_target: t.boolean,
        resistance_lowers_target: t.boolean,
        autosens_max: t.number,
        allowSMB_with_high_temptarget: t.boolean,
        enableSMB_high_bg_target: t.number,
        enableSMB_with_temptarget: t.boolean,
        enableSMB_after_carbs: t.boolean,
        enableSMB_with_COB: t.boolean,
        enableSMB_high_bg: t.boolean,
        enableSMB_always: t.boolean,
        enableUAM: t.boolean,
        suspend_zeros_iob: t.boolean,
        current_basal: t.number,
        half_basal_exercise_target: t.number,
        exercise_mode: t.boolean,
        temptargetSet: t.unknown,
        max_daily_basal: t.number,
        max_basal: t.number,
        maxDelta_bg_threshold: t.number,
        bg_targets: t.unknown,
        isfProfile: ISFProfile,
        carb_ratios: CarbRatios,
        carbsReqThreshold: t.number,
        skip_neutral_temps: t.boolean,
        maxSMBBasalMinutes: t.number,
        maxUAMSMBBasalMinutes: t.number,
        bolus_increment: t.number,
        SMBInterval: t.number,
    })
], 'Profile');
