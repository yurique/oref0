import * as t from 'io-ts'

export const Autosens = t.intersection([
    t.type({
        timestamp: t.string,
        ratio: t.number,
    }),
    t.partial({
        newisf: t.number
    })
]);

export type Autosens = t.TypeOf<typeof Autosens>
