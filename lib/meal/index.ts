import { tz } from '../date'
import type { BasalSchedule } from '../types/BasalSchedule'
import type { GlucoseEntry } from '../types/GlucoseEntry'
import type { NightscoutTreatment } from '../types/NightscoutTreatment'
import type { Profile } from '../types/Profile'
import type { PumpHistoryEvent } from '../types/PumpHistoryEvent'
import type { CarbEntry } from './history'
import find_meals from './history'
import sum from './total'

interface Input {
    history: Array<PumpHistoryEvent | NightscoutTreatment>
    carbs: CarbEntry[]
    profile: Profile
    basalprofile?: BasalSchedule[]
    glucose?: GlucoseEntry[]
    clock: string
}

export default function generate(inputs: Input) {
    const treatments = find_meals(inputs)

    const opts = {
        treatments: treatments,
        profile: inputs.profile,
        pumphistory: inputs.history,
        basalprofile: inputs.basalprofile || [],
        glucose: inputs.glucose || [],
        clock: inputs.clock,
    }

    const clock = tz(new Date(inputs.clock))

    return /* meal_data */ sum(opts, clock)
}

exports = module.exports = generate
