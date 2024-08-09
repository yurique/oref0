import * as t from 'io-ts'

export type GlucoseUnit = 'mg/dL' | 'mmol/L'
export const GlucoseUnit: t.Type<GlucoseUnit> = t.keyof(
    {
        'mg/dL': null,
        'mmol/L': null,
    },
    'GlucoseUnit'
)
