import type { NonEmptyArray } from 'fp-ts/NonEmptyArray'
import * as t from 'io-ts'
import { fromNullable } from 'io-ts-types/fromNullable'
import { nonEmptyArray } from 'io-ts-types/nonEmptyArray'
import { BasalSchedule } from './BasalSchedule'
import { GlucoseUnit } from './GlucoseUnit'
import { InsulineCurve } from './InsulineCurve'
import { PositiveInt } from './PositiveInt'
import { PositiveNumber } from './PositiveNumber'

interface PumpSettings {
    insulin_action_curve?: PositiveNumber
}

const PumpSettings = t.partial({
    insulin_action_curve: t.refinement(PositiveNumber, a => a > 1, 'PositiveNumber(> 1)'),
})

interface Targets {
    user_preferred_units: GlucoseUnit
}

const Targets = t.type({
    user_preferred_units: GlucoseUnit,
})

export interface Preferences {
    [k: string]: unknown
    max_iob: PositiveInt
    max_daily_safety_multiplier: PositiveNumber
    current_basal_safety_multiplier: PositiveNumber
    autosens_max: PositiveNumber
    autosens_min: PositiveNumber
    rewind_resets_autosens: boolean
    /** raise sensitivity for temptargets >= 101.  synonym for exercise_mode */
    high_temptarget_raises_sensitivity: boolean
    /** lower sensitivity for temptargets <= 99. */
    low_temptarget_lowers_sensitivity: boolean
    /** raise BG target when autosens detects sensitivity */
    sensitivity_raises_target: boolean
    /** lower BG target when autosens detects resistance */
    resistance_lowers_target: boolean
    /** when true, > 100 mg/dL high temp target adjusts sensitivityRatio for exercise_mode. This majorly changes the behavior of high temp targets from before. synonmym for high_temptarget_raises_sensitivity */
    exercise_mode: boolean
    half_basal_exercise_target: PositiveInt
    /**
     * Max carbs absorbed in 4 hours.
     *
     * Default to 120 because that's the most a typical body can absorb over 4 hours.
     *
     * If someone enters more carbs or stacks more; OpenAPS will just truncate dosing based on 120.
     * Essentially, this just limits AMA/SMB as a safety cap against excessive COB entry.
     */
    maxCOB: PositiveInt
    /** if true, don't set neutral temps */
    skip_neutral_temps: boolean
    /** if true, pump will un-suspend after a zero temp finishes */
    unsuspend_if_no_temp: boolean
    /** bolus snooze decays after 1/2 of DIA */
    bolussnooze_dia_divisor: PositiveInt
    /** mg/dL per 5m (8 mg/dL/5m corresponds to 24g/hr at a CSF of 4 mg/dL/g (x/5*60/4)) */
    min_5m_carbimpact: PositiveInt
    /** keep autotune ISF closer to pump ISF via a weighted average of fullNewISF and pumpISF.  1.0 allows full adjustment, 0 is no adjustment from pump ISF. */
    autotune_isf_adjustmentFraction: PositiveNumber
    /** fraction of carbs we'll assume will absorb over 4h if we don't yet see carb absorption */
    remainingCarbsFraction: PositiveNumber
    /** max carbs we'll assume will absorb over 4h if we don't yet see carb absorption */
    remainingCarbsCap: PositiveInt
    /** Enable detection of unannounced meal carb absorption */
    enableUAM: boolean
    A52_risk_enable: boolean
    /** Enable supermicrobolus while COB is positive */
    enableSMB_with_COB: boolean
    /** Enable supermicrobolus for eating soon temp targets */
    enableSMB_with_temptarget: boolean
    /**
     * Always enable supermicrobolus (unless disabled by high temptarget).
     *
     * **WARNING**
     * DO NOT USE enableSMB_always or enableSMB_after_carbs with Libre or similar
     *
     * LimiTTer, etc. do not properly filter out high-noise SGVs.  xDrip+ builds greater than or equal to
     * version number d8e-7097-2018-01-22 provide proper noise values, so that oref0 can ignore high noise
     * readings, and can temporarily raise the BG target when sensor readings have medium noise,
     * resulting in appropriate SMB behaviour.  Older versions of xDrip+ should not be used with enableSMB_always.
     * Using SMB overnight with such data sources risks causing a dangerous overdose of insulin
     * if the CGM sensor reads falsely high and doesn't come down as actual BG does
     */
    enableSMB_always: boolean
    /**
     * Enable supermicrobolus for 6h after carbs, even with 0 COB.
     *
     * **WARNING**
     * DO NOT USE enableSMB_always or enableSMB_after_carbs with Libre or similar.
     */
    enableSMB_after_carbs: boolean
    /** Enable SMBs when a high BG is detected, based on the high BG target (adjusted or profile) */
    enableSMB_high_bg: boolean
    /** Set the value enableSMB_high_bg will compare against to enable SMB. If BG > than this value, SMBs should enable. */
    enableSMB_high_bg_target: PositiveInt
    /** Allow supermicrobolus (if otherwise enabled) even with high temp targets */
    allowSMB_with_high_temptarget: boolean
    /** maximum minutes of basal that can be delivered as a single SMB with uncovered COB */
    maxSMBBasalMinutes: PositiveInt
    /** maximum minutes of basal that can be delivered as a single SMB when IOB exceeds COB */
    maxUAMSMBBasalMinutes: PositiveInt
    /** minimum interval between SMBs, in minutes. */
    SMBInterval: PositiveInt
    /** minimum bolus that can be delivered as an SMB */
    bolus_increment: PositiveNumber
    /** maximum change in bg to use SMB, above that will disable SMB */
    maxDelta_bg_threshold: PositiveNumber
    /** Insulin curve. */
    curve: InsulineCurve
    /** allows changing insulinPeakTime */
    useCustomPeakTime: boolean
    /**
     * Number of minutes after a bolus activity peaks.
     * Defaults to 55m for Fiasp if useCustomPeakTime: boolean
     */
    insulinPeakTime: PositiveInt
    /** grams of carbsReq to trigger a pushover */
    carbsReqThreshold: PositiveInt
    /** enabled an offline-only local wifi hotspot if no Internet available */
    offline_hotspot: boolean
    /** increase target by this amount when looping off raw/noisy CGM data */
    noisyCGMTargetMultiplier: PositiveNumber
    /** recognize pump suspends as non insulin delivery events */
    suspend_zeros_iob: boolean
    /**
     * Send the glucose data to the pump emulating an enlite sensor.
     * This allows to setup high / low warnings when offline and see trend.
     *
     * To enable this feature, enable the sensor, set a sensor with id 0000000,
     * go to start sensor and press find lost sensor.
     */
    enableEnliteBgproxy: boolean
    calc_glucose_noise: boolean
    /** set to an integer value in mg/dL to override pump min_bg */
    target_bg: boolean
    edison_battery_shutdown_voltage: PositiveInt
    pi_battery_shutdown_percent: PositiveInt
    // no defaults
    model?: string
    settings: PumpSettings
    basals: NonEmptyArray<BasalSchedule>
    targets: Targets
}

/**
 * @todo: should we parse numbers from strings?
 */
export const Preferences: t.Type<Preferences, unknown> = t.intersection(
    [
        t.record(t.string, t.unknown),
        t.type({
            max_iob: fromNullable(PositiveInt, 0 as PositiveInt),
            max_daily_safety_multiplier: fromNullable(PositiveNumber, 3 as PositiveNumber),
            current_basal_safety_multiplier: fromNullable(PositiveNumber, 3 as PositiveNumber),
            autosens_max: fromNullable(PositiveNumber, 1.2 as PositiveNumber),
            autosens_min: fromNullable(PositiveNumber, 0.7 as PositiveNumber),
            rewind_resets_autosens: fromNullable(t.boolean, true),
            high_temptarget_raises_sensitivity: fromNullable(t.boolean, false),
            low_temptarget_lowers_sensitivity: fromNullable(t.boolean, false),
            sensitivity_raises_target: fromNullable(t.boolean, true),
            resistance_lowers_target: fromNullable(t.boolean, false),
            exercise_mode: fromNullable(t.boolean, false),
            half_basal_exercise_target: fromNullable(PositiveInt, 160 as PositiveInt),
            maxCOB: fromNullable(PositiveInt, 120 as PositiveInt),
            skip_neutral_temps: fromNullable(t.boolean, false),
            unsuspend_if_no_temp: fromNullable(t.boolean, false),
            bolussnooze_dia_divisor: fromNullable(PositiveInt, 2 as PositiveInt),
            min_5m_carbimpact: fromNullable(PositiveInt, 8 as PositiveInt),
            autotune_isf_adjustmentFraction: fromNullable(PositiveNumber, 1.0 as PositiveNumber),
            remainingCarbsFraction: fromNullable(PositiveNumber, 1.0 as PositiveNumber),
            remainingCarbsCap: fromNullable(PositiveInt, 90 as PositiveInt),
            enableUAM: fromNullable(t.boolean, true),
            A52_risk_enable: fromNullable(t.boolean, false),
            enableSMB_with_COB: fromNullable(t.boolean, false),
            enableSMB_with_temptarget: fromNullable(t.boolean, false),
            enableSMB_always: fromNullable(t.boolean, false),
            enableSMB_after_carbs: fromNullable(t.boolean, false),
            enableSMB_high_bg: fromNullable(t.boolean, false),
            enableSMB_high_bg_target: fromNullable(PositiveInt, 110 as PositiveInt),
            allowSMB_with_high_temptarget: fromNullable(t.boolean, false),
            maxSMBBasalMinutes: fromNullable(PositiveInt, 30 as PositiveInt),
            maxUAMSMBBasalMinutes: fromNullable(PositiveInt, 30 as PositiveInt),
            SMBInterval: fromNullable(PositiveInt, 3 as PositiveInt),
            bolus_increment: fromNullable(PositiveNumber, 0.1 as PositiveNumber),
            maxDelta_bg_threshold: fromNullable(PositiveNumber, 0.2 as PositiveNumber),
            curve: fromNullable(InsulineCurve, 'rapid-acting'),
            useCustomPeakTime: fromNullable(t.boolean, false),
            insulinPeakTime: fromNullable(PositiveInt, 75 as PositiveInt),
            carbsReqThreshold: fromNullable(PositiveInt, 1 as PositiveInt),
            offline_hotspot: fromNullable(t.boolean, false),
            noisyCGMTargetMultiplier: fromNullable(PositiveNumber, 1.3 as PositiveNumber),
            suspend_zeros_iob: fromNullable(t.boolean, true),
            enableEnliteBgproxy: fromNullable(t.boolean, false),
            calc_glucose_noise: fromNullable(t.boolean, false),
            target_bg: fromNullable(t.boolean, false),
            edison_battery_shutdown_voltage: fromNullable(PositiveInt, 3050 as PositiveInt),
            pi_battery_shutdown_percent: fromNullable(PositiveInt, 2 as PositiveInt),
            // no defaults
            basals: nonEmptyArray(BasalSchedule),
            settings: PumpSettings,
            targets: Targets,
        }),
        t.partial({
            model: t.string,
        }),
    ],
    'Preferences'
)

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
