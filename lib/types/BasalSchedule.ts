import * as t from 'io-ts'
import { PositiveInt } from './PositiveInt'
import { PositiveNumber } from './PositiveNumber'
import { ScheduleStart } from './ScheduleStart'

export interface BasalSchedule {
    i?: t.Int
    start: ScheduleStart
    minutes: PositiveInt
    rate: PositiveNumber
}

export const BasalSchedule: t.Type<BasalSchedule, unknown> = t.intersection(
    [
        t.type({
            start: ScheduleStart,
            minutes: PositiveInt,
            rate: PositiveNumber,
        }),
        t.partial({
            i: t.Int,
        }),
    ],
    'BasalSchedule'
)
