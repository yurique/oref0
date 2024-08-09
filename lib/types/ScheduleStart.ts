import * as t from 'io-ts'

export const ScheduleStart = t.refinement(t.string, s => /^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(s), 'ScheduleStart')
/**
 * Time in HH:MM
 */
export type ScheduleStart = t.TypeOf<typeof ScheduleStart>
