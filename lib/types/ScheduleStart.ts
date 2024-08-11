import { Schema } from '@effect/schema'
import * as O from 'effect/Order'

export const ScheduleStartBrand = Symbol.for('ScheduleStart')

const pattern = '^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$'
export const ScheduleStart = Schema.String.pipe(Schema.pattern(new RegExp(pattern)))
    .pipe(Schema.brand(ScheduleStartBrand))
    .annotations({
        description: 'Time in HH:MM format',
    })

/**
 * Time in HH:MM
 */
export type ScheduleStart = typeof ScheduleStart.Type

export const Order: O.Order<ScheduleStart> = O.string
