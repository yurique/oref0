import { right } from 'fp-ts/Either'
import * as t from 'io-ts'
import { date } from 'io-ts-types/date'
import { tz } from '../date'

export const LocalDateFromDate = new t.Type<Date, Date, Date>(
    'LocalDateFromDate',
    a => date.is(a),
    i => right(tz(i)),
    a => a
)
