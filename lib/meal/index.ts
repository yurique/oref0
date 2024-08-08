import { GlucoseEntry } from '../types/GlucoseEntry';
import { tz } from '../date';
import { NightscoutTreatment } from '../types/NightscoutTreatment';
import { BasalSchedule, Profile } from '../types/Profile';
import { PumpHistoryEvent } from '../types/PumpHistoryEvent';
import find_meals, { CarbEntry } from './history'
import sum from './total'

interface Input {
    history: Array<PumpHistoryEvent | NightscoutTreatment>
    carbs: CarbEntry[]
    profile: Profile
    basalprofile?: BasalSchedule[]
    glucose?: GlucoseEntry[]
    clock: string
}

export default function generate (inputs: Input) {

  var treatments = find_meals(inputs);

  var opts = {
    treatments: treatments,
    profile: inputs.profile,
    pumphistory: inputs.history,
    glucose: inputs.glucose,
    basalprofile: inputs.basalprofile,
    clock: inputs.clock
  };

  var clock = tz(new Date(inputs.clock));

  return /* meal_data */ sum(opts, clock);
}

exports = module.exports = generate;
